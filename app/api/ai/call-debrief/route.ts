import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, volunteerId } = body;

    if (!input || !input.discussionSummary) {
      return NextResponse.json(
        { success: false, error: "Discussion notes or transcript required for debrief analysis." },
        { status: 400 }
      );
    }

    const response = await aiService.analyzeCallDebrief(input, { volunteerId });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[API /api/ai/call-debrief Error]:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: "Debrief analysis is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
