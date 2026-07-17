import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { slug, name, email, phone, message } = await req.json();

    // Fetch the business by slug
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("id, leads, social_links, payment_status")
      .eq("slug", slug)
      .single();

    if (fetchError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Enforce 7 free leads limit
    const hasPaid = business.payment_status === "active" || business.payment_status === "completed";
    const existingLeads = Array.isArray(business.leads) ? business.leads : [];
    if (!hasPaid && existingLeads.length >= 7) {
      return NextResponse.json({ 
        error: "This business has reached the maximum limit of 7 free leads. Please upgrade to Pro to accept more inquiries." 
      }, { status: 403 });
    }

    const socials = business.social_links as any || {};
    const requiredFields = socials.contact_required_fields || 'email';
    const isEmailRequired = requiredFields === 'email' || requiredFields === 'both';
    const isPhoneRequired = requiredFields === 'phone' || requiredFields === 'both';

    if (!name || !message) {
      return NextResponse.json({ error: "Name and Message are required fields." }, { status: 400 });
    }
    if (isEmailRequired && !email) {
      return NextResponse.json({ error: "Email Address is required." }, { status: 400 });
    }
    if (isPhoneRequired && !phone) {
      return NextResponse.json({ error: "Phone Number is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]{7,18}$/;

    if (email && !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone && !phoneRegex.test(phone.trim())) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const leadStages = socials.lead_stages || ["New", "Contacted", "Accepted", "Rejected"];
    const defaultStatus = leadStages[0] || "New";

    // Structure the new lead
    const newLead = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name,
      email,
      phone: phone || null,
      message,
      status: defaultStatus,
      created_at: new Date().toISOString()
    };

    // Prepend the new lead
    const updatedLeads = [newLead, ...existingLeads];

    // Save updated leads list back to the business row
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ leads: updatedLeads })
      .eq("id", business.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
