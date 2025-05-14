import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/generated/prisma";
import { useEffect, useState } from "react";

type TaskPriorityFilteringProps = {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
};

export default function TaskPriorityFiltering({
  tasks,
  onFilterChange,
}: TaskPriorityFilteringProps) {
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (priorityFilter === "all") {
      onFilterChange(tasks);
    } else {
      const filtered = tasks.filter(
        (task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
      onFilterChange(filtered);
    }
  }, [tasks, priorityFilter, onFilterChange]);

  const handleFilterChange = (value: string) => {
    setPriorityFilter(value);

    if (value === "all") {
      onFilterChange(tasks);
    } else {
      const filteredTasks = tasks.filter(
        (task) => task.priority.toLowerCase() === value.toLowerCase()
      );
      onFilterChange(filteredTasks);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <Label htmlFor="priority-filter">Filter by Priority:</Label>
      <Select value={priorityFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]" id="priority-filter">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
