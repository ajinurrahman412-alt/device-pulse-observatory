import {
  Activity,
  Ban,
  Calendar,
  Check,
  ChevronRight,
  Cpu,
  FolderOpen,
  Globe,
  HardDrive,
  ListPlus,
  MemoryStick,
  Mic,
  Pause,
  Play,
  PlugZap,
  RotateCcw,
  StickyNote,
  Wifi,
  Zap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { clock, statusColor, timeAgo, useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("hud-panel flex flex-col p-3", className)}>
      <header className="mb-2 flex items-center justify-between">
        <h3 className="hud-title">{title}</h3>
        {action}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function CurrentTaskPanel() {
  const { runningTask, agents, updateTaskStatus } = useJarvis();
  if (!runningTask) {
    return (
      <Panel title="Current Task">
        <p className="py-6 text-center text-xs text-muted-foreground">No task running. Queue one to begin.</p>
      </Panel>
    );
  }
  const agent = agents.find((a) => a.id === runningTask.agentId);
  return (
    <Panel
      title="Current Task"
      action={
        <div className="flex gap-1">
          <button
            onClick={() => updateTaskStatus(runningTask.id, "WAITING")}
            className="rounded border border-panel-border p-1 text-muted-foreground hover:text-crimson-bright"
            aria-label="Pause task"
          >
            <Pause className="size-3" />
          </button>
          <button
            onClick={() => updateTaskStatus(runningTask.id, "CANCELLED")}
            className="rounded border border-panel-border p-1 text-muted-foreground hover:text-crimson-bright"
            aria-label="Cancel task"
          >
            <Ban className="size-3" />
          </button>
        </div>
      }
    >
      <div className="text-[11px] text-muted-foreground">
        {agent?.role} ({agent?.name})
      </div>
      <div className="mt-1 text-sm text-foreground">{runningTask.title}</div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${runningTask.progress}%`,
              background: "linear-gradient(90deg, var(--crimson-deep), var(--crimson-bright))",
              boxShadow: "var(--glow-sm)",
            }}
          />
        </div>
        <span className="font-mono text-[11px] text-crimson-bright">{Math.round(runningTask.progress)}%</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {runningTask.steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[11px]">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full border",
                s.done ? "border-success text-success" : "border-panel-border text-transparent",
              )}
            >
              <Check className="size-2.5" />
            </span>
            <span className={s.done ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function TaskQueuePanel({ compact = false }: { compact?: boolean }) {
  const { tasks, updateTaskStatus, prioritizeTask } = useJarvis();
  const list = compact ? tasks.filter((t) => t.status !== "COMPLETED").slice(0, 5) : tasks;
  return (
    <Panel
      title="Task Queue"
      action={
        <Link to="/tasks" className="font-mono text-[9px] text-muted-foreground hover:text-crimson-bright">
          ALL <ChevronRight className="inline size-3" />
        </Link>
      }
    >
      <ul className="space-y-2">
        {list.map((task, i) => (
          <li key={task.id} className="rounded-md border border-panel-border/60 bg-background/40 p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[12px] text-foreground">
                  <span className="font-mono text-muted-foreground">#{i + 1}</span> {task.title}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {task.agentId.toUpperCase()} · {task.priority}
                </div>
              </div>
              <span
                className="shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[8px] tracking-widest"
                style={{ color: statusColor[task.status], borderColor: statusColor[task.status] }}
              >
                {task.status}
              </span>
            </div>
            <div className="mt-1.5 flex gap-1">
              {task.status === "WAITING" || task.status === "CANCELLED" ? (
                <IconBtn label="Resume" onClick={() => updateTaskStatus(task.id, "QUEUED")}>
                  <Play className="size-3" />
                </IconBtn>
              ) : (
                <IconBtn label="Pause" onClick={() => updateTaskStatus(task.id, "WAITING")}>
                  <Pause className="size-3" />
                </IconBtn>
              )}
              <IconBtn label="Retry" onClick={() => updateTaskStatus(task.id, "QUEUED")}>
                <RotateCcw className="size-3" />
              </IconBtn>
              <IconBtn label="Prioritize" onClick={() => prioritizeTask(task.id)}>
                <Zap className="size-3" />
              </IconBtn>
              <IconBtn label="Cancel" onClick={() => updateTaskStatus(task.id, "CANCELLED")}>
                <Ban className="size-3" />
              </IconBtn>
            </div>
          </li>
        ))}
        {list.length === 0 && <p className="text-xs text-muted-foreground">Queue is empty.</p>}
      </ul>
    </Panel>
  );
}

function IconBtn({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded border border-panel-border/70 p-1 text-muted-foreground transition-colors hover:border-crimson hover:text-crimson-bright"
    >
      {children}
    </button>
  );
}

export function ActivityPanel({ limit = 8 }: { limit?: number }) {
  const { activity, agents } = useJarvis();
  return (
    <Panel title="Recent Activity">
      <ul className="space-y-2">
        {activity.slice(0, limit).map((a) => {
          const agent = agents.find((x) => x.id === a.agentId);
          return (
            <li key={a.id} className="flex items-start gap-2 text-[11px]">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full"
                style={{ background: a.status === "SUCCESS" ? "var(--success)" : "var(--crimson-bright)" }}
              />
              <div className="min-w-0 flex-1">
                <span style={{ color: agent?.color }}>{agent?.name ?? "SYSTEM"}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>
              </div>
              <span className="shrink-0 font-mono text-[9px] text-muted-foreground/70">{timeAgo(a.ts)}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function WorkloadPanel() {
  const { agents, tasks } = useJarvis();
  return (
    <Panel title="Agent Workload">
      <ul className="space-y-2.5">
        {agents.map((a) => (
          <li key={a.id}>
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: a.color }}>{a.name}</span>
              <span className="font-mono text-muted-foreground">{a.workload}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${a.workload}%`, background: a.color, boxShadow: `0 0 8px ${a.color}` }}
              />
            </div>
            <div className="mt-0.5 font-mono text-[9px] text-muted-foreground/70">
              {tasks.filter((t) => t.agentId === a.id && t.status === "RUNNING").length} active ·{" "}
              {a.completed} completed · {a.status}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SystemStatusPanel() {
  const { integrations } = useJarvis();
  const openclaw = integrations.find((i) => i.id === "openclaw")?.status ?? "DISCONNECTED";
  const rows = [
    { icon: Cpu, label: "CPU Usage", value: "—", note: "requires desktop bridge" },
    { icon: MemoryStick, label: "Memory Usage", value: "—", note: "requires desktop bridge" },
    { icon: HardDrive, label: "Disk Space", value: "—", note: "requires desktop bridge" },
    { icon: Wifi, label: "Network", value: "Connected", note: "browser session" },
    { icon: PlugZap, label: "OpenClaw", value: openclaw === "CONNECTED" ? "Online" : "Not connected", note: "agent engine" },
    { icon: Mic, label: "Voice", value: "Local only", note: "ElevenLabs not linked" },
    { icon: Activity, label: "Simulation", value: "Running", note: "demo data" },
  ];
  return (
    <Panel title="System Status">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-[11px]">
            <r.icon className="size-3.5 text-crimson-bright" />
            <span className="flex-1 text-muted-foreground">{r.label}</span>
            <span className="text-foreground">{r.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[9px] leading-relaxed text-amber-hud">
        Windows Control: Not Connected — live hardware metrics stay blank until the desktop bridge is linked.
      </p>
    </Panel>
  );
}

export function SchedulePanel() {
  const { events } = useJarvis();
  return (
    <Panel
      title="Today's Schedule"
      action={
        <Link to="/calendar" className="font-mono text-[9px] text-muted-foreground hover:text-crimson-bright">
          OPEN
        </Link>
      }
    >
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.id} className="flex items-center gap-3 rounded-md border border-panel-border/50 px-2 py-1.5">
            <span className="w-16 shrink-0 font-mono text-[10px] text-crimson-bright">{e.time}</span>
            <span className="flex-1 truncate text-[12px] text-foreground">{e.title}</span>
            <span className="font-mono text-[9px] text-muted-foreground">{e.durationMin}m</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function QuickActionsPanel() {
  const { createTask, toggleVoice } = useJarvis();
  const actions = [
    { icon: Globe, label: "Open Browser", run: () => createTask({ title: "Open browser session", agentId: "bob", source: "Quick action" }) },
    { icon: ListPlus, label: "New Task", run: () => createTask({ title: "New operator task", agentId: "jarvis", source: "Quick action" }) },
    { icon: StickyNote, label: "New Note", to: "/notes" as const },
    { icon: Globe, label: "Search Web", run: () => createTask({ title: "Search the web", agentId: "alice", source: "Quick action" }) },
    { icon: FolderOpen, label: "Open Files", to: "/files" as const },
    { icon: Zap, label: "Run Agent", run: () => createTask({ title: "Run automation workflow", agentId: "dave", source: "Quick action" }) },
    { icon: Calendar, label: "Calendar", to: "/calendar" as const },
    { icon: Mic, label: "Voice", run: toggleVoice },
    { icon: PlugZap, label: "More", to: "/integrations" as const },
  ];
  return (
    <Panel title="Quick Actions">
      <div className="grid grid-cols-3 gap-1.5">
        {actions.map((a) =>
          a.to ? (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center gap-1 rounded-md border border-panel-border/60 px-1 py-2 text-[9px] text-muted-foreground transition-all hover:border-crimson hover:text-crimson-bright"
            >
              <a.icon className="size-4" />
              {a.label}
            </Link>
          ) : (
            <button
              key={a.label}
              onClick={() => {
                a.run?.();
                toast.success(`${a.label} triggered`);
              }}
              className="flex flex-col items-center gap-1 rounded-md border border-panel-border/60 px-1 py-2 text-[9px] text-muted-foreground transition-all hover:border-crimson hover:text-crimson-bright"
            >
              <a.icon className="size-4" />
              {a.label}
            </button>
          ),
        )}
      </div>
    </Panel>
  );
}

const PERMISSION_KEYS = ["Web access", "File read", "File write", "Windows control", "Calendar", "Email", "Automations"] as const;
type PermLevel = "YES" | "LIMITED" | "NO";
const PERM_COLOR: Record<PermLevel, string> = {
  YES: "var(--success)",
  LIMITED: "var(--amber-hud)",
  NO: "var(--muted-foreground)",
};
const DEFAULT_PERMS: Record<string, Record<string, PermLevel>> = {
  jarvis: { "Web access": "YES", "File read": "YES", "File write": "LIMITED", "Windows control": "LIMITED", Calendar: "YES", Email: "LIMITED", Automations: "YES" },
  alice: { "Web access": "YES", "File read": "LIMITED", "File write": "NO", "Windows control": "NO", Calendar: "NO", Email: "NO", Automations: "NO" },
  bob: { "Web access": "LIMITED", "File read": "YES", "File write": "YES", "Windows control": "YES", Calendar: "NO", Email: "NO", Automations: "LIMITED" },
  carol: { "Web access": "LIMITED", "File read": "NO", "File write": "NO", "Windows control": "NO", Calendar: "YES", Email: "LIMITED", Automations: "NO" },
  dave: { "Web access": "LIMITED", "File read": "LIMITED", "File write": "LIMITED", "Windows control": "NO", Calendar: "LIMITED", Email: "NO", Automations: "YES" },
};
const NEXT_LEVEL: Record<PermLevel, PermLevel> = { NO: "LIMITED", LIMITED: "YES", YES: "NO" };

export function AgentDetailPanel() {
  const { selectedAgentId, agents, tasks, setSelectedAgentId } = useJarvis();
  const [perms, setPerms] = useState<Record<string, Record<string, PermLevel>>>(DEFAULT_PERMS);
  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;
  const agentPerms: Record<string, PermLevel> = perms[agent.id] ?? {};
  const agentTasks = tasks.filter((t) => t.agentId === agent.id);
  return (
    <Panel
      title={`${agent.name} · ${agent.role}`}
      action={
        <button
          onClick={() => setSelectedAgentId(null)}
          className="font-mono text-[9px] text-muted-foreground hover:text-crimson-bright"
        >
          CLOSE
        </button>
      }
    >
      <p className="text-[11px] text-muted-foreground">{agent.description}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <Stat label="Status" value={agent.status} />
        <Stat label="Room" value={agent.currentRoom} />
        <Stat label="Target" value={agent.targetRoom} />
        <Stat label="Workload" value={`${agent.workload}%`} />
        <Stat label="Completed" value={String(agent.completed)} />
        <Stat label="Last active" value={clock(agent.lastActive)} />
      </dl>
      <div className="mt-3">
        <div className="hud-title mb-1">Capabilities</div>
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((c) => (
            <span key={c} className="rounded-sm border border-panel-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <div className="hud-title mb-1">Permissions</div>
        <ul className="space-y-1">
          {PERMISSION_KEYS.map((k) => {
            const level = agentPerms[k] ?? "NO";
            return (
              <li key={k} className="flex items-center justify-between gap-2 rounded border border-panel-border/50 px-2 py-1">
                <span className="text-[10px] text-muted-foreground">{k}</span>
                <button
                  onClick={() => {
                    const next = NEXT_LEVEL[level];
                    setPerms((p) => ({ ...p, [agent.id]: { ...(p[agent.id] ?? {}), [k]: next } }));
                    toast.success(`${agent.name}: ${k} set to ${next}`);
                  }}
                  className="rounded-sm border px-1.5 py-0.5 font-mono text-[9px] tracking-widest"
                  style={{ color: PERM_COLOR[level], borderColor: PERM_COLOR[level] }}
                >
                  {level}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-1.5 font-mono text-[9px] text-amber-hud">
          Permissions apply once the matching service is connected.
        </p>
      </div>
      <div className="mt-3">
        <div className="hud-title mb-1">Tasks</div>
        <ul className="space-y-1">
          {agentTasks.map((t) => (
            <li key={t.id} className="flex justify-between text-[10px]">
              <span className="truncate text-foreground">{t.title}</span>
              <span style={{ color: statusColor[t.status] }}>{t.status}</span>
            </li>
          ))}
          {agentTasks.length === 0 && <li className="text-[10px] text-muted-foreground">No tasks assigned.</li>}
        </ul>
      </div>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-panel-border/50 px-2 py-1">
      <dt className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="text-[11px] text-foreground">{value}</dd>
    </div>
  );
}
