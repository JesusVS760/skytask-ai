import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTaskQueries = () => {
  const useTasks = () =>
    useQuery({
      queryKey: ["tasks"],
      queryFn: async () => {
        const { data } = await axios.get("/api/tasks");
        return data.tasks;
      },
    });

  const useTaskDetails = (taskId: string) =>
    useQuery({
      queryKey: ["tasks", taskId],
      enabled: !!taskId,
      queryFn: async () => {
        const { data } = await axios.get(`/api/tasks/${taskId}`);
        return data;
      },
    });

  return { useTasks, useTaskDetails };
};
