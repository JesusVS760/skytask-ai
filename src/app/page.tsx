"use client";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Toaster } from "@/components/ui/sonner";
import { useTaskMutations } from "@/features/tasks/hooks/tasks-mutations";
import { useChat } from "@/features/tasks/hooks/use-chat";
import VoiceRecorder from "@/features/voice/components/voice-recorder";
import { useLLMMutations } from "@/features/voice/hooks/llm-mutation";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Create a feature/component to confirm deletion of tasks (DONE!)
// Add due date cell in Task Table (DONE!)
// Find and add calander feature that works (DONE!)
// Add a bulk delete api route and front-end mutation ("ADD Later if UI makes sense to add")

//Create a editing for description, due date, and priority level

const sayings = [
  "Just tell me what’s on your mind — I’ll turn it into a to-do list.",
  "Your ideas, my structure — I’ll build your tasks from your words.",
  "Drop the thoughts, and I’ll stack the tasks.",
  "Talk it out — I’ll turn your thoughts into action items.",
  "You think it, I’ll task it.",
  "Let your ideas flow — I’ll shape them into steps.",
  "Speak freely, I’ll handle the planning.",
  "I’ll catch what you say and craft what you need to do.",
  "You talk goals, I’ll map the moves.",
  "Throw me the chaos, I’ll give you the checklist.",
];

export default function Home() {
  const { messages, append, reset, lastAgentMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [index, setIndex] = useState(0);

  const { generateTask } = useLLMMutations();
  const { createTask } = useTaskMutations();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sayings.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios("/api/auth/");
      if (response) {
        setUser(response.data.user);
        console.log(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTranscription = async (text: string | undefined) => {
    append({ message: text ?? "", role: "user" });

    if (!user) {
      toast.error("You must be logged in to create tasks");
      return;
    }

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
              console.log(task.task);
              const newTask = {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
                tags: taskData.tags || [],
                user: user.id,
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
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white
"
    >
      <Toaster />
      <div className="bg-white border-2 py-10 px-18 rounded-lg min-w-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <div className="flex flex-row items-center gap-2 mb-6">
              <div
                className="w-8 h-8 bg-gradient-to-br from-blue-700 to-teal-600
 rounded-lg flex items-center justify-center"
              >
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-semibold text-3xl">SayTask AI</h1>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute text-center text-sm font-medium px-4 "
              >
                {sayings[index]}
              </motion.div>
            </AnimatePresence>
            {user && (
              <h2 className="text-md font-medium text-gray-800 mt-2">
                Welcome back, {user.firstname}!
              </h2>
            )}
            {authLoading && (
              <h2 className="text-md font-medium text-gray-800 mt-2">Welcome back</h2>
            )}
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
