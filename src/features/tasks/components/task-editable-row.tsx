import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { Task } from "@/generated/prisma";
import { format } from "date-fns"; // ✅ Needed for format()
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

type EditableTaskRowProps = {
  task: Task;
  onSave: (updatedTask: Partial<Task>) => void;
  onCancel: () => void;
};

// Format to "2025-06-23T17:00"
const formatDateForInput = (date: Date) => date.toISOString().slice(0, 16);

export default function EditableTaskRow({ task, onSave, onCancel }: EditableTaskRowProps) {
  const initialDate = new Date(task.dueDate);

  const [formState, setFormState] = useState({
    title: task.title,
    priority: task.priority,
    dueDate: formatDateForInput(initialDate),
  });

  const [calendarDate, setCalendarDate] = useState<Date>(initialDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (name === "dueDate") {
      setCalendarDate(new Date(value));
    }
  };

  const handleCalendarChange = (selected: Date | undefined) => {
    if (!selected) return;
    const iso = formatDateForInput(selected);
    setCalendarDate(selected);
    setFormState((prev) => ({ ...prev, dueDate: iso }));
  };

  const handleSubmit = () => {
    onSave({
      ...formState,
      dueDate: new Date(formState.dueDate),
    });
  };

  return (
    <TableRow className="hover:bg-gray-50 text-sm">
      <TableCell>
        <Badge>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</Badge>
      </TableCell>

      <TableCell>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="border rounded p-1 w-full text-sm"
        />
      </TableCell>

      <TableCell>
        <select
          name="priority"
          value={formState.priority}
          onChange={handleChange}
          className="border rounded p-1 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </TableCell>

      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!calendarDate}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {calendarDate ? format(calendarDate, "EEE, MMM d, h:mm a") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleCalendarChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </TableCell>

      <TableCell colSpan={2}>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="cursor-pointer bg-green-600 text-white font-semibold border p-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white font-semibold border p-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
