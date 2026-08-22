import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { qr_customization } = body;

    if (!qr_customization) {
      return NextResponse.json({ error: "Missing customization payload" }, { status: 400 });
    }

    // Fetch existing business for this user
    const { data: business, error: fetchErr } = await supabase
      .from("businesses")
      .select("id, social_links")
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const existingSocials = business.social_links || {};
    const updatedSocials = {
      ...existingSocials,
      qr_customization,
    };

    const { error: updateErr } = await supabase
      .from("businesses")
      .update({ social_links: updatedSocials })
      .eq("id", business.id);

    if (updateErr) {
      console.error("Supabase update error:", updateErr);
      return NextResponse.json({ error: "Failed to update QR customization" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save QR Customization error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
