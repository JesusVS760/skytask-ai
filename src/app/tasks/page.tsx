"use client";

import { TaskList } from "@/features/tasks/components/task-list";
import { useTaskQueries } from "@/features/tasks/hooks/tasks-queries";

export default function TaskPage() {
  const { useTasks } = useTaskQueries();
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <div>Loading Tasks...</div>;
  }

  if (error) {
    console.log(error);
    return <div> Error Loading Tasks </div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div>No Tasks yet. Create one to get started.</div>;
  }

  return (
    <div className="container mx-auto pt-4">
      <h1 className="text-2xl">Your Tasks</h1>
      <div className="flex items-center justify-center mt-6">
        <TaskList tasks={tasks ?? []} />
      </div>
    </div>
  );
}
