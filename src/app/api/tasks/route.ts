import { taskService } from "@/services/task-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tasks = await taskService.getTasks();

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error getting tasks", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const taskData = await req.json();
    const task = await taskService.createTask({
      ...taskData,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error to create task" }, { status: 500 });
  }
}
