import { useMutation } from "@tanstack/react-query";

type LlmResponse = {
  task?: any;
  followUpQuestion?: string;
};

export const useLlmMutation = () => {
  return useMutation({
    mutationFn: async (text: string): Promise<LlmResponse> => {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch llm");
      }

      const response = await res.json();
      return response;
    },

    onError: (error: any) => {
      console.error("LLM ERROR: ", error);
    },
  });
};
