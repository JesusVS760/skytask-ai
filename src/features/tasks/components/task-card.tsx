import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Task, TaskStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { CheckCheck, Clock, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useTaskMutations } from "../hooks/tasks-mutations";

type TaskCardProps = {
  task: Task;
  onUpdateSuccess: (successState: boolean) => void;
};

export const TaskCard = ({ task, onUpdateSuccess }: TaskCardProps) => {
  const { updateTask } = useTaskMutations();
  const { id, status } = task;

  const handleUpdate = (value: string) => {
    updateTask.mutate(
      {
        id,
        data: {
          status: value as TaskStatus,
          title: task.title,
          dueDate: task.dueDate,
          user: {
            create: undefined,
            connectOrCreate: undefined,
            connect: undefined,
          },
          priority: "high",
        },
      },
      {
        onSuccess: () => {
          toast(`Successful updated status to ${status} ✔️!`);
          onUpdateSuccess(true);
        },
      }
    );
  };

  return (
    <TableRow className="hover:bg-gray-50 transition-colors text-sm gap-3">
      <TableCell className="py-3">
        <Select defaultValue={task.status} onValueChange={(value) => handleUpdate(value)}>
          <SelectTrigger className="w-[80%]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">
              <div className="flex items-center justify-center gap-1">
                <CheckCheck size={18} />
                <span>Completed</span>
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex items-center justify-center gap-1">
                <Save size={18} />
                <span>Archived</span>
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center justify-center gap-1">
                <Clock size={18} />
                <span>Pending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="px-4 py-3 w-12">
        <span
          className={cn({
            "line-through": task.status.toString() === "done",
          })}
        >
          {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
        </span>
      </TableCell>

      <TableCell className="py-3">
        <Badge
          className={cn({
            "bg-red-600": task.priority.toLowerCase() === "high",
            "bg-amber-500": task.priority.toLowerCase() === "medium",
            "bg-blue-500": task.priority.toLowerCase() === "low",
          })}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </TableCell>

      <TableCell className="px-4 py-3 w-12">
        <button className=" cursor-pointer text-black hover:text-gray-600">
          <Trash size={18} />
        </button>
      </TableCell>
    </TableRow>
  );
};
