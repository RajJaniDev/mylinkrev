import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode";

    // Parse request body
    const body = await req.json();
    const { businessName, email, reviewLink } = body;

    if (!businessName || !email) {
      return NextResponse.json({ error: "Missing required fields: businessName and email" }, { status: 400 });
    }

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

    // Fetch dynamic pricing settings from settings table
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value");

    const settings = settingsData?.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {}) || {};

    // Get the separate product IDs for the QR tool
    let productId = isIndia
      ? settings.qr_price_inr_variant_id || process.env.DODO_PAYMENTS_QR_INR_PRODUCT_ID
      : settings.qr_price_usd_variant_id || process.env.DODO_PAYMENTS_QR_USD_PRODUCT_ID;

    // Check if configuration is missing or holds placeholder values
    const isMissingConfig =
      !apiKey ||
      apiKey.includes("your_dodo_api_key_here") ||
      !productId ||
      productId.includes("your_dodo_qr_inr_product_id_here") ||
      productId.includes("your_dodo_qr_usd_product_id_here");

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const returnUrl = `${origin}/tools/google-review-qr?success=true&businessName=${encodeURIComponent(businessName)}`;

    // If Dodo Payments is not configured, bypass checkout for testing and simulate success
    if (isMissingConfig) {
      console.warn("Dodo Payments credentials for QR tool missing or using placeholders. Bypassing checkout and auto-unlocking.");
      return NextResponse.json({ 
        checkoutUrl: returnUrl,
        warning: "Bypass mode activated due to missing Dodo configuration"
      });
    }

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
        name: businessName,
      },
      metadata: {
        qr_tool_payment: "true",
        business_name: businessName,
        review_link: reviewLink || ""
      },
      return_url: returnUrl,
    });

    if (!checkoutSession || !checkoutSession.checkout_url) {
      console.error("Dodo Payments Checkout Error: Session creation failed or missing checkout_url");
      return NextResponse.json({ error: "Checkout session creation failed" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: checkoutSession.checkout_url });
  } catch (err: any) {
    console.error("Error creating QR checkout session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
