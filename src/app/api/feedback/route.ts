import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, contact, message, stars } = body;

    // Strict validation for required fields
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Business identifier (slug) is required." }, { status: 400 });
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!contact || typeof contact !== "string" || contact.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a valid email address or phone number." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please describe your experience or problem in detail." }, { status: 400 });
    }

    const numericStars = Number(stars);
    if (isNaN(numericStars) || numericStars < 1 || numericStars > 5) {
      return NextResponse.json({ error: "Valid star rating is required." }, { status: 400 });
    }

    // Fetch the business by slug
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("id, feedbacks, social_links")
      .eq("slug", slug)
      .single();

    if (fetchError || !business) {
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

    // Primary attempt: update 'feedbacks' column on 'businesses' table
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ feedbacks: updatedFeedbacks })
      .eq("id", business.id);

    // Fallback safeguard: if column update fails, save into social_links.feedbacks JSONB
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
