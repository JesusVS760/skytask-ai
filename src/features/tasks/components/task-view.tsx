import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskViewProps = {
  taskView: string;
  onChange: (value: string) => void;
};

export default function TaskView({ taskView, onChange }: TaskViewProps) {
  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <Label htmlFor="priority-filter">Task View:</Label>
      <Select value={taskView} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Task Manager View" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Table">Table</SelectItem>
          <SelectItem value="Calendar">Calendar</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
