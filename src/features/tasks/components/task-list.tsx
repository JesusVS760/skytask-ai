import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/generated/prisma";
import { TaskCard } from "./task-card";

type TaskListProps = {
  tasks: Task[];
};

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <Table className="min-w-[800px] max-w-[1000px]">
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  );
};
