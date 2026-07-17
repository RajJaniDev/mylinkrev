import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode";

    // Geolocation detection (INR for India, USD for others)
    const isIndiaCookie = req.cookies.get("user_is_india")?.value;
    let isIndia = false;
    
    if (isIndiaCookie !== undefined) {
      isIndia = isIndiaCookie === "true";
    } else {
      const countryHeader = (
        req.headers.get("cf-ipcountry") || 
        req.headers.get("x-vercel-ip-country") || 
        req.headers.get("cloudfront-viewer-country") || 
        req.headers.get("x-country-code") || 
        ""
      ).toUpperCase();

      if (countryHeader === "IN") {
        isIndia = true;
      } else {
        const acceptLang = req.headers.get("accept-language") || "";
        if (acceptLang.includes("en-IN") || acceptLang.includes("hi-IN")) {
          isIndia = true;
        }
      }
    }

    // Fetch dynamic pricing settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value");

    const settings = settingsData?.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {}) || {};

    let productId = isIndia
      ? settings.price_inr_variant_id || process.env.DODO_PAYMENTS_INR_PRODUCT_ID
      : settings.price_usd_variant_id || process.env.DODO_PAYMENTS_USD_PRODUCT_ID;

    // Check if configuration is missing or holds placeholder values
    const isMissingConfig =
      !apiKey ||
      apiKey.includes("your_dodo_api_key_here") ||
      !productId ||
      productId.includes("your_dodo_inr_product_id_here") ||
      productId.includes("your_dodo_usd_product_id_here") ||
      productId.includes("YOUR_INR_VARIANT_ID") ||
      productId.includes("YOUR_USD_VARIANT_ID");

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (slug) {
      const finalSlug = slug.toLowerCase().replace(/\s+/g, '-');
      
      if (name) {
        // Create business record as pending
        const { error } = await supabase.from("businesses").insert({
          user_id: userId,
          slug: finalSlug,
          name,
          payment_status: 'pending'
        });
        
        if (error) {
          console.error("Supabase insert error:", error);
          return NextResponse.redirect(`${origin}/dashboard?error=SlugTaken`, { status: 303 });
        }
      } else {
        // Resuming payment: check if business exists and is pending
        const { data: existing } = await supabase
          .from("businesses")
          .select("payment_status")
          .eq("slug", finalSlug)
          .eq("user_id", userId)
          .single();
          
        if (!existing || existing.payment_status === 'completed' || existing.payment_status === 'active') {
          return NextResponse.redirect(`${origin}/dashboard?error=InvalidRequest`, { status: 303 });
        }
      }

      // If we don't have Dodo Payments configured yet, bypass checkout so the user isn't blocked during setup
      if (isMissingConfig) {
        console.warn("Dodo Payments credentials missing or using placeholders. Bypassing checkout and auto-activating business.");
        await supabase.from("businesses").update({ payment_status: 'completed' }).eq('slug', finalSlug);
        return NextResponse.redirect(`${origin}/dashboard?success=true`, { status: 303 });
      }

      // Fetch user details from Clerk session to prefill checkout
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
      const customerName = clerkUser ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() : "";

      // Initialize Dodo Payments client
      const client = new DodoPayments({
        bearerToken: apiKey,
        environment: environment,
      });

      // Create Dodo Payments checkout session
      const checkoutSession = await client.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        customer: {
          email: email,
          name: customerName || undefined,
        },
        metadata: {
          business_slug: finalSlug, // Passed so the webhook knows which business paid
        },
        return_url: `${origin}/dashboard?success=true`,
      });

      if (!checkoutSession || !checkoutSession.checkout_url) {
        console.error("Dodo Payments Checkout Error: Session creation failed or missing checkout_url");
        return NextResponse.redirect(`${origin}/dashboard?error=CheckoutFailed`, { status: 303 });
      }

      // Redirect user to Dodo Payments hosted checkout
      return NextResponse.redirect(checkoutSession.checkout_url, { status: 303 });
    }

    return NextResponse.redirect(`${origin}/dashboard?error=MissingData`, { status: 303 });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
