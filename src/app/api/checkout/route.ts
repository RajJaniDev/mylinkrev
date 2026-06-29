import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (name && slug) {
      // Create business record as completed (bypassing payment temporarily)
      const { error } = await supabase.from("businesses").insert({
        user_id: userId,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        name,
        payment_status: 'completed'
      });
      
      if (error) {
        console.error("Supabase insert error:", error);
        // If slug is taken, we should ideally handle it gracefully
        return NextResponse.redirect(`${origin}/dashboard?error=SlugTaken`, { status: 303 });
      }
    }

    // Bypass Stripe completely for testing
    return NextResponse.redirect(`${origin}/dashboard?success=true`, { status: 303 });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
