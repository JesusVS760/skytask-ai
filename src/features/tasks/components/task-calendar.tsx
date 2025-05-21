"use client";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { useState } from "react";

export function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const hasTasksOnDate = (date: Date) => {
    return tasks.some((task) => isSameDay(task.dueDate, date));
  };

  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter((task) => isSameDay(task.dueDate, selectedDate))
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            hasTasks: (date) => hasTasksOnDate(date),
          }}
          modifiersStyles={{
            hasTasks: {
              fontWeight: "bold",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "50%",
            },
          }}
        />
      </div>
      <div className="min-w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <ul className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{task.title}</span>
                    <Badge
                      className={cn({
                        "bg-red-600": task.priority.toLowerCase() === "high",
                        "bg-amber-500": task.priority.toLowerCase() === "medium",
                        "bg-blue-500": task.priority.toLowerCase() === "low",
                      })}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No tasks scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
