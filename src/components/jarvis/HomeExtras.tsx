import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Check, Circle, Crown, FileText, FolderOpen, Globe, ListChecks, Mic, MoreHorizontal, Play, Search, Shield, User } from "lucide-react";
import { useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

/** Owner-only static identity cards (not Agent Town characters). */
export function RoleCards({ userEmail }: { userEmail: string | null }) {
  const cards = [
    { title: "Founder / Owner", sub: "Ajinur2.0", king: true },
    { title: "Super Admin", sub: "System Control" },
    { title: "Admin", sub: "Manage Ops" },
    { title: "Manager", sub: "Plan Control" },
    { title: "User", sub: userEmail ?? "—" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div key={c.title} className={cn("hud-panel flex min-w-0 items-center gap-2 border p-2", c.king ? "border-amber-hud/70 text-amber-hud" : "border-panel-border text-cyan-hud")}>
          <div className={cn("grid size-8 shrink-0 place-items-center rounded-full border", c.king ? "border-amber-hud" : "border-cyan-hud/60")}>
            {c.king ? <Crown className="size-4" /> : c.title === "User" ? <User className="size-4" /> : <Shield className="size-4" />}
          </div>
          <div className="min-w-0">
            <div className="truncate font-mono text-[9px] tracking-widest text-muted-foreground">{c.title.toUpperCase()}</div>
            <div className="truncate text-xs text-foreground">{c.sub}</div>
            {c.king && <div className="font-display text-[9px] tracking-widest">KING</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return (
    <span className="rounded border border-panel-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
      {now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {now.toLocaleTimeString()}
    </span>
  );
}

/** User credits + plan — values not connected yet, shown honestly. */
export function UserPlanPanels() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="hud-panel border border-panel-border p-4">
        <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">CREDITS</div>
        <div className="mt-2 flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full border-4 border-muted font-display text-sm text-cyan-hud">—</div>
          <div className="text-xs text-muted-foreground">Used / Total: —<br />Remaining: —<br /><span className="text-amber-hud">Setup Required</span></div>
        </div>
      </div>
      <div className="hud-panel border border-panel-border p-4">
        <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">CURRENT PLAN</div>
        <div className="mt-2 font-display text-lg tracking-widest text-cyan-hud">—</div>
        <div className="text-xs text-muted-foreground">Plans: Basic · Pro · Premium (1 / 6 / 12 months)</div>
        <Link to="/billing" className="mt-3 inline-block rounded border border-cyan-hud/60 px-3 py-1 font-mono text-[10px] text-cyan-hud">UPGRADE PLAN</Link>
      </div>
    </div>
  );
}

export function CurrentTaskPanel() {
  const { tasks, agents } = useJarvis();
  const task = tasks.find((t) => t.status === "RUNNING") ?? tasks[0];
  if (!task) return null;
  const agent = agents.find((a) => a.id === task.agentId);
  return (
    <div className="hud-panel border border-panel-border p-4">
      <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">CURRENT TASK</div>
      <div className="mt-1 text-sm text-foreground">{task.title}</div>
      <div className="text-xs text-muted-foreground">{agent?.name} · {agent?.role}</div>
      <div className="mt-2 h-1 overflow-hidden rounded bg-muted"><div className="h-full bg-cyan-hud" style={{ width: `${task.progress}%` }} /></div>
      <div className="mt-1 font-mono text-[10px] text-cyan-hud">{Math.round(task.progress)}%</div>
      <ul className="mt-2 space-y-1 text-xs">
        {task.steps.map((s) => (
          <li key={s.label} className={cn("flex items-center gap-1.5", s.done ? "text-foreground" : "text-muted-foreground")}>
            {s.done ? <Check className="size-3 text-cyan-hud" /> : <Circle className="size-3" />} {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TaskQueue() {
  const { tasks, agents } = useJarvis();
  const open = tasks.filter((t) => ["RUNNING", "QUEUED", "WAITING"].includes(t.status)).slice(0, 5);
  return (
    <div className="hud-panel border border-panel-border p-4">
      <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">TASK QUEUE</div>
      <ul className="mt-2 space-y-1.5 text-xs">
        {open.length === 0 && <li className="text-muted-foreground">Queue is empty.</li>}
        {open.map((t, i) => (
          <li key={t.id} className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-foreground">#{i + 1} {t.title} <span className="text-muted-foreground">· {agents.find((a) => a.id === t.agentId)?.name}</span></span>
            <span className={cn("shrink-0 font-mono text-[9px]", t.status === "RUNNING" ? "text-cyan-hud" : "text-amber-hud")}>{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgentWorkload() {
  const { agents } = useJarvis();
  return (
    <div className="hud-panel border border-panel-border p-4">
      <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">AGENT WORKLOAD</div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {agents.slice(0, 4).map((a) => {
          const w = Math.round(a.workload);
          return (
            <div key={a.id} className="flex flex-col items-center gap-1">
              <div className="grid size-12 place-items-center rounded-full font-mono text-[10px] text-foreground" style={{ background: `conic-gradient(var(--color-cyan-hud) ${w * 3.6}deg, var(--color-muted) 0)` }}>
                <span className="grid size-9 place-items-center rounded-full bg-background">{w}%</span>
              </div>
              <span className="truncate text-[10px] text-muted-foreground">{a.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const QUICK = [
  { label: "Open Browser", icon: Globe },
  { label: "Check Calendar", icon: Calendar, to: "/calendar" },
  { label: "New Task", icon: ListChecks, to: "/tasks" },
  { label: "New Note", icon: FileText, to: "/notes" },
  { label: "Search Web", icon: Search },
  { label: "Open Files", icon: FolderOpen, to: "/files" },
  { label: "Run Agent", icon: Play, to: "/agent-town" },
  { label: "More", icon: MoreHorizontal, to: "/skills" },
] as const;

export function BottomJarvis({ isOwner }: { isOwner: boolean }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="hud-panel border border-panel-border p-4">
        <div className="flex items-center justify-between">
          <div className="font-display text-sm tracking-widest text-cyan-hud">JARVIS 2.0 <span className="font-mono text-[10px] text-muted-foreground">AI ASSISTANT · ONLINE</span></div>
          <div className="flex h-5 items-end gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-0.5 animate-pulse bg-cyan-hud" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${i * 90}ms` }} />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{isOwner ? "Ready when you are, King." : "Hello, I am JARVIS2.0, created by Ajinur2.0. How can I help, Boss?"}</p>
        <div className="mt-3 flex gap-2">
          <Link to="/chat" className="flex-1 rounded border border-panel-border px-3 py-2 text-xs text-muted-foreground">Ask JARVIS…</Link>
          <Link to="/voice" className="grid place-items-center rounded border border-cyan-hud/60 px-3 text-cyan-hud" aria-label="Voice"><Mic className="size-4" /></Link>
        </div>
      </div>
      <div className="hud-panel border border-panel-border p-4">
        <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">QUICK ACTIONS</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {QUICK.map((q) => {
            const inner = (<><q.icon className="size-4" /><span className="text-center text-[9px] leading-tight">{q.label}</span>{!("to" in q) && <span className="text-[8px] text-amber-hud">Not Connected</span>}</>);
            const cls = "flex flex-col items-center gap-1 rounded border border-panel-border p-2 text-cyan-hud hover:bg-secondary/60";
            return "to" in q ? <Link key={q.label} to={q.to} className={cls}>{inner}</Link> : <div key={q.label} className={cn(cls, "opacity-60")}>{inner}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
