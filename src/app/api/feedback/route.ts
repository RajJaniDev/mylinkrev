import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isValidContact(contact: string): boolean {
  const trimmed = contact.trim();
  if (!trimmed) return false;

  // 1. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return true;

  // 2. Phone number validation (must contain valid phone characters and 7 to 15 digits)
  const phoneRegex = /^[+]?[\d\s\-()]{7,18}$/;
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (phoneRegex.test(trimmed) && digitsOnly.length >= 7 && digitsOnly.length <= 15) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, businessId, name, contact, message, stars } = body;

    // Validation for required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your valid name." }, { status: 400 });
    }

    if (!contact || typeof contact !== "string" || !isValidContact(contact)) {
      return NextResponse.json({ 
        error: "Please enter a valid phone number or email address (e.g. name@example.com or +1 234 567 8900)." 
      }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 3) {
      return NextResponse.json({ error: "Please describe your experience or problem." }, { status: 400 });
    }

    const numericStars = Number(stars);
    if (isNaN(numericStars) || numericStars < 1 || numericStars > 5) {
      return NextResponse.json({ error: "Valid star rating is required." }, { status: 400 });
    }

    // Fetch the business by businessId or slug
    let business: any = null;
    let fetchError: any = null;

    if (businessId) {
      const res = await supabase
        .from("businesses")
        .select("id, feedbacks, social_links")
        .eq("id", businessId)
        .single();
      business = res.data;
      fetchError = res.error;
    }

    if (!business && slug) {
      const cleanSlug = decodeURIComponent(String(slug)).trim();
      const res = await supabase
        .from("businesses")
        .select("id, feedbacks, social_links")
        .ilike("slug", cleanSlug)
        .single();
      business = res.data;
      fetchError = res.error;

      if (!business) {
        const exactRes = await supabase
          .from("businesses")
          .select("id, feedbacks, social_links")
          .eq("slug", cleanSlug)
          .single();
        business = exactRes.data;
        fetchError = exactRes.error;
      }
    }

    if (fetchError || !business) {
      console.error("Business not found in feedback route:", { businessId, slug, fetchError });
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    const socials = business.social_links as any || {};
    const existingFeedbacks = Array.isArray(business.feedbacks)
      ? business.feedbacks
      : (Array.isArray(socials.feedbacks) ? socials.feedbacks : []);

    const newFeedback = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: name.trim(),
      contact: contact.trim(),
      message: message.trim(),
      stars: numericStars,
      created_at: new Date().toISOString()
    };

    const updatedFeedbacks = [newFeedback, ...existingFeedbacks];

    // Primary update attempt on 'feedbacks' column
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ feedbacks: updatedFeedbacks })
      .eq("id", business.id);

    // Fallback update on social_links.feedbacks
    if (updateError) {
      console.warn("Updating 'feedbacks' column failed, saving into social_links.feedbacks fallback:", updateError.message);
      const updatedSocials = {
        ...socials,
        feedbacks: updatedFeedbacks
      };
      const { error: fallbackError } = await supabase
        .from("businesses")
        .update({ social_links: updatedSocials })
        .eq("id", business.id);

      if (fallbackError) {
        console.error("Failed to save feedback to fallback:", fallbackError);
        return NextResponse.json({ error: "Failed to submit feedback. Please try again." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
