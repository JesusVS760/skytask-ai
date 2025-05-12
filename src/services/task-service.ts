import { PrismaClient, Task } from "@/generated/prisma";

const prisma = new PrismaClient();

export const taskService = {
  createTask: async (data: Task) => {
    return prisma.task.create({
      data,
    });
  },
  getTasks: async () => {
    return prisma.task.findMany({
      orderBy: {
        dueDate: "asc",
      },
    });
  },
  updateTask: async (taskId: string, data: Task) => {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  },
  deleteTask: async (taskId: string) => {
    return prisma.task.delete({
      where: { id: taskId },
    });
  },
};
