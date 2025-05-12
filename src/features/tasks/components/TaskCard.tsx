import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/generated/prisma";

type TaskCardProps = {
  task: Task;
};

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card className="max-w-2xl">
      <CardHeader>Task List:</CardHeader>
      <CardContent className="flex flex-col">
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
    </Card>
  );
};
