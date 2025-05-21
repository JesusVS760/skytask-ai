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
import { CheckCheck, Clock, Ellipsis, Save, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTaskMutations } from "../hooks/tasks-mutations";
import { useConfirm } from "../hooks/use-confirm";
import EditableTaskRow from "./task-editable-row";

type TaskCardProps = {
  task: Task;
  setToastSuccessMsg: (msg: boolean) => void;
};

export const TaskCard = ({ task, setToastSuccessMsg }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTaskMutations();
  const [isEditing, setIsEditing] = useState(false);
  const [localStatus, setLocalStatus] = useState<TaskStatus>(task.status);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure 🤔?",
    "You are about to delete this task"
  );

  const handleEdit = () => {
    console.log("editing");
  };
  const handleUpdate = (value: string) => {
    updateTask.mutate(
      {
        id: task.id,
        data: {
          ...task,
          status: value as TaskStatus,
        },
      },
      {
        onSuccess: () => {
          setToastSuccessMsg(true);
          setLocalStatus(value as TaskStatus);
          toast(`Successful updated status to ${value} ✔️!`);
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          toast("Task Successful deleted ✔️!");
        },
      });
    }
  };
  const isoString = task.dueDate.toString();
  const readable = new Date(isoString).toLocaleString("en-US", {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return isEditing ? (
    <EditableTaskRow
      task={task}
      onCancel={() => setIsEditing(false)}
      onSave={(updatedTask) => {
        updateTask.mutate(
          {
            id: task.id,
            data: {
              ...task,
              ...updatedTask,
            },
          },
          {
            onSuccess: () => {
              setIsEditing(false);
              setToastSuccessMsg(true);
              toast("Task updated successfully ✔️!");
            },
          }
        );
      }}
    />
  ) : (
    <TableRow className="hover:bg-gray-50 transition-colors text-sm gap-3">
      <ConfirmDialog />
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
            "line-through": localStatus.toString() === "completed",
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

      <TableCell>{readable}</TableCell>

      <TableCell>
        <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
          <Ellipsis />
        </div>
      </TableCell>
      <TableCell onClick={handleDelete} className="px-4 py-3 w-12">
        <button className=" cursor-pointer text-black hover:text-gray-600">
          <Trash size={18} />
        </button>
      </TableCell>
    </TableRow>
  );
};
