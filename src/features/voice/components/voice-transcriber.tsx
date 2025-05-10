"use client";
import { useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { useSpeechMutations } from "../hooks/speech-mutations";
import { VoiceButton } from "./voice-button";

type VoiceRecorderProps = {
  onTranscribe: (text: string | undefined) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

export default function VoiceTranscriber({ onTranscribe, onLoadingChange }: VoiceRecorderProps) {
  const { speechToText, isLoading } = useSpeechMutations();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleStop = (blob: Blob) => {
    speechToText.mutate(blob, {
      onSuccess: (result: string) => {
        onTranscribe(result);
      },
    });
  };

  return (
    <ReactMediaRecorder
      audio
      onStop={(url, blob) => handleStop(blob)}
      render={({ startRecording, stopRecording }) => (
        <VoiceButton onHold={startRecording} onLetGo={stopRecording} />
      )}
    />
  );
}
