"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useState } from "react";

type VoiceButtonProps = {
  onHold?: () => void;
  onLetGo?: () => void;
  loadingState?: () => void;
};

export const VoiceButton = ({ onHold, onLetGo }: VoiceButtonProps) => {
  const [isActive, setIsActive] = useState(false);

  const toggle = async () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        className={cn(
          "w-40 h-40 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer",
          {
            "bg-gray-700 shadow-md": isActive,
          }
        )}
        onPointerDown={() => {
          toggle();
          onHold?.();
        }}
        onPointerUp={() => {
          toggle();
          onLetGo?.();
        }}
      >
        <Mic className="size-14 text-white" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
};
