import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Task } from "@/generated/prisma";
import { useState } from "react";

type EditableTaskRowProps = {
  task: Task;
  onSave: (updatedTask: Partial<Task>) => void;
  onCancel: () => void;
};

export default function EditableTaskRow({ task, onSave, onCancel }: EditableTaskRowProps) {
  const [formState, setFormState] = useState({
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
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
          {" "}
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </TableCell>
      <TableCell>
        <input
          type="datetime-local"
          name="dueDate"
          value={formState.dueDate}
          onChange={handleChange}
          className="border rounded p-1 text-sm"
        />
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
            className="bg-red-500  text-white font-semibold border p-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
