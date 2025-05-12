import { Prisma } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// type CreateTaskInput = {
//   title: string;
//   description?: string | null;
//   status?: TaskStatus;
//   priority: TaskPriority;
//   dueDate: Date | string;
//   tags: string[];
//   isRecurring?: boolean | null;
//   recurringInterval?: Intervals | null;
// };

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (taskData: Prisma.TaskCreateInput) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      const data = await response.json();
      console.log(data);
      return data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: Prisma.TaskCreateInput }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const responseData = await response.json();
      return responseData.task;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { createTask, updateTask, deleteTask };
};
