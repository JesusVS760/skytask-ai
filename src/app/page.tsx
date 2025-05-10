"use client";
import VoiceTranscriber from "@/features/voice/components/voice-transcriber";
import { useLlmMutation } from "@/features/voice/hooks/llm-mutation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// FRONTEND
// 1. Create a animated loading state, when the speech is being transcribed.

// BACKEND
// 1. Create a llm-service.ts
// take in text and send to llm and spit out json
//  1a. Create a function that will take in text and output a json structured task according to your prisma schema of task.
//  1b. Ensure that the llm returns follow up question. If the llm doesn't have enough information about the task (e.g. time, date, etc.)
// if follow up question DONT CREATE TASK
// gpt-4.1

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]); // saves context & follow up question if needed
  const [response, setResponse] = useState(""); // input
  const [isLoading, setIsLoading] = useState(false);
  const [taskJson, setTaskJson] = useState<any>(null); // parsed task object

  // new endpoint needed

  const llm = useLlmMutation();
  useEffect(() => {
    if (llm.data) {
      if (llm.data.followUpQuestion) {
        setMessages((prev) => [...prev, ` ${llm.data.followUpQuestion}`]);
        setTaskJson(null);
      } else if (llm.data.task) {
        setTaskJson(llm.data.task);
        setMessages((prev) => [...prev, `✅ Task created!`]);
      }
    }
  }, [llm.data]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {taskJson && (
        <div className="bg-green-100 p-3 rounded w-full max-w-md overflow-auto">
          <pre>{JSON.stringify(taskJson, null, 2)}</pre>
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold">LLM Assistant</h1>
        <p
          className={cn(
            "max-w-xl text-center font-bold m-3",
            messages.length > 0 && "bg-amber-300  p-5 rounded-2xl"
          )}
        >
          {messages}
        </p>
      </div>
      <VoiceTranscriber
        onTranscribe={(text) => {
          setResponse(text ?? "");
          llm.mutate(text ?? "");
        }}
        onLoadingChange={setIsLoading}
      />
      <div className="p-3 font-semibold">
        {isLoading && <p className="text-blue-500 animate-pulse">Transcribing...</p>}
        <p>{response}</p>
      </div>
    </div>
  );
}
