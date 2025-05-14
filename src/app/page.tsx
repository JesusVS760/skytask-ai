"use client";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { useTaskMutations } from "@/features/tasks/hooks/tasks-mutations";
import { useChat } from "@/features/tasks/hooks/use-chat";
import VoiceRecorder from "@/features/voice/components/voice-recorder";
import { useLLMMutations } from "@/features/voice/hooks/llm-mutation";
import { parseDateTime } from "@/lib/utils";
import { useState } from "react";

//  - Create API routes for delete & update task

export default function Home() {
  const { messages, append, reset, lastAgentMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const { generateTask } = useLLMMutations();
  const { createTask } = useTaskMutations();

  const handleTranscription = async (text: string | undefined) => {
    append({ message: text ?? "", role: "user" });

    await generateTask.mutateAsync(
      { text, context: messages ?? [] },
      {
        onSuccess: (task) => {
          if (task) {
            if (task.followUpQuestion) {
              append({
                message: `${task.followUpQuestion}`,
                role: "agent",
              });
            } else if (task.task) {
              const taskData = task.task;

              const dateTime = parseDateTime(taskData.date, taskData.time);

              const newTask = {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                dueDate: dateTime,
                tags: taskData.tags || [],
                user: {
                  connect: { id: "123" },
                },
              };

              createTask.mutate(newTask, {
                onSuccess: () => {
                  reset();
                },
              });
            }
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <TypingAnimation className="mb-4 text-sm max-w-md text-center" duration={50}>
          {lastAgentMessage ?? ""}
        </TypingAnimation>
      </div>
      <VoiceRecorder onTranscribe={handleTranscription} />
      <div className="p-3 font-semibold">
        {isLoading && <p className="text-blue-500 animate-pulse">Transcribing...</p>}
      </div>
    </div>
  );
}
