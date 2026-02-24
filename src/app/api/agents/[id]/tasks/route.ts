import { NextRequest, NextResponse } from "next/server";

interface Task {
  id: string;
  agentId: string;
  description: string;
  status: "pending" | "executing" | "completed";
  createdAt: string;
}

const taskStore = new Map<string, Task[]>();

export function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const tasks = taskStore.get(id) || [];
    return NextResponse.json({ tasks });
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "description is required" }, { status: 400 });
    }

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agentId: id,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const tasks = taskStore.get(id) || [];
    tasks.push(task);
    taskStore.set(id, tasks);

    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
