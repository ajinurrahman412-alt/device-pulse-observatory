import { createFileRoute } from "@tanstack/react-router";
import { ActivityPanel, Panel, WorkloadPanel, SystemStatusPanel } from "@/components/jarvis/Panels";
import { clock, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/activity")({
  head: () => pageHead("Activity — JARVIS", "Live feed of everything your agents are doing right now."),
  component: ActivityPage,
});

function ActivityPage() {
  const { activity, agents, tasks } = useJarvis();
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label="Agents online" value={String(agents.length)} />
          <Metric label="Running" value={String(tasks.filter((t) => t.status === "RUNNING").length)} />
          <Metric label="Queued" value={String(tasks.filter((t) => t.status === "QUEUED").length)} />
          <Metric label="Completed" value={String(completed)} />
        </div>
        <Panel title="Full Activity Log">
          <ul className="space-y-1.5">
            {activity.map((a) => {
              const agent = agents.find((x) => x.id === a.agentId);
              return (
                <li key={a.id} className="flex items-center gap-3 border-b border-panel-border/30 py-1.5 text-[11px]">
                  <span className="font-mono text-[9px] text-muted-foreground/70">{clock(a.ts)}</span>
                  <span style={{ color: agent?.color }}>{agent?.name}</span>
                  <span className="flex-1 text-muted-foreground">{a.action}</span>
                  <span className="font-mono text-[9px]" style={{ color: a.status === "SUCCESS" ? "var(--success)" : "var(--muted-foreground)" }}>
                    {a.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
      <div className="space-y-3">
        <WorkloadPanel />
        <ActivityPanel limit={6} />
        <SystemStatusPanel />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-panel px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl text-crimson-bright glow-text">{value}</div>
    </div>
  );
}
