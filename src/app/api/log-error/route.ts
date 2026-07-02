import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { errorMessage, errorStack, apiRoute, requestData } = await req.json();

    if (!errorMessage) {
      return NextResponse.json({ error: "Missing errorMessage" }, { status: 400 });
    }

    const { error } = await supabase.from("error_logs").insert({
      error_message: errorMessage,
      error_stack: errorStack || null,
      api_route: apiRoute || null,
      request_data: requestData || null
    });

    if (error) {
      console.error("Failed to write to Supabase error_logs:", error);
      return NextResponse.json({ error: "Database write failed", details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API error logging handler failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
