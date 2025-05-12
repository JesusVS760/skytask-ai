import { useTaskQueries } from "../hooks/tasks-queries";
import { TaskCard } from "./TaskCard";

export const TaskList = () => {
  const { useTasks } = useTaskQueries();
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <div>Loading Tasks...</div>;
  }

  if (error) {
    return <div> Error Loading Tasks</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div>No Tasks yet. Create one to get started.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
