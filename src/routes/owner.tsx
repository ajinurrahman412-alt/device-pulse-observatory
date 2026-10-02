import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Brain, CheckSquare, Coins, CreditCard, Flag, Lock, Plug, ScrollText, Shield, Sliders, UserCog, Users } from "lucide-react";
import { pageHead } from "@/lib/jarvis/head";
import { useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/owner")({
  head: () => pageHead("Owner Console — AJINUR2.0", "Founder-only controls for roles, features, plans, credits, AI providers, audits and emergency lock."),
  component: OwnerConsole,
});

const SECTIONS = [
  { id: "super", label: "Super Admin Management", icon: UserCog },
  { id: "admin", label: "Admin Management", icon: UserCog },
  { id: "manager", label: "Manager Management", icon: UserCog },
  { id: "users", label: "User Management", icon: Users },
  { id: "security", label: "Security Center", icon: Shield },
  { id: "openclaw", label: "OpenClaw", icon: Plug },
  { id: "system", label: "System Controls", icon: Sliders },
  { id: "flags", label: "Feature Flags", icon: Flag },
  { id: "subs", label: "Subscription Configuration", icon: CreditCard },
  { id: "credits", label: "Credit Configuration", icon: Coins },
  { id: "ai", label: "AI Provider Configuration", icon: Brain },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
  { id: "approval", label: "Approval System", icon: CheckSquare },
  { id: "lock", label: "Emergency Lock", icon: Lock },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

function Toggle({ label, hint }: { label: string; hint?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-start justify-between gap-3 border-b border-panel-border/30 py-2">
      <div className="min-w-0"><div className="text-xs text-foreground">{label}</div>{hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}</div>
      <button aria-label={label} onClick={() => setOn((v) => !v)} className={cn("h-5 w-9 shrink-0 rounded-full border", on ? "border-cyan-hud bg-cyan-hud/40" : "border-panel-border bg-secondary")}>
        <span className={cn("block size-3.5 rounded-full bg-foreground transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

function NotConnected({ what }: { what: string }) {
  return <p className="mt-3 rounded border border-amber-hud/40 bg-amber-hud/10 px-3 py-2 font-mono text-[10px] text-amber-hud">Setup Required — {what} will appear once the connection is provided.</p>;
}

function RoleList({ role }: { role: string }) {
  return (
    <>
      <p className="text-xs text-muted-foreground">Assign or remove the {role} role. Only the Founder can change roles.</p>
      <div className="mt-3 flex gap-2">
        <input disabled placeholder="user@email.com" className="min-w-0 flex-1 rounded border border-panel-border bg-background/60 px-2 py-1.5 text-xs" />
        <button disabled className="rounded border border-cyan-hud/50 px-3 font-mono text-[10px] text-cyan-hud opacity-60">ASSIGN</button>
      </div>
      <NotConnected what={`The ${role} list`} />
    </>
  );
}

function SectionBody({ id }: { id: SectionId }) {
  const { audit } = useJarvis() as unknown as { audit?: { id: string; ts: number; tool: string; action: string; result: string }[] };
  switch (id) {
    case "super": return <RoleList role="Super Admin" />;
    case "admin": return <RoleList role="Admin" />;
    case "manager": return <RoleList role="Manager" />;
    case "users": return <><p className="text-xs text-muted-foreground">Search, suspend or review every account.</p><NotConnected what="Total users and the user table" /></>;
    case "security": return <><Toggle label="Require 2-step sign-in for staff" /><Toggle label="Block sign-ins from new countries" /><Toggle label="Alert on failed owner logins" /></>;
    case "openclaw": return <><div className="font-mono text-xs">Gateway: <span className="text-amber-hud">Not Connected</span></div><NotConnected what="OpenClaw controls" /></>;
    case "system": return <><Toggle label="Maintenance mode" hint="Users see a maintenance notice" /><Toggle label="Pause all agents" /><Toggle label="Allow new sign-ups" /></>;
    case "flags": return <><Toggle label="Voice assistant" /><Toggle label="Gesture control" /><Toggle label="Visual Hub" /><Toggle label="University room lessons" /></>;
    case "subs": return (
      <div className="grid gap-2 sm:grid-cols-3">
        {["Basic", "Pro", "Premium"].map((p) => (
          <div key={p} className="rounded border border-panel-border p-3">
            <div className="font-display text-sm tracking-widest text-cyan-hud">{p}</div>
            {["1 Month", "6 Months", "1 Year"].map((d) => (
              <label key={d} className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">{d}<input disabled placeholder="$ —" className="w-16 rounded border border-panel-border bg-background/60 px-1 py-0.5" /></label>
            ))}
          </div>
        ))}
      </div>
    );
    case "credits": return <>{["Basic", "Pro", "Premium"].map((p) => (<label key={p} className="mt-2 flex items-center justify-between text-xs">{p} monthly credits<input disabled placeholder="—" className="w-24 rounded border border-panel-border bg-background/60 px-2 py-1" /></label>))}<NotConnected what="Credit rules" /></>;
    case "ai": return <><ul className="space-y-1.5 text-xs">{["Main chat model", "Voice", "Image"].map((x) => <li key={x} className="flex justify-between"><span>{x}</span><span className="text-muted-foreground">Not configured</span></li>)}</ul><p className="mt-2 font-mono text-[9px] text-muted-foreground">Keys are stored on the server and never shown here.</p></>;
    case "audit": {
      const rows = audit ?? [];
      return rows.length === 0 ? <NotConnected what="Audit logs" /> : (
        <ul className="space-y-1 text-[11px]">{rows.slice(0, 12).map((r) => <li key={r.id} className="flex justify-between gap-2"><span className="truncate">{r.tool} · {r.action}</span><span className="shrink-0 text-muted-foreground">{r.result}</span></li>)}</ul>
      );
    }
    case "approval": return <><p className="text-xs text-muted-foreground">Risky agent actions wait here for your yes / no.</p><p className="mt-3 text-xs text-muted-foreground">No requests waiting.</p></>;
    case "lock": return <EmergencyLock />;
  }
}

function EmergencyLock() {
  const [armed, setArmed] = useState(false);
  return (
    <div className="rounded border border-crimson/60 bg-crimson/10 p-4">
      <div className="flex items-center gap-2 font-display text-sm tracking-widest text-crimson-bright"><AlertTriangle className="size-4" /> EMERGENCY LOCK</div>
      <p className="mt-1 text-xs text-muted-foreground">Stops every agent and signs out all users except the Founder.</p>
      <button onClick={() => setArmed((v) => !v)} className="mt-3 rounded border border-crimson px-4 py-2 font-mono text-[11px] text-crimson-bright">{armed ? "CONFIRM LOCK (not connected)" : "ARM LOCK"}</button>
      {armed && <p className="mt-2 font-mono text-[10px] text-amber-hud">Lock is not connected yet — nothing was locked.</p>}
    </div>
  );
}

function OwnerConsole() {
  const [active, setActive] = useState<SectionId>("super");
  const sec = SECTIONS.find((s) => s.id === active)!;
  return (
    <div className="space-y-3">
      <div>
        <h1 className="font-display text-xl tracking-[0.2em] text-amber-hud">OWNER CONSOLE</h1>
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">FOUNDER CONTROLS · AJINUR2.0</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="hud-panel flex gap-1 overflow-x-auto border border-panel-border p-2 lg:flex-col">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className={cn("flex shrink-0 items-center gap-2 rounded px-3 py-2 text-left text-[11px]", active === s.id ? "bg-cyan-hud/20 text-cyan-hud" : "text-muted-foreground hover:bg-secondary/60")}>
              <s.icon className="size-3.5 shrink-0" /> {s.label}
            </button>
          ))}
        </nav>
        <section className="hud-panel animate-fade-in border border-panel-border p-4" key={active}>
          <div className="mb-3 flex items-center gap-2 font-display text-sm tracking-widest text-foreground"><sec.icon className="size-4 text-cyan-hud" /> {sec.label.toUpperCase()}</div>
          <SectionBody id={active} />
        </section>
      </div>
    </div>
  );
}
