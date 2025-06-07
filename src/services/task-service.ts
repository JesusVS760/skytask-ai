import { Task } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const taskService = {
  createTask: async (data: Prisma.TaskCreateInput) => {
    return await prisma.task.create({
      data,
    });
  },
  getTasks: async (userId: string) => {
    if (!userId) {
      return [];
    }
    const tasks = await prisma.task.findMany({
      orderBy: {
        dueDate: "asc",
      },
      where: {
        userId: userId,
      },
    });

    if (!tasks) throw new Error("Failed to get tasks");

    return tasks;
  },
  getTaskById: async (taskId: string, userId: string) => {
    if (!taskId || !userId) {
      throw new Error("Task ID and User ID are required");
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId, // CRITICAL: Verify ownership
      },
    });

    if (!task) {
      throw new Error("Task not found or you don't have permission to view it");
    }

    return task;
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
