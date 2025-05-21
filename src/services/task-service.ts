import { PrismaClient, Task } from "@/generated/prisma";

const prisma = new PrismaClient();

export const taskService = {
  createTask: async (data: Task) => {
    return await prisma.task.create({
      data,
    });
  },
  getTasks: async () => {
    const tasks = await prisma.task.findMany({
      orderBy: {
        dueDate: "asc",
      },
    });

    if (!tasks) throw new Error("Failed to get tasks");

    return tasks;
  },
  updateTask: async (taskId: string, data: Task) => {
    if (!taskId || !data) throw new Error("No task id or data");

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    if (!updatedTask) throw new Error("Failed to update task");

    return updatedTask;
  },
  deleteTask: async (taskId: string) => {
    if (!taskId) throw new Error("No task id");

    return await prisma.task.delete({
      where: { id: taskId },
    });
  },
  deleteTasks: async () => {
    return await prisma.user.deleteMany({});
  },
};
