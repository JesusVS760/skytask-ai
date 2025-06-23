import { Task } from "@prisma/client";

export default function TaskDateChanger(task: Task) {
  const isoString = task.dueDate.toString();
  return new Date(isoString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: undefined,
    timeZone: "America/Los_Angeles",
  });
}
