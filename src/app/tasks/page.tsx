"use client";

import TaskPriorityFiltering from "@/features/tasks/components/task-filter-priority";
import { TaskList } from "@/features/tasks/components/task-list";
import TaskSearchByName from "@/features/tasks/components/task-search-by-name";
import { useTaskQueries } from "@/features/tasks/hooks/tasks-queries";
import { Task } from "@/generated/prisma";
import { useEffect, useState } from "react";

export default function TaskPage() {
  const { useTasks } = useTaskQueries();
  const { data: tasks, isLoading, error } = useTasks();

  const [priorityFilteredTasks, setPriorityFilteredTasks] = useState<Task[]>([]);
  const [searchFilteredTasks, setSearchFilteredTasks] = useState<Task[]>([]);
  const [tasksToDisplay, setTasksToDisplay] = useState<Task[]>([]);

  useEffect(() => {
    const priorityIds = new Set(priorityFilteredTasks.map((task) => task.id));
    const combinedTasks = searchFilteredTasks.filter((task) => priorityIds.has(task.id));
    setTasksToDisplay(combinedTasks);
  }, [tasks, priorityFilteredTasks, searchFilteredTasks]);

  if (isLoading) {
    return <div className="flex items-center justify-center text-2xl">Loading Tasks...</div>;
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex items-center justify-center text-2xl text-red-600">
        {" "}
        Error Loading Tasks{" "}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center text-2xl">
        No Tasks yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-6 ">
      <h1 className="flex text-2xl  font-bold p-12">Your Tasks</h1>
      <div className="flex flex-row gap-10">
        <TaskSearchByName tasks={tasks} onFilterChange={setSearchFilteredTasks} />
        <TaskPriorityFiltering tasks={tasks} onFilterChange={setPriorityFilteredTasks} />
      </div>
      <div className="w-full max-w-4xl ">
        <TaskList tasks={tasksToDisplay} />
      </div>
    </div>
  );
}
