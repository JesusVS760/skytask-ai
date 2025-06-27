import { ContextMessage } from "@/features/voice/schemas/context";
import { Task } from "@/generated/prisma";
import { openai, taskPrompt } from "@/lib/openai";

type LlmResponse = {
  task?: Task;
  followUpQuestion?: string;
};

export const llmService = {
  async generateTask(text: string, context: ContextMessage[]): Promise<LlmResponse> {
    try {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const systemPrompt = `
      INSTRUCTIONS:
        ${taskPrompt}
      CONVERSATION HISTORY:
      ${JSON.stringify(context)}
      CURRENT DATE:
      ${date}
      CURRENT TIME:
      ${time}
        `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Note: "gpt-4.1" doesn't exist, use "gpt-4o" or "gpt-4"
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      });

      const content = completion.choices[0]?.message.content;

      if (!content) throw new Error("No response from OpenAI");

      const parsed = JSON.parse(content) as LlmResponse;
      console.log(content);

      if (parsed.followUpQuestion) {
        return {
          followUpQuestion: parsed.followUpQuestion,
        };
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      return { followUpQuestion: "There was an error processing the task. Try again!" };
    }
  },
};
