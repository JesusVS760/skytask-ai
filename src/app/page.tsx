"use client";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { TaskList } from "@/features/tasks/components/TaskList";
import { useTaskMutations } from "@/features/tasks/hooks/tasks-mutations";
import VoiceTranscriber from "@/features/voice/components/voice-transcriber";
import { useLLMMutations } from "@/features/voice/hooks/llm-mutation";
import { ContextMessage } from "@/features/voice/schemas/context";
import { useEffect, useMemo, useState } from "react";

// 1. Persist to Database
//  - Create a tasks service, which will have all the operations for tasks (createTask, deleteTask, updateTask, getTasks, etc.)
//  - When a task is generated successfully, add it to the database
//  - Create API endpoints for the tasks operations
//  - Create the frontend Mutations for tasks
//  - Show all the created tasks in a list
//  - Create a nice looking card for showing the task after its created

export default function Home() {
  const [messages, setMessages] = useState<ContextMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskJson, setTaskJson] = useState<any>(null);
  const [isCreated, setIsCreated] = useState(false);

  const { generateTask } = useLLMMutations();
  const { createTask } = useTaskMutations();

  useEffect(() => {
    if (generateTask.data) {
      if (generateTask.data.followUpQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            message: `${generateTask.data.followUpQuestion}`,
            role: "agent",
          },
        ]);
        setTaskJson(null);
      } else if (generateTask.data.task) {
        const taskData = generateTask.data.task;
        setTaskJson(taskData);

        createTask.mutate(
          {
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            tags: taskData.tags || [],
          },
          {
            onSuccess: (createdTask) => {
              setIsCreated(true);
              setMessages((prev) => [
                ...prev,
                {
                  message: `✅ Task ${taskData.title} created!`,
                  role: "agent",
                },
              ]);
            },
          }
        );
      }
    }
  }, [generateTask.data]);

  const agentMessages = useMemo(() => {
    return messages.filter((m) => m.role === "agent");
  }, [messages]);

  const handleTranscription = async (text: string | undefined) => {
    setMessages((prev) => [
      ...prev,
      {
        message: text ?? "",
        role: "user",
      },
    ]);
    await generateTask.mutateAsync({ text, context: messages ?? [] });
  };

  const lastmessage = agentMessages?.slice(-1)[0]?.message;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {taskJson && (
        <div>
          <TaskCard
            task={{
              id: taskJson.id,
              title: taskJson.title,
              description: taskJson.description,
              priority: taskJson.priority,
              status: "pending",
              dueDate: taskJson.dueDate || new Date(),
              tags: taskJson.tags || [],
            }}
          />
          {/* <p>{JSON.stringify(taskJson, null, 2)}</p> */}
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold">LLM Assistant</h1>
        <TypingAnimation className="mb-4 text-sm " duration={50}>
          {lastmessage ?? ""}
        </TypingAnimation>
      </div>
      <VoiceTranscriber onTranscribe={handleTranscription} onLoadingChange={setIsLoading} />
      <div className="p-3 font-semibold">
        {isLoading && <p className="text-blue-500 animate-pulse">Transcribing...</p>}
      </div>
      {isCreated && <TaskList />}
    </div>
  );
}
