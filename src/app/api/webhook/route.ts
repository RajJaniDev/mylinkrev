import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("webhook-signature") || "";
    const timestamp = req.headers.get("webhook-timestamp") || "";
    const webhookId = req.headers.get("webhook-id") || "";
    
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes("your_dodo_webhook_secret_here")) {
      console.warn("Webhook secret not configured or using default placeholder. Bypassing signature check.");
    } else {
      const client = new DodoPayments({
        bearerToken: apiKey || "",
        webhookKey: webhookSecret,
      });

      try {
        client.webhooks.unwrap(rawBody, {
          headers: {
            "webhook-id": webhookId,
            "webhook-signature": signature,
            "webhook-timestamp": timestamp,
          },
        });
      } catch (e: any) {
        console.error("Signature verification failed:", e.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;

    if (eventType === 'payment.succeeded') {
      const businessSlug = payload.data?.metadata?.business_slug;

      if (businessSlug) {
        const { error } = await supabase
          .from('businesses')
          .update({ payment_status: 'completed' })
          .eq('slug', businessSlug);
          
        if (error) {
          console.error("Failed to update business payment status:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
