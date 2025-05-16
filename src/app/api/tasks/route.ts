import { taskService } from "@/services/task-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

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

// export async function PATCH(req: NextRequest) {
//   try {
//     const task = await req.json();
//     const { id, ...data } = task;

//     const updatedTask = await taskService.updateTask(id, data);

//     return NextResponse.json({ task: updatedTask }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Error updating task" }, { status: 500 });
//   }
// }
