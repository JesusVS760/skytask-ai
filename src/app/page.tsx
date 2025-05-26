"use client";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Toaster } from "@/components/ui/sonner";
import { useTaskMutations } from "@/features/tasks/hooks/tasks-mutations";
import { useChat } from "@/features/tasks/hooks/use-chat";
import VoiceRecorder from "@/features/voice/components/voice-recorder";
import { useLLMMutations } from "@/features/voice/hooks/llm-mutation";
import { parseDateTime } from "@/lib/utils";
import { Mic } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Create a feature/component to confirm deletion of tasks (DONE!)
// Add due date cell in Task Table (DONE!)
// Find and add calander feature that works (DONE!)
// Add a bulk delete api route and front-end mutation ("ADD Later if UI makes sense to add")

//Create a editing for description, due date, and priority level

export default function Home() {
  const { messages, append, reset, lastAgentMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const { generateTask } = useLLMMutations();
  const { createTask } = useTaskMutations();

  const handleTranscription = async (text: string | undefined) => {
    append({ message: text ?? "", role: "user" });
    setIsLoading(true);

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
                  toast("Task successful created ✔️!");
                },
              });
            }
          }
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-black
"
    >
      <Toaster />

      <div className="bg-white py-10 px-18 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <div className="flex flex-row items-center gap-2">
              <div
                className="w-8 h-8 bg-gradient-to-br from-blue-700 to-teal-600
 rounded-lg flex items-center justify-center"
              >
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-semibold text-3xl ">SayTask AI</h1>
            </div>
            <p>Speak naturally and I'll help you with your tasks</p>
          </div>

          {lastAgentMessage ? (
            ""
          ) : (
            <div className="flex items-center justify-center animate-pulse  bg-green-300/20 text-green-800 font-semibold rounded-full outline-1 outline-green-300 w-max py-2 px-4 mt-4">
              <p>Ready to listen</p>
            </div>
          )}
        </div>

        <div className="flex flex-col  items-center justify-center">
          {isLoading && (
            <p className="text-blue-500 animate-pulse mt-4 text-xl">Thinking... Please wait.</p>
          )}
          <TypingAnimation className="mb-4 text-sm max-w-md text-center" duration={50}>
            {lastAgentMessage ?? ""}
          </TypingAnimation>
        </div>
        <VoiceRecorder onTranscribe={handleTranscription} />
      </div>
      <div className="text-center text-sm text-white mt-4">
        <p>Powered by advanced voice recognition technology</p>
      </div>
    </div>
  );
}
