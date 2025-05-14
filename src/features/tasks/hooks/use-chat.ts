import { ContextMessage } from "@/features/voice/schemas/context";
import { useMemo, useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<ContextMessage[]>([]);

  const reset = () => {
    setMessages([]);
  };

  const append = (msg: ContextMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const lastAgentMessage = useMemo(() => {
    const agentMessages = messages.filter((m) => m.role === "agent");
    return agentMessages[agentMessages.length - 1]?.message;
  }, [messages]);

  const lastUserMessage = useMemo(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    return userMessages[userMessages.length - 1]?.message;
  }, [messages]);

  return { messages, reset, append, lastAgentMessage, lastUserMessage };
};
