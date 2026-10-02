import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

const RISK_COLOR: Record<string, string> = {
  LOW: "var(--success)",
  MEDIUM: "var(--amber-hud)",
  HIGH: "var(--crimson-bright)",
};

export const Route = createFileRoute("/skills")({
  head: () => pageHead("Skills — JARVIS", "Enable, configure and test the capabilities your agents can use."),
  component: SkillsPage,
});

function SkillsPage() {
  const { skills, toggleSkill } = useJarvis();
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {skills.map((s) => (
        <Panel key={s.id} title={s.name}>
          <p className="text-[11px] text-muted-foreground">{s.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span
              className="rounded-sm border px-1.5 py-0.5 font-mono text-[9px]"
              style={{ color: RISK_COLOR[s.risk], borderColor: RISK_COLOR[s.risk] }}
            >
              {s.risk} RISK
            </span>
            {s.requires.map((r) => (
              <span key={r} className="rounded-sm border border-panel-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {r}
              </span>
            ))}
          </div>
          <div className="mt-2 font-mono text-[9px] text-muted-foreground/70">Last used: {s.lastUsed}</div>
          <div className="mt-3 flex gap-1.5">
            <button
              onClick={() => toggleSkill(s.id)}
              className="flex-1 rounded-md border border-crimson bg-crimson/15 py-1.5 font-display text-[10px] tracking-[0.15em] text-crimson-bright"
            >
              {s.enabled ? "DISABLE" : "ENABLE"}
            </button>
            <button
              onClick={() => toast.info(`${s.name} configuration opens once its integrations are connected.`)}
              className="rounded-md border border-panel-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-crimson-bright"
            >
              Configure
            </button>
            <button
              onClick={() =>
                s.requires.length
                  ? toast.error(`${s.name} needs ${s.requires.join(", ")} connected first.`)
                  : toast.success(`${s.name} responded normally.`)
              }
              className="rounded-md border border-panel-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-crimson-bright"
            >
              Test
            </button>
          </div>
        </Panel>
      ))}
    </div>
  );
}
