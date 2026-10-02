import { createFileRoute } from "@tanstack/react-router";
import { Check, Pause, Play, Plus } from "lucide-react";
import { useState } from "react";
import { statusColor, timeAgo, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";
import type { Task } from "@/lib/jarvis/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => pageHead("Mission Control — AJINUR2.0", "Kanban mission board to dispatch, filter and supervise every agent task."),
  component: TasksPage,
});

const COLUMNS: { id: string; label: string; match: Task["status"][] }[] = [
  { id: "queued", label: "QUEUED", match: ["QUEUED"] },
  { id: "running", label: "RUNNING", match: ["RUNNING"] },
  { id: "waiting", label: "WAITING / REVIEW", match: ["WAITING"] },
  { id: "done", label: "COMPLETED", match: ["COMPLETED", "FAILED", "CANCELLED"] },
];

const PRIORITY_CLASS: Record<Task["priority"], string> = {
  HIGH: "border-crimson text-crimson-bright",
  NORMAL: "border-cyan-hud/60 text-cyan-hud",
  LOW: "border-muted-foreground/40 text-muted-foreground",
};

function TasksPage() {
  const { tasks, agents, createTask, updateTaskStatus } = useJarvis();
  const workers = agents.filter((a) => a.id !== "jarvis");
  const [filter, setFilter] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState(workers[0]?.id ?? "alice");
  const [priority, setPriority] = useState<Task["priority"]>("NORMAL");

  const visible = filter === "all" ? tasks : tasks.filter((t) => t.agentId === filter);

  const dispatch = () => {
    if (!title.trim()) return;
    createTask({ title: title.trim(), agentId, priority, source: "Mission Control" });
    setTitle("");
  };

  return (
    <div className="space-y-3">
      <div className="hud-panel p-3">
        <div className="hud-title mb-2">Quick Dispatch</div>
        <div className="flex flex-wrap gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && dispatch()}
            placeholder="What should the agents do?"
            className="min-w-[200px] flex-1 rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-cyan-hud"
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="rounded-md border border-panel-border bg-background/60 px-2 py-2 text-sm">
            <option value="HIGH">CRITICAL</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="rounded-md border border-panel-border bg-background/60 px-2 py-2 text-sm">
            {workers.map((a) => (
              <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
            ))}
          </select>
          <button onClick={dispatch} className="flex items-center gap-1 rounded-md border border-crimson bg-crimson/20 px-4 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright glow-border">
            <Plus className="size-3.5" /> DISPATCH
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{ id: "all", name: "ALL AGENTS", color: undefined as string | undefined }, ...workers.map((a) => ({ id: a.id, name: a.name.toUpperCase(), color: a.color }))].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-display text-[10px] tracking-[0.2em] transition-colors",
              filter === f.id ? "border-cyan-hud bg-cyan-hud/15 text-cyan-hud" : "border-panel-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.color && <span className="mr-1.5 inline-block size-2 rounded-full" style={{ background: f.color }} />}
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = visible.filter((t) => col.match.includes(t.status));
          return (
            <div key={col.id} className="hud-panel flex min-h-[280px] flex-col p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="hud-title">{col.label}</span>
                <span className="rounded border border-panel-border px-1.5 font-mono text-[10px] text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.length === 0 && <p className="py-6 text-center font-mono text-[10px] text-muted-foreground/60">NO TASKS</p>}
                {items.map((t) => {
                  const agent = agents.find((a) => a.id === t.agentId);
                  return (
                    <div key={t.id} className="rounded-md border border-panel-border bg-background/50 p-2.5">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className={cn("rounded border px-1.5 font-mono text-[8px]", PRIORITY_CLASS[t.priority])}>
                          {t.priority === "HIGH" ? "CRITICAL" : t.priority}
                        </span>
                        <span className="font-mono text-[9px]" style={{ color: statusColor[t.status] }}>{t.status}</span>
                      </div>
                      <p className="text-[13px] leading-snug text-foreground">{t.title}</p>
                      {agent && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="size-2 rounded-full" style={{ background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
                          {agent.name} · {timeAgo(t.createdAt)}
                        </div>
                      )}
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${Math.round(t.progress)}%`, background: agent?.color ?? "var(--cyan-hud)" }} />
                      </div>
                      {t.steps && t.steps.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {t.steps.slice(0, 3).map((s) => (
                            <li key={s.label} className={cn("flex items-center gap-1 text-[10px]", s.done ? "text-success" : "text-muted-foreground")}>
                              <Check className={cn("size-2.5", !s.done && "opacity-30")} /> {s.label}
                            </li>
                          ))}
                        </ul>
                      )}
                      {col.id !== "done" && (
                        <div className="mt-2 flex gap-1">
                          {t.status !== "RUNNING" && (
                            <button onClick={() => updateTaskStatus(t.id, "RUNNING")} aria-label="Run" className="flex-1 rounded border border-cyan-hud/40 py-1 text-cyan-hud hover:bg-cyan-hud/10"><Play className="mx-auto size-3" /></button>
                          )}
                          {t.status === "RUNNING" && (
                            <button onClick={() => updateTaskStatus(t.id, "WAITING")} aria-label="Pause" className="flex-1 rounded border border-amber-hud/40 py-1 text-amber-hud hover:bg-amber-hud/10"><Pause className="mx-auto size-3" /></button>
                          )}
                          <button onClick={() => updateTaskStatus(t.id, "COMPLETED")} aria-label="Complete" className="flex-1 rounded border border-success/40 py-1 text-success hover:bg-success/10"><Check className="mx-auto size-3" /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
