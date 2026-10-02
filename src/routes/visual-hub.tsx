import { createFileRoute } from "@tanstack/react-router";
import { AgentTown } from "@/components/jarvis/AgentTown";
import { Panel, SystemStatusPanel, WorkloadPanel, ActivityPanel } from "@/components/jarvis/Panels";
import { statusColor, useJarvis } from "@/lib/jarvis/store";
import { ROOMS } from "@/lib/jarvis/data";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/visual-hub")({
  head: () =>
    pageHead(
      "Visual Hub — JARVIS",
      "A single glass wall showing your agent town, task flow and system signals at a glance.",
    ),
  component: VisualHub,
});

function VisualHub() {
  const { agents, tasks } = useJarvis();

  return (
    <div className="space-y-3">
      <div className="hud-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="font-display text-sm tracking-[0.3em] text-crimson-bright glow-text">VISUAL HUB</div>
          <div className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">
            LIVE VISUALISATION · AGENTS · TASKS · SYSTEM
          </div>
        </div>
        <div className="flex gap-4">
          <Stat label="Agents" value={agents.length} />
          <Stat label="Rooms" value={ROOMS.length} />
          <Stat label="Tasks" value={tasks.length} />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Panel title="Agent Town — Live View">
            <div className="-m-2">
              <AgentTown showCore />
            </div>
          </Panel>

          <Panel title="Task Flow">
            <div className="flex flex-wrap gap-2">
              {tasks.map((t) => {
                const agent = agents.find((a) => a.id === t.agentId);
                return (
                  <div
                    key={t.id}
                    className="hud-panel min-w-[180px] flex-1 px-3 py-2"
                    style={{ borderColor: `${agent?.color}55` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-[10px] tracking-[0.16em]" style={{ color: agent?.color }}>
                        {agent?.name}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">{t.status}</span>
                    </div>
                    <div className="mt-1 truncate text-[11px] text-foreground">{t.title}</div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${t.progress}%`, background: agent?.color, boxShadow: `0 0 10px ${agent?.color}` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Agent Signal Grid">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a) => (
                <div key={a.id} className="hud-panel flex items-center gap-3 px-3 py-2">
                  <div
                    className="flex size-8 items-center justify-center rounded-full border font-display text-[10px]"
                    style={{ borderColor: a.color, color: a.color, boxShadow: `0 0 12px ${a.color}` }}
                  >
                    {a.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[11px] tracking-[0.16em] text-foreground">{a.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full" style={{ background: statusColor[a.status] }} />
                      <span className="font-mono text-[9px] text-muted-foreground">{a.status}</span>
                    </div>
                  </div>
                  <div className="font-display text-sm" style={{ color: a.color }}>
                    {a.workload}%
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <WorkloadPanel />
          <SystemStatusPanel />
          <Panel title="Screen Vision">
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-panel-border text-center">
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground">SCREEN FEED</div>
              <div className="mt-1 font-display text-xs text-amber-hud">NOT CONNECTED</div>
              <p className="mt-1 px-4 text-[10px] text-muted-foreground">
                Your computer is not linked yet, so no screen is shown here.
              </p>
            </div>
          </Panel>
          <ActivityPanel limit={6} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-right">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-xl text-crimson-bright glow-text">{value}</div>
    </div>
  );
}
