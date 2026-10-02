import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/jarvis/Panels";
import { clock, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

const RISK_COLOR: Record<string, string> = {
  LOW: "var(--success)",
  MEDIUM: "var(--amber-hud)",
  HIGH: "var(--crimson-bright)",
};

const RISK_EXAMPLES = [
  { level: "LOW", items: ["Read information", "Open an app", "Search the web"] },
  { level: "MEDIUM", items: ["Create a calendar event", "Create a file", "Send an internal task"] },
  { level: "HIGH", items: ["Delete files", "Run shell commands", "Install software", "Financial actions"] },
];

export const Route = createFileRoute("/security")({
  head: () => pageHead("Security — JARVIS", "Permissions, risk levels, sessions and the full audit trail."),
  component: SecurityPage,
});

function SecurityPage() {
  const { audit, agents, integrations } = useJarvis();
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        <Panel title="Audit Log">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2 font-normal">Time</th>
                <th className="pb-2 font-normal">Agent</th>
                <th className="pb-2 font-normal">Tool</th>
                <th className="pb-2 font-normal">Action</th>
                <th className="pb-2 font-normal">Risk</th>
                <th className="pb-2 font-normal">Result</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((a) => (
                <tr key={a.id} className="border-t border-panel-border/40">
                  <td className="py-2 font-mono text-muted-foreground">{clock(a.ts)}</td>
                  <td className="py-2">{a.agentId.toUpperCase()}</td>
                  <td className="py-2 text-muted-foreground">{a.tool}</td>
                  <td className="py-2 text-foreground">{a.action}</td>
                  <td className="py-2" style={{ color: RISK_COLOR[a.risk] }}>{a.risk}</td>
                  <td className="py-2" style={{ color: a.result === "SUCCESS" ? "var(--success)" : "var(--crimson-bright)" }}>
                    {a.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Agent Permissions">
          <ul className="space-y-2">
            {agents.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-[11px]">
                <span className="w-16" style={{ color: a.color }}>{a.name}</span>
                <div className="flex gap-1">
                  {a.permissions.map((p) => (
                    <span
                      key={p}
                      className="rounded-sm border px-1.5 py-0.5 font-mono text-[9px]"
                      style={{ color: RISK_COLOR[p], borderColor: RISK_COLOR[p] }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="space-y-3">
        <Panel title="Connection Security">
          <ul className="space-y-1.5 text-[11px]">
            {integrations.slice(0, 6).map((i) => (
              <li key={i.id} className="flex justify-between">
                <span className="text-muted-foreground">{i.name}</span>
                <span>{i.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Risk Levels">
          {RISK_EXAMPLES.map((r) => (
            <div key={r.level} className="mb-2">
              <div className="font-mono text-[10px]" style={{ color: RISK_COLOR[r.level] }}>{r.level} RISK</div>
              <ul className="ml-3 list-disc text-[11px] text-muted-foreground">
                {r.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="font-mono text-[9px] text-amber-hud">
            High-risk actions always ask for confirmation before they run.
          </p>
        </Panel>
        <Panel title="Active Sessions">
          <ul className="space-y-1.5 text-[11px] text-muted-foreground">
            <li className="flex justify-between"><span>This desktop</span><span className="text-success">Active now</span></li>
            <li className="flex justify-between"><span>Sign-in accounts</span><span>Not enabled</span></li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
