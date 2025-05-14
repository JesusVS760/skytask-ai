import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp, MoreVertical } from "lucide-react";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const PriorityIcon = () => {
    switch (task.priority.toLowerCase()) {
      case "high":
        return <ChevronUp className="text-red-600" />;
      case "medium":
        return <ChevronRight className="text-amber-500" />;
      case "low":
        return <ChevronDown className="text-blue-500" />;
      default:
        return <ChevronRight className="text-gray-500" />;
    }
  };

  return (
    <div className="flex  items-center border-b border-gray-200 hover:bg-gray-50 transition-colors text-sm">
      <div className="px-4 py-3 cursor-pointer">
        <Checkbox />
      </div>

      <div className="font-medium text-gray-500 w-28">{`TASK-${task.id}`}</div>

      <div className="flex items-center gap-3 flex-grow pr-4 py-3 truncate">
        <span className="truncate">{task.title}</span>
      </div>

      <div className="flex items-center gap-2 w-32">
        <span>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
      </div>

      <div className="flex items-center gap-1 w-32">
        <PriorityIcon />
        <span
          className={cn({
            "text-red-600": task.priority.toLowerCase() === "high",
            "text-amber-500": task.priority.toLowerCase() === "medium",
            "text-blue-500": task.priority.toLowerCase() === "low",
          })}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="px-4 py-3">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
