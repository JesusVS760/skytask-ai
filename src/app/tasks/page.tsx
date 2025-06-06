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
      toast("Task successfully updated ✔️!");
    }
  }, [toastSuccessMsg]);

  useEffect(() => {
    const priorityIds = new Set(priorityFilteredTasks.map((task) => task.id));
    const combinedTasks = searchFilteredTasks.filter((task) => priorityIds.has(task.id));
    setTasksToDisplay(combinedTasks);
  }, [tasks, priorityFilteredTasks, searchFilteredTasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl">Loading Tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 text-xl font-medium">Error Loading Tasks</p>
          <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 text-xl font-semibold mb-2">No Tasks Yet</h3>
          <p className="text-gray-600">
            Create your first task to get started organizing your life.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  px-4 py-8">
      <Toaster />
      {/* <p className="text-gray-600 mt-1">
        Welcome back, {user.firstName}! You have {tasks.length} tasks.
      </p> */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-shadow-lg/30">Your Tasks</h1>
          <p className="text-white/90">Organize, prioritize, and accomplish your goals</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <TaskSearchByName tasks={tasks} onFilterChange={setSearchFilteredTasks} />
            </div>

            <div className="space-y-2">
              <TaskPriorityFiltering tasks={tasks} onFilterChange={setPriorityFilteredTasks} />
            </div>

            <div className="space-y-2">
              <TaskView taskView={view} onChange={setView} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-gray-600 text-sm">Total: </span>
              <span className="text-gray-900 font-semibold">{tasksToDisplay.length}</span>
            </div>

            {tasksToDisplay.length !== tasks.length && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <span className="text-blue-700 text-sm">Filtered from {tasks.length} tasks</span>
              </div>
            )}
          </div>

          <div className="text-white/90 text-sm flex items-center space-x-2">
            <span>Viewing:</span>
            <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-medium">
              {view}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {tasksToDisplay.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-gray-900 text-lg font-medium mb-2">No Tasks Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="p-6">
              {view === "Table" ? (
                <TaskList tasks={tasksToDisplay} setToastSuccessMsg={setToastSuccessMsg} />
              ) : (
                <TaskCalendar tasks={tasksToDisplay} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
