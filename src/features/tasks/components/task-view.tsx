import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Table } from "lucide-react";

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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Table">
            <div className="flex items-center gap-1">
              <Table size={10} />
              Table
            </div>
          </SelectItem>
          <SelectItem value="Calendar">
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              Calendar
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
