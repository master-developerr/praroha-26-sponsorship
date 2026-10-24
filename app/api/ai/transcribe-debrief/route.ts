import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let audioBuffer: Buffer | null = null;
    let audioMimeType = "audio/webm";
    let companyName = "Target Company";
    let industry = "General Industry";
    let leadStatus = "CONTACTED";
    let clientTranscript: string | undefined = undefined;
    let volunteerId: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("audio") as File | null;
      if (audioFile && typeof audioFile.arrayBuffer === "function") {
        const arrayBuf = await audioFile.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuf);
        audioMimeType = audioFile.type || "audio/webm";
      }

      companyName = (formData.get("companyName") as string) || companyName;
      industry = (formData.get("industry") as string) || industry;
      leadStatus = (formData.get("leadStatus") as string) || leadStatus;
      clientTranscript = (formData.get("clientTranscript") as string) || undefined;
      volunteerId = (formData.get("volunteerId") as string) || undefined;
    } else {
      const body = await req.json();
      companyName = body.companyName || companyName;
      industry = body.industry || industry;
      leadStatus = body.leadStatus || leadStatus;
      clientTranscript = body.clientTranscript;
      volunteerId = body.volunteerId;

      if (body.audioBase64) {
        audioBuffer = Buffer.from(body.audioBase64, "base64");
        audioMimeType = body.mimeType || "audio/webm";
      }
    }

    const response = await aiService.transcribeAndAnalyzeVoiceDebrief(
      audioBuffer,
      audioMimeType,
      {
        companyName,
        industry,
        leadStatus,
        clientTranscript,
      },
      { volunteerId }
    );

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[API /api/ai/transcribe-debrief Error]:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: "Debrief transcription and intelligence extraction is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
