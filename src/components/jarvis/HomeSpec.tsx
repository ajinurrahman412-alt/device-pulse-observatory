import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Cpu, HardDrive, MemoryStick, Power, Wifi } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

/** Top-right status: OpenClaw, System Health, notifications, logout. */
export function TopSystemStatus() {
  const { userEmail } = useJarvis();
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
      <span className="flex items-center gap-1.5 rounded border border-destructive/50 px-2 py-1 text-destructive">
        <span className="size-1.5 rounded-full bg-current" /> OPENCLAW · DISCONNECTED
      </span>
      <span className={cn("flex items-center gap-1.5 rounded border px-2 py-1", online ? "border-cyan-hud/50 text-cyan-hud" : "border-amber-hud/50 text-amber-hud")}>
        <span className="size-1.5 rounded-full bg-current pulse" /> SYSTEM HEALTH · {online ? "EXCELLENT" : "WARNING"}
      </span>
      <Link to="/activity" aria-label="Notifications" className="rounded border border-panel-border p-1.5 text-muted-foreground hover:text-cyan-hud"><Bell className="size-3.5" /></Link>
      {userEmail && (
        <button aria-label="Log out" onClick={() => supabase.auth.signOut()} className="rounded border border-panel-border p-1.5 text-muted-foreground hover:text-destructive"><Power className="size-3.5" /></button>
      )}
    </div>
  );
}

/** Owner metric row — values shown only when real; otherwise honest status. */
export function OwnerMetricRow() {
  const { agents } = useJarvis();
  const active = agents.filter((a) => !["IDLE", "OFFLINE", "RESTING"].includes(a.status)).length;
  const items = [
    { label: "TOTAL USERS", value: "—", note: "Setup Required" },
    { label: "ACTIVE AGENTS", value: `${active}/${agents.length}`, note: "Sample data" },
    { label: "SYSTEM UPTIME", value: "—", note: "Not Connected" },
    { label: "OPENCLAW", value: "OFFLINE", note: "Not Connected" },
    { label: "CREDITS", value: "—", note: "Setup Required" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {items.map((m) => (
        <div key={m.label} className="hud-panel hud-crisp border border-panel-border p-3">
          <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">{m.label}</div>
          <div className="mt-1 font-display text-lg tracking-widest text-cyan-hud">{m.value}</div>
          <div className="font-mono text-[9px] text-muted-foreground">{m.note}</div>
        </div>
      ))}
    </div>
  );
}

export function TodaySchedule() {
  const { events } = useJarvis();
  const list = [...events].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);
  return (
    <div className="hud-panel hud-crisp border border-panel-border p-4">
      <div className="flex items-center justify-between">
        <div className="font-display text-sm tracking-widest text-foreground">TODAY'S SCHEDULE</div>
        <Link to="/calendar" className="font-mono text-[10px] text-cyan-hud">VIEW ALL</Link>
      </div>
      <ul className="mt-3 space-y-2">
        {list.length === 0 && <li className="text-xs text-muted-foreground">Nothing scheduled.</li>}
        {list.map((e) => (
          <li key={e.id} className="flex items-center gap-3 text-xs">
            <span className="w-16 shrink-0 font-mono text-cyan-hud">{e.time}</span>
            <span className="flex-1 truncate text-foreground">{e.title}</span>
            <span className="rounded border border-panel-border px-1.5 font-mono text-[9px] uppercase text-muted-foreground">{e.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SystemStatusPanel() {
  const [info, setInfo] = useState<{ cores?: number | undefined; mem?: number | undefined; net?: string | undefined }>({});
  useEffect(() => {
    const n = navigator as Navigator & { deviceMemory?: number; connection?: { effectiveType?: string } };
    setInfo({ cores: n.hardwareConcurrency, mem: n.deviceMemory, net: n.onLine ? (n.connection?.effectiveType?.toUpperCase() ?? "ONLINE") : "OFFLINE" });
  }, []);
  const rows = [
    { icon: Cpu, label: "CPU USAGE", value: info.cores ? `${info.cores} cores · usage needs desktop app` : "Unavailable" },
    { icon: MemoryStick, label: "MEMORY", value: info.mem ? `${info.mem} GB device · usage needs desktop app` : "Unavailable" },
    { icon: HardDrive, label: "DISK SPACE", value: "Needs desktop app" },
    { icon: Wifi, label: "NETWORK", value: info.net ?? "…" },
  ];
  return (
    <div className="hud-panel hud-crisp border border-panel-border p-4">
      <div className="font-display text-sm tracking-widest text-foreground">SYSTEM STATUS</div>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-xs">
            <r.icon className="size-3.5 text-cyan-hud" />
            <span className="w-24 font-mono text-[10px] text-muted-foreground">{r.label}</span>
            <span className="flex-1 text-right text-foreground">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardFooter({ isOwner }: { isOwner: boolean }) {
  const links = [
    { to: "/agent-town", label: "Agents" },
    { to: "/tasks", label: "Tasks" },
    { to: "/activity", label: "Activity" },
    { to: "/security", label: "Security" },
    { to: "/settings", label: "Settings" },
  ] as const;
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-panel-border pt-3 font-mono text-[10px] text-muted-foreground">
      <span>
        <span className="text-cyan-hud">AJINUR2.0</span> · {isOwner ? "Owner Dashboard" : "User Dashboard"} · Powered by OpenClaw · Tauri Desktop App
      </span>
      <nav className="flex gap-3">
        {links.map((l) => <Link key={l.to} to={l.to} className="hover:text-cyan-hud">{l.label}</Link>)}
      </nav>
    </footer>
  );
}
