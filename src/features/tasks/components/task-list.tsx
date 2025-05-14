import { Task } from "@/generated/prisma";
import { TaskCard } from "./task-card";

type TaskListProps = {
  tasks: Task[];
};

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      {/* <div className="flex flex-col items-start">
        <CardHeader className="font-bold text-2xl">Task List</CardHeader>
        <p>Here's a list of your tasks for this month!</p>
      </div> */}
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
