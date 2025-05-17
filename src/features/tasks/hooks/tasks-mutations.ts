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
    mutationFn: async ({ id, data: taskData }: { id: string; data: Prisma.TaskUpdateInput }) => {
      const { data } = await axios.patch(`/api/tasks/${id}`, taskData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      console.log(taskId);
      const { data } = await axios.delete(`/api/tasks/${taskId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { createTask, updateTask, deleteTask };
};
