import { speechService } from "@/services/speech-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("file");

    if (!audioFile) {
      return NextResponse.json(
        {
          error: "No audio file was provided",
        },
        {
          status: 400,
        }
      );
    }

    const text = await speechService.speechToText(audioFile as File);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcription Error", error);
    return NextResponse.json({ error: "Transcription Failed" }, { status: 500 });
  }
}
