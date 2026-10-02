import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

const STATUS_COLOR: Record<string, string> = {
  CONNECTED: "var(--success)",
  CONNECTING: "var(--amber-hud)",
  DISCONNECTED: "var(--muted-foreground)",
  ERROR: "var(--crimson-bright)",
};

export const Route = createFileRoute("/integrations")({
  head: () => pageHead("Integrations — JARVIS", "Connect OpenClaw, Google services, voice and workflow tools."),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const { integrations, toggleIntegration } = useJarvis();
  return (
    <div className="space-y-3">
      <Panel title="Connection Notice">
        <p className="text-[11px] text-muted-foreground">
          Nothing here is faked: each service stays marked as not connected until real credentials are added on
          the server. Agents will refuse actions that need a missing connection.
        </p>
      </Panel>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => (
          <Panel key={i.id} title={i.name}>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="size-1.5 rounded-full" style={{ background: STATUS_COLOR[i.status] }} />
              <span style={{ color: STATUS_COLOR[i.status] }}>{i.status}</span>
              <span className="ml-auto text-muted-foreground">{i.category}</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{i.detail}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                onClick={() => toggleIntegration(i.id)}
                className="rounded-md border border-crimson bg-crimson/15 px-3 py-1.5 font-display text-[10px] tracking-[0.15em] text-crimson-bright"
              >
                {i.status === "CONNECTED" ? "DISCONNECT" : "CONNECT"}
              </button>
              <button
                onClick={() => toast.info(`${i.name} needs credentials before it can reconnect.`)}
                className="rounded-md border border-panel-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-crimson-bright"
              >
                Reconnect
              </button>
              <button
                onClick={() => toast.error(`${i.name}: no live connection to test yet.`)}
                className="rounded-md border border-panel-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-crimson-bright"
              >
                Test
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
