"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  agentId: string;
  description: string;
  status: "pending" | "executing" | "completed";
  createdAt: string;
}

const taskStatusColors: Record<string, string> = {
  pending: "#f59e0b",
  executing: "#6366f1",
  completed: "#10b981",
};

export function ReasoningSection({ agentId }: { agentId: string }) {
  const [prompt, setPrompt] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [streaming, setStreaming] = useState(false);

  const handleReason = async () => {
    if (!prompt.trim() || streaming) return;
    setStreaming(true);
    setReasoning("");

    try {
      const res = await fetch(`/api/agents/${agentId}/reason`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok || !res.body) {
        setReasoning("Error: Failed to start reasoning.");
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setStreaming(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setReasoning((prev) => prev + parsed.text);
              }
              if (parsed.error) {
                setReasoning((prev) => prev + `\n[Error: ${parsed.error}]`);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch {
      setReasoning("Error: Connection failed.");
    }
    setStreaming(false);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Reasoning</h2>
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for the agent to reason about..."
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)] resize-none"
          rows={3}
        />
        <button
          onClick={handleReason}
          disabled={streaming || !prompt.trim()}
          className="px-4 py-2 bg-[var(--accent-indigo)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {streaming ? "Reasoning..." : "Start Reasoning"}
        </button>
        {reasoning && (
          <div className="bg-[var(--bg-elevated)] rounded-lg p-4 mt-3 border border-[var(--border-primary)]">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Step-by-step thinking</h3>
            <pre className="text-sm text-[var(--text-primary)] whitespace-pre-wrap font-mono leading-relaxed">
              {reasoning}
              {streaming && <span className="inline-block w-2 h-4 bg-[var(--accent-indigo)] animate-pulse ml-0.5" />}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskQueue({ agentId }: { agentId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/${agentId}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch {
      // silently fail
    }
  }, [agentId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/agents/${agentId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newTask }),
      });
      if (res.ok) {
        setNewTask("");
        fetchTasks();
      }
    } catch {
      // silently fail
    }
    setAdding(false);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Task Queue</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
          placeholder="Add a new task..."
          className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)]"
        />
        <button
          onClick={addTask}
          disabled={adding || !newTask.trim()}
          className="px-4 py-2 bg-[var(--accent-indigo)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          {adding ? "Adding..." : "Add Task"}
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No tasks in queue.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: taskStatusColors[task.status] }}
              />
              <span className="flex-1 text-sm text-[var(--text-primary)]">{task.description}</span>
              <span
                className="text-xs capitalize px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `color-mix(in srgb, ${taskStatusColors[task.status]} 15%, transparent)`,
                  color: taskStatusColors[task.status],
                }}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DeleteAgentButton({ agentId }: { agentId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/agents/${agentId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/agents");
      }
    } catch {
      // silently fail
    }
    setDeleting(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="glass-card p-6 border-red-500/30">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Confirm Deletion</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Are you sure you want to delete this agent? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, Delete Agent"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-card)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-600/20"
    >
      Delete Agent
    </button>
  );
}
