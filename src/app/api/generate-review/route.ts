import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import fallbackReviewsData from "@/data/generic-reviews.json";

type StarRatingKey = "1" | "2" | "3" | "4" | "5";

function getRandomFallbackReview(stars: number, businessName: string): string {
  const normalizedStars = Math.min(5, Math.max(1, Math.round(stars || 5)));
  const starKey = String(normalizedStars) as StarRatingKey;
  const reviewsList = fallbackReviewsData[starKey] || fallbackReviewsData["5"];
  
  const randomIndex = Math.floor(Math.random() * reviewsList.length);
  const selectedTemplate = reviewsList[randomIndex];
  const nameToUse = businessName && businessName.trim() ? businessName.trim() : "this business";
  
  return selectedTemplate.replace(/BusinessName/g, nameToUse);
}

export async function POST(req: NextRequest) {
  let businessName = "";
  let stars = 0;
  let businessDescription = "";
  let slug = "";

  try {
    const body = await req.json();
    businessName = body.businessName;
    stars = body.stars;
    businessDescription = body.businessDescription;
    slug = body.slug;

    if (!businessName || !stars) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let businessData: any = null;
    if (slug) {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();
      businessData = data;
    }

    if (businessData && businessData.payment_status !== "completed") {
      const socials = businessData.social_links || {};
      const credits = socials.credits !== undefined ? Number(socials.credits) : 7;
      if (credits <= 0) {
        return NextResponse.json({ error: "This business has run out of free AI review credits. Please ask the owner to upgrade to the Pro plan!" }, { status: 403 });
      }
    }

    let generatedReview = "";

    try {
      const apiKey = process.env.OPENAI_API_KEY || "";
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is missing in environment variables.");
      }

      const openai = new OpenAI({ apiKey });

      const prompt = `Write a short, realistic, SEO-friendly Google Review (STRICTLY 2-3 sentences max, NO long paragraphs) for a business named "${businessName}".
The customer rated them ${stars} out of 5 stars.
Business Description / Services: ${businessDescription || 'A local service business.'}

CRITICAL INSTRUCTIONS:
- Keep it STRICTLY short: 2 to 3 sentences max.
- Make it sound like a real, authentic customer wrote it naturally.
- Mention specific services, products, or details from the Business Description to boost local SEO.
- Do NOT include quotes around the review, headers, or hashtags.`;

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You write short 2-3 sentence, human-like, SEO-optimized Google reviews." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      generatedReview = chatCompletion.choices[0]?.message?.content?.trim() || "";
      // Strip leading and trailing quotes from the AI response
      generatedReview = generatedReview.replace(/^["']+|["']+$/g, '');
    } catch (aiError: any) {
      console.error("OpenAI API Error:", aiError);

      // Log AI error to Supabase error_logs table for background monitoring
      try {
        await supabase.from("error_logs").insert({
          error_message: aiError.message || String(aiError),
          error_stack: aiError.stack || null,
          api_route: "/api/generate-review",
          request_data: { businessName, stars, businessDescription, provider: "openai" }
        });
      } catch (dbError) {
        console.error("Failed to log error to Supabase:", dbError);
      }

      // Use fail-safe fallback review
      generatedReview = getRandomFallbackReview(stars, businessName);
    }

    // Fallback safeguard if for any reason generatedReview is empty
    if (!generatedReview) {
      generatedReview = getRandomFallbackReview(stars, businessName);
    }

    // Decrement credit if business was found and payment status is not completed
    if (businessData && businessData.payment_status !== "completed") {
      const socials = businessData.social_links || {};
      const credits = socials.credits !== undefined ? Number(socials.credits) : 7;
      const updatedSocials = {
        ...socials,
        credits: Math.max(0, credits - 1)
      };
      await supabase
        .from("businesses")
        .update({ social_links: updatedSocials })
        .eq("slug", slug);
    }

    return NextResponse.json({ review: generatedReview });
  } catch (error: any) {
    console.error("Generate Review Error:", error);

    // Fail safe fallback response for critical failures
    const fallbackReview = getRandomFallbackReview(stars || 5, businessName || "this business");
    return NextResponse.json({ review: fallbackReview });
  }
}
