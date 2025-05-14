import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/generated/prisma";
import { useEffect, useState } from "react";

type TaskSearchByNameProps = {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
};

export default function TaskSearchByName({ tasks, onFilterChange }: TaskSearchByNameProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery.trim()) {
      onFilterChange(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      onFilterChange(filtered);
    }
  }, [tasks, searchQuery, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      onFilterChange(tasks);
    } else {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(value.toLowerCase())
      );
      onFilterChange(filteredTasks);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <Label htmlFor="task-search">Search Tasks:</Label>
      <div className="relative w-full max-w-sm">
        <Input
          id="task-search"
          type="text"
          placeholder="Search by task name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
        />
        {searchQuery && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchQuery("");
              onFilterChange(tasks);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
