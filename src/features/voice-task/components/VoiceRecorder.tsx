"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { VoiceButton } from "./VoiceTask";

// type Props = {};

// FRONTEND
// 1. use the ReactMediaRecorder to record the audio
// 2. save the audio in state
// 3. When user lets go, send the audio to whisper api
//   3a. Create a tanstack query mutation to send a req to the backend

// BACKEND
// 4. The response should be the speech but in text
//   4a. Create a Speech to text service to use in your backend

export default function VoiceRecorder() {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [response, setResponse] = useState("Say Something");

  const handleStop = (blobUrl: string, blob: Blob) => {
    setAudioFile(blob);
    mutation.mutate(blob);
    console.log(blob);
  };

  const mutation = useMutation({
    mutationFn: async (audioFile: Blob) => {
      const formData = new FormData();
      formData.append("file", audioFile, "audio.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await res.json();
      console.log("API response:", data.text);
      return data.text;
    },

    onSuccess: (result: string) => {
      setResponse(result);
    },
    onError: (error: any) => {
      console.error("Error sending audio", error);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({ startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <VoiceButton onHold={startRecording} onLetGo={stopRecording} />
            {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
          </div>
        )}
      />
      <p className="p-6">{response}</p>
    </div>
  );
}
