import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, pin } = body;

    if (!slug || !pin) {
      return NextResponse.json({ error: "Missing required fields: slug and pin" }, { status: 400 });
    }

    // Query card by slug and edit_pin
    const { data: card, error } = await supabase
      .from("digital_cards")
      .select("edit_token")
      .eq("slug", slug)
      .eq("edit_pin", pin)
      .single();

    if (error || !card) {
      return NextResponse.json({ error: "Incorrect PIN for this card profile. Access denied." }, { status: 403 });
    }

    return NextResponse.json({ editToken: card.edit_token });
  } catch (err: any) {
    console.error("PIN Verification Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
