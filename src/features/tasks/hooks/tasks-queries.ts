import { useQuery } from "@tanstack/react-query";

export const useTaskQueries = () => {
  const useTasks = () =>
    useQuery({
      queryKey: ["tasks"],
      queryFn: async () => {
        const res = await fetch("/api/tasks", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await res.json();
        return data.task;
      },
    });

  const useTaskDetails = (taskId: string) =>
    useQuery({
      queryKey: ["tasks", taskId],
      enabled: !!taskId,
      queryFn: async () => {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await res.json();
        return data.task;
      },
    });

  return { useTasks, useTaskDetails };
};

// EXAMPLE:
// const { useTasks } = useTaskQueries();
// const { data, isLoading, isError } = useTasks();
