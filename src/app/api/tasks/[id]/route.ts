import { taskService } from "@/services/task-service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const { id } = await params;
  try {
    const data = await req.json();

    const updatedTask = await taskService.updateTask(id, data);

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
