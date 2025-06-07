import { Task } from "@/generated/prisma";
import { useMutation } from "@tanstack/react-query";
import { ContextMessage } from "../schemas/context";

type LLMResponse = {
  task?: Task;
  followUpQuestion?: string;
};

type GenerateTask = {
  text?: string;
  context: ContextMessage[];
};

export const useLLMMutations = () => {
  const generateTask = useMutation({
    mutationFn: async ({ text, context }: GenerateTask): Promise<LLMResponse> => {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch llm");
      }

      const response = await res.json();
      return response;
    },

    onError: (error: Error) => {
      console.error("LLM ERROR: ", error);
    },
  });

  return { generateTask };
};
