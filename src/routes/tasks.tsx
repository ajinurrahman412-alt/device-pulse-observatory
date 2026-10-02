import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, CurrentTaskPanel, TaskQueuePanel } from "@/components/jarvis/Panels";
import { statusColor, timeAgo, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/tasks")({
  head: () => pageHead("Tasks — JARVIS", "Create, prioritize and supervise every agent task from one queue."),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, agents, createTask, reassignTask } = useJarvis();
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState("alice");

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <Panel title="Create Task">
          <div className="flex flex-wrap gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What should the agents do?"
              className="min-w-[220px] flex-1 rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
            />
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="rounded-md border border-panel-border bg-background/60 px-2 py-2 text-sm"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.role}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!title.trim()) return;
                createTask({ title: title.trim(), agentId, source: "Tasks page" });
                setTitle("");
              }}
              className="rounded-md border border-crimson bg-crimson/20 px-4 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright glow-border"
            >
              QUEUE
            </button>
          </div>
        </Panel>

        <Panel title="All Tasks">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="pb-2 font-normal">Task</th>
                  <th className="pb-2 font-normal">Agent</th>
                  <th className="pb-2 font-normal">Progress</th>
                  <th className="pb-2 font-normal">Status</th>
                  <th className="pb-2 font-normal">Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t border-panel-border/40">
                    <td className="py-2 pr-2 text-foreground">{t.title}</td>
                    <td className="py-2 pr-2">
                      <select
                        value={t.agentId}
                        onChange={(e) => reassignTask(t.id, e.target.value)}
                        className="rounded border border-panel-border/60 bg-transparent px-1 py-0.5 text-[10px]"
                      >
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-2 font-mono">{Math.round(t.progress)}%</td>
                    <td className="py-2 pr-2" style={{ color: statusColor[t.status] }}>
                      {t.status}
                    </td>
                    <td className="py-2 font-mono text-muted-foreground">{timeAgo(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="space-y-3">
        <CurrentTaskPanel />
        <TaskQueuePanel />
      </div>
    </div>
  );
}
