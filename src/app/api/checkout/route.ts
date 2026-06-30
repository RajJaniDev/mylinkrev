import { NextRequest, NextResponse } from "next/server";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      console.error("Missing Lemon Squeezy configuration");
      // Fallback for development if keys aren't set yet
      // return NextResponse.redirect(`${req.headers.get("origin")}/dashboard?error=MissingConfig`, { status: 303 });
    } else {
      lemonSqueezySetup({ apiKey });
    }
    
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
          
        if (!existing || existing.payment_status === 'completed') {
          return NextResponse.redirect(`${origin}/dashboard?error=InvalidRequest`, { status: 303 });
        }
      }

      // If we don't have Lemon Squeezy configured yet, just bypass for now so the user isn't totally blocked while setting up
      if (!apiKey || !storeId || !variantId) {
        // Automatically mark complete if no keys (for testing/setup)
        await supabase.from("businesses").update({ payment_status: 'completed' }).eq('slug', finalSlug);
        return NextResponse.redirect(`${origin}/dashboard?success=true`, { status: 303 });
      }

      // Create Lemon Squeezy checkout
      const { data: checkout, error: checkoutError } = await createCheckout(storeId, variantId, {
        checkoutData: {
          custom: {
            business_slug: finalSlug // We pass this so the webhook knows which business paid
          }
        },
        productOptions: {
          redirectUrl: `${origin}/dashboard?success=true`,
          receiptButtonText: "Return to Dashboard",
          receiptThankYouNote: "Thank you for joining MyRevLink!"
        }
      });

      if (checkoutError || !checkout) {
        console.error("Lemon Squeezy Checkout Error:", checkoutError);
        return NextResponse.redirect(`${origin}/dashboard?error=CheckoutFailed`, { status: 303 });
      }

      // Redirect user to Lemon Squeezy hosted checkout
      return NextResponse.redirect(checkout.data.attributes.url, { status: 303 });
    }

    return NextResponse.redirect(`${origin}/dashboard?error=MissingData`, { status: 303 });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
