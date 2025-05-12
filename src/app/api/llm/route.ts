import { llmService } from "@/services/llm-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, context } = await req.json();

    const result = await llmService.generateTask(text, context);

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
