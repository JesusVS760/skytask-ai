import { useMutation } from "@tanstack/react-query";

export const useSpeechMutations = () => {
  const speechToText = useMutation({
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
      return data.text;
    },

    onError: (error: any) => {
      console.error("Error sending audio", error);
    },
  });
  return { speechToText, isLoading: speechToText.isPending };
};
