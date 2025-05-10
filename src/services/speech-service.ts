// import { openai } from "@/lib/openai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const speechService = {
  async speechToText(audioFile: File): Promise<string | undefined> {
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const file = new File([buffer], "audio.webm", {
        type: audioFile.type,
      });

      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "text",
      });

      return transcription;
    } catch (error) {
      console.error("Transcription Has Failed", error);
    }
  },
};

// EXMAPLE:
// const text = await speechService.speechToText(file)
