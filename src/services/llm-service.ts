// import { openai } from "@/lib/openai";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Task = {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "archived" | "completed" | "pending";
  dueDate: string;
  tags: string[];
  isRecurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "biweekly" | "monthly";
};

type LlmResponse = {
  task?: Task;
  followUpQuestion?: string;
};

export const LlmService = {
  async LlmServiceText(text: string): Promise<LlmResponse> {
    const systemPrompt = `
You are a helpful assistant that converts user input into a JSON task object that matches the following schema:

{
  "task": {
    "title": string,
    "description": string (optional),
    "status": "pending" | "completed" | "archived" (default to "pending"),
    "priority": "high" | "medium" | "low",
    "dueDate": string (ISO 8601 format),
    "tags": string[],
    "isRecurring": boolean (optional, default false),
    "recurringInterval": "daily" | "weekly" | "biweekly" | "monthly" (optional)
  },
  "followUpQuestion": string (optional, include only if something is missing like date or priority)
}

Only return valid JSON. Do not explain or provide extra text. If the input is missing necessary information, add a follow-up question.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      });

      const content = completion.choices[0]?.message.content;

      if (!content) throw new Error("No response from OpenAI");

      const parsed = JSON.parse(content) as LlmResponse;

      if (parsed.followUpQuestion) {
        return {
          followUpQuestion: parsed.followUpQuestion,
        };
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      return { followUpQuestion: "There was an error processing the task." };
    }
  },
};
