"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSpeechMutations } from "../hooks/speech-mutations";

interface VoiceRecorderProps {
  onTranscribe: (text: string) => void;
}

export default function VoiceRecorder({ onTranscribe }: VoiceRecorderProps) {
  const { speechToText } = useSpeechMutations();
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([0.1, 0.1, 0.1, 0.1, 0.1]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      updateAudioVisualization();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const updateAudioVisualization = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const thumbLevels = Array(5).fill(0);

    const binSize = Math.floor(dataArray.length / 5);

    for (let i = 0; i < 5; i++) {
      let sum = 0;
      for (let j = 0; j < binSize; j++) {
        const index = i * binSize + j;
        if (index < dataArray.length) {
          if (dataArray[index]) {
            sum += dataArray[index];
          }
        }
      }
      thumbLevels[i] = Math.max(0.1, sum / (binSize * 255));
    }

    setAudioLevels(thumbLevels);
    animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        speechToText.mutate(audioBlob, {
          onSuccess: (text) => {
            onTranscribe(text);
          },
        });

        setAudioLevels([0.1, 0.1, 0.1, 0.1, 0.1]);

        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
      };

      setIsRecording(false);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-end justify-center gap-2 h-20">
        {audioLevels.map((level, index) => (
          <motion.div
            key={index}
            className="w-6 rounded-t-full bg-primary"
            animate={{
              height: `${level * 100}%`,
              opacity: isRecording ? 1 : 0.7,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          />
        ))}
      </div>

      <motion.button
        className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={isRecording ? stopRecording : undefined}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        <Mic size={28} className={isRecording ? "text-red-500 animate-pulse" : "text-gray-700"} />
      </motion.button>

      <p className="text-sm text-gray-500 mt-2">
        {isRecording ? "Recording... Release to stop" : "Hold to record"}
      </p>
    </div>
  );
}
