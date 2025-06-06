import { getSession } from "@/lib/auth";
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
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    const deletedTask = await taskService.deleteTask(id);

    return NextResponse.json({ task: deletedTask }, { status: 200 });
  } catch (error) {
    console.log("Error deleteing Task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { taskId } = params;
    const task = await taskService.getTaskById(taskId, user.id);

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
  }
}
