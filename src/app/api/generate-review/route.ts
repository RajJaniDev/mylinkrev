import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { businessName, stars, businessDescription } = await req.json();

    if (!businessName || !stars) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `Write a short, SEO-friendly, realistic Google Review (2-3 sentences) for a business named "${businessName}". 
The customer gave them a ${stars} out of 5 stars rating.
Business Description: ${businessDescription || 'A local business.'}

CRITICAL INSTRUCTIONS:
- The review MUST explicitly mention specific services, products, or details from the Business Description to boost local SEO.
- Do NOT write a generic review. It must be highly specific to what this business actually does.
- It must sound like a real, satisfied customer wrote it naturally.
- Do not include hashtags. Keep it concise (2-3 sentences max).`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 150,
    });

    let generatedReview = chatCompletion.choices[0]?.message?.content || "";
    // Strip leading and trailing quotes from the AI response
    generatedReview = generatedReview.trim().replace(/^["']+|["']+$/g, '');

    return NextResponse.json({ review: generatedReview });
  } catch (error: any) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
}
