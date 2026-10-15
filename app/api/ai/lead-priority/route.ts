import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, forceFresh } = body;

    if (!company || !company.companyName) {
      return NextResponse.json(
        { success: false, error: "Company information is required." },
        { status: 400 }
      );
    }

    const response = await aiService.prioritizeLead(company, {
      forceFresh: Boolean(forceFresh),
    });

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[API /api/ai/lead-priority Error]:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: "Lead prioritization explanation is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
