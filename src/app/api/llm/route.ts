import { LlmService } from "@/services/llm-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const result = await LlmService.LlmServiceText(text);

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
