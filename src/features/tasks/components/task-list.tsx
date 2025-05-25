import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/generated/prisma";
import { TaskCard } from "./task-card";

type TaskListProps = {
  tasks: Task[];
  setToastSuccessMsg: (msg: boolean) => void;
};

export const TaskList = ({ tasks, setToastSuccessMsg }: TaskListProps) => {
  return (
    <Table className="min-w-[800px] ">
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Edit</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task: Task) => (
          <TaskCard setToastSuccessMsg={setToastSuccessMsg} key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  );
};
