import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      jobTitle,
      companyName,
      email,
      phone,
      website,
      address,
      linkedin,
      instagram,
      logoBase64,
      qrDestination,
      mapUrl,
      templateId,
      customAccent,
      editPin,
      token // Pass token if editing
    } = body;

    if (!fullName || !companyName || !email || !editPin) {
      return NextResponse.json({ error: "Missing required fields: fullName, companyName, email, and editPin" }, { status: 400 });
    }

    // UPDATE FLOW
    if (token) {
      // Find card with this token
      const { data: existing, error: fetchError } = await supabase
        .from("digital_cards")
        .select("id")
        .eq("edit_token", token)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json({ error: "Invalid edit token. Access denied." }, { status: 403 });
      }

      // Update card
      const { error: updateError } = await supabase
        .from("digital_cards")
        .update({
          full_name: fullName,
          job_title: jobTitle,
          company_name: companyName,
          email,
          phone,
          website,
          address,
          linkedin,
          instagram,
          logo_base64: logoBase64,
          qr_destination: qrDestination,
          map_url: mapUrl,
          template_id: templateId,
          custom_accent: customAccent,
          edit_pin: editPin // Allow updating PIN too
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, token, slug: body.slug });
    }

    // INSERT FLOW
    // Generate clean unique slug
    let baseSlug = `${fullName}-${companyName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let finalSlug = baseSlug;
    let isUnique = false;
    let counter = 0;

    while (!isUnique) {
      const { data: duplicate } = await supabase
        .from("digital_cards")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (!duplicate) {
        isUnique = true;
      } else {
        counter++;
        finalSlug = `${baseSlug}-${counter}`;
      }
    }

    // Generate random secure token
    const editToken = randomBytes(24).toString("hex");

    const { error: insertError } = await supabase
      .from("digital_cards")
      .insert({
        slug: finalSlug,
        full_name: fullName,
        job_title: jobTitle,
        company_name: companyName,
        email,
        phone,
        website,
        address,
        linkedin,
        instagram,
        logo_base64: logoBase64,
        qr_destination: qrDestination,
        map_url: mapUrl,
        template_id: templateId,
        custom_accent: customAccent,
        edit_pin: editPin,
        edit_token: editToken
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, token: editToken, slug: finalSlug });
  } catch (err: any) {
    console.error("Save Card Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
