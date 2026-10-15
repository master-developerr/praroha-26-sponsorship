import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, forceFresh, volunteerId } = body;

    if (!company || !company.companyName) {
      return NextResponse.json(
        { success: false, error: "Company information is required." },
        { status: 400 }
      );
    }

    const response = await aiService.generateCompanyAnalysis(company, {
      forceFresh: Boolean(forceFresh),
      volunteerId,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[API /api/ai/company-analysis Error]:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: "AI analysis is temporarily unavailable. Please retry shortly.",
      },
      { status: 500 }
    );
  }
}
