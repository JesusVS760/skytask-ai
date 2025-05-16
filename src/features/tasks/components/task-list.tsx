import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/generated/prisma";
import { useState } from "react";
import { Toaster } from "sonner";
import { TaskCard } from "./task-card";

type TaskListProps = {
  tasks: Task[];
  onUpdateSuccess: () => void;
};

export const TaskList = ({ tasks, onUpdateSuccess }: TaskListProps) => {
  const [successMsg, setSuccessMsg] = useState(false);

  return (
    <Table className="min-w-[800px] max-w-[1000px]">
      {successMsg && <Toaster />}
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task: Task) => (
          <TaskCard onUpdateSuccess={onUpdateSuccess} key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  );
};
