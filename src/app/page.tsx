"use client";
import VoiceRecorder from "@/features/voice-task/components/VoiceRecorder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <QueryClientProvider client={queryClient}>
        <VoiceRecorder />
      </QueryClientProvider>
    </div>
  );
}
