import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    if (!secret) {
      console.warn("Webhook secret not configured. Bypassing signature check for dev.");
    } else {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const signatureBuffer = Buffer.from(signature, "utf8");

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data || {};

    if (eventName === 'order_created') {
      const businessSlug = customData.business_slug;

      if (businessSlug) {
        const { error } = await supabase
          .from('businesses')
          .update({ payment_status: 'completed' })
          .eq('slug', businessSlug);
          
        if (error) {
          console.error("Failed to update business payment status:", error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
