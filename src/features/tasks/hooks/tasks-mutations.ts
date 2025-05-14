import { Prisma } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (taskData: Prisma.TaskCreateInput) => {
      const { data } = await axios.post("/api/tasks", taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({
      taskId,
      data: taskData,
    }: {
      taskId: string;
      data: Prisma.TaskCreateInput;
    }) => {
      const { data } = await axios.put(`/api/tasks/${taskId}`, taskData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await axios.delete(`/api/tasks/${taskId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { createTask, updateTask, deleteTask };
};
