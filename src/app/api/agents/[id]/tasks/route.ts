import { NextRequest, NextResponse } from "next/server";

interface Task {
  id: string;
  agentId: string;
  description: string;
  status: "pending" | "executing" | "completed";
  createdAt: string;
}

/**
 * In-memory task storage.
 *
 * NOTE: This Map is process-local and non-persistent:
 * - All tasks are lost on server restart or deployment.
 * - In serverless or multi-instance environments, tasks are not shared
 *   between instances, so different requests may see different data.
 *
 * This is intended only for local development / testing. For production
 * use, replace this with a persistent, shared backing store (e.g. a
 * database or hosted key-value store).
 */
const MAX_TASKS_PER_AGENT = 100;
const MAX_DESCRIPTION_LENGTH = 5000;

/**
 * In-memory task storage.
 *
 * NOTE: This Map is process-local and non-persistent:
 * - All tasks are lost on server restart or deployment.
 * - In serverless or multi-instance environments, tasks are not shared
 *   between instances, so different requests may see different data.
 *
 * This is intended only for local development / testing. For production
 * use, replace this with a persistent, shared backing store (e.g. a
 * database or hosted key-value store).
 */
const taskStore = new Map<string, Task[]>();

export function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const tasks = taskStore.get(id) || [];
    return NextResponse.json({ tasks });
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { description } = body;

  if (!description || typeof description !== "string") {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return NextResponse.json({ error: `description exceeds maximum length of ${MAX_DESCRIPTION_LENGTH} characters` }, { status: 400 });
  }

  const tasks = taskStore.get(id) || [];
  if (tasks.length >= MAX_TASKS_PER_AGENT) {
    return NextResponse.json({ error: `Task queue full (max ${MAX_TASKS_PER_AGENT} tasks per agent)` }, { status: 429 });
  }

  const task: Task = {
    id: crypto.randomUUID(),
    agentId: id,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  taskStore.set(id, tasks);

  return NextResponse.json({ task }, { status: 201 });
}
