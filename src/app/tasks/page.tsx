"use client";

import { TaskCalendar } from "@/features/tasks/components/task-calendar";
import TaskPriorityFiltering from "@/features/tasks/components/task-filter-priority";
import { TaskList } from "@/features/tasks/components/task-list";
import TaskSearchByName from "@/features/tasks/components/task-search-by-name";
import TaskView from "@/features/tasks/components/task-view";
import { useTaskQueries } from "@/features/tasks/hooks/tasks-queries";
import { Task } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function TaskPage() {
  const [toastSuccessMsg, setToastSuccessMsg] = useState<boolean | null>(false);
  const [priorityFilteredTasks, setPriorityFilteredTasks] = useState<Task[]>([]);
  const [searchFilteredTasks, setSearchFilteredTasks] = useState<Task[]>([]);
  const [tasksToDisplay, setTasksToDisplay] = useState<Task[]>([]);
  const { useTasks } = useTaskQueries();
  const { data: tasks, isLoading, error } = useTasks();
  const [view, setView] = useState("Table");

  useEffect(() => {
    if (toastSuccessMsg) {
      toast("Task successful updated ✔️!");
    }
  }, [toastSuccessMsg]);

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
      <Toaster />
      <h1 className="flex text-2xl  font-bold p-12">Your Tasks</h1>
      <div className="flex flex-row items-center justify-center gap-10">
        <div className="flex-1">
          <TaskSearchByName tasks={tasks} onFilterChange={setSearchFilteredTasks} />
        </div>
        <div className="flex-1">
          <TaskPriorityFiltering tasks={tasks} onFilterChange={setPriorityFilteredTasks} />
        </div>
        <div className="flex-1">
          <TaskView taskView={view} onChange={setView} />
        </div>
      </div>
      <div>
        {view === "Table" ? (
          <TaskList tasks={tasksToDisplay} setToastSuccessMsg={setToastSuccessMsg} />
        ) : (
          <TaskCalendar tasks={tasksToDisplay} />
        )}
      </div>
    </div>
  );
}
