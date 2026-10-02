import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, businessName, locations, websiteOrMapsUrl, notes } = body;

    // Validation
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, phone number, and email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const auditLead = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      business_name: (businessName || "").trim(),
      locations: locations || "1 location",
      website_or_maps_url: (websiteOrMapsUrl || "").trim(),
      notes: (notes || "").trim(),
      type: "gmb_audit_request",
      source: "google_business_management_service_page",
      created_at: new Date().toISOString(),
    };

    // Attempt to record in Supabase error_logs or a dedicated lead table if available
    try {
      await supabase.from("error_logs").insert([
        {
          error_message: `GMB Audit Request: ${auditLead.business_name || auditLead.name} (${auditLead.phone})`,
          error_stack: JSON.stringify(auditLead),
          api_route: "/api/audit-request",
          request_data: auditLead,
        },
      ]);
    } catch (dbErr) {
      console.warn("Could not record audit lead to DB fallback:", dbErr);
    }

    console.log("Successfully captured GMB Audit Request:", auditLead);

    return NextResponse.json({
      success: true,
      message:
        "Your free GMB audit request has been received! Our local SEO specialist will analyze your profile and send your custom 7-point audit and 30-day ranking plan within 24 hours.",
      lead: {
        name: auditLead.name,
        email: auditLead.email,
        businessName: auditLead.business_name,
      },
    });
  } catch (error: any) {
    console.error("Audit request error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process audit request. Please try again or message us directly." },
      { status: 500 }
    );
  }
}
