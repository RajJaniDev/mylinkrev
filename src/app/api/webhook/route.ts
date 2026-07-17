import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let rawBody = "";
  let payload: any = null;
  const signature = req.headers.get("webhook-signature") || "";
  const timestamp = req.headers.get("webhook-timestamp") || "";
  const webhookId = req.headers.get("webhook-id") || "";

  try {
    rawBody = await req.text();
    
    // Log the incoming request details for debugging in Supabase
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {}

    await supabase.from("error_logs").insert({
      error_message: "Webhook request received",
      api_route: "webhook",
      request_data: {
        headers: {
          "webhook-id": webhookId,
          "webhook-signature": signature,
          "webhook-timestamp": timestamp,
        },
        payload: payload || rawBody
      }
    });

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
        
        // Log the verification failure to database
        await supabase.from("error_logs").insert({
          error_message: `Signature verification failed: ${e.message}`,
          error_stack: e.stack,
          api_route: "webhook",
          request_data: {
            signature,
            timestamp,
            webhookId
          }
        });

        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    if (payload) {
      const eventType = payload.type;
      const isActivationEvent = ['payment.succeeded', 'subscription.created', 'subscription.activated'].includes(eventType);
      const isDeactivationEvent = ['subscription.cancelled', 'subscription.failed'].includes(eventType);

      if (isActivationEvent || isDeactivationEvent) {
        const businessSlug = payload.data?.metadata?.business_slug || payload.data?.object?.metadata?.business_slug;
        const targetStatus = isActivationEvent ? 'active' : 'pending';

        if (businessSlug) {
          const { error } = await supabase
            .from('businesses')
            .update({ payment_status: targetStatus })
            .eq('slug', businessSlug);
            
          if (error) {
            console.error("Failed to update business payment status:", error);
            
            await supabase.from("error_logs").insert({
              error_message: `Database update failed: ${error.message}`,
              api_route: "webhook",
              request_data: { businessSlug, targetStatus, error }
            });

            return NextResponse.json({ error: error.message }, { status: 500 });
          } else {
            // Log successful database update
            await supabase.from("error_logs").insert({
              error_message: `Successfully updated payment status to ${targetStatus} for ${businessSlug}`,
              api_route: "webhook",
              request_data: { businessSlug, targetStatus }
            });
          }
        } else {
          // Log missing slug error
          await supabase.from("error_logs").insert({
            error_message: "Missing business_slug in webhook payload metadata",
            api_route: "webhook",
            request_data: payload
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    
    try {
      await supabase.from("error_logs").insert({
        error_message: `Webhook processing failed: ${err.message}`,
        error_stack: err.stack,
        api_route: "webhook",
        request_data: { rawBody }
      });
    } catch (e) {}

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
