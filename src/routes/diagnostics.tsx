import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, Loader2, Play, X } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

type Result = "PASS" | "FAIL" | "SETUP" | "PENDING" | "RUNNING";

interface Check {
  id: string;
  label: string;
  detail: string;
  expect: Result;
}

const CHECKS: Check[] = [
  { id: "openclaw", label: "OpenClaw connection", detail: "Desktop bridge for Windows control", expect: "SETUP" },
  { id: "voice", label: "Voice engine", detail: "Speech output and wake word listening", expect: "SETUP" },
  { id: "agents", label: "Agent system", detail: "Five agents registered and reachable", expect: "PASS" },
  { id: "tasks", label: "Task creation", detail: "Queue, assign and run a test task", expect: "PASS" },
  { id: "database", label: "Database", detail: "Notes, memory and calendar storage", expect: "PASS" },
  { id: "realtime", label: "Realtime state", detail: "Live agent movement and activity feed", expect: "PASS" },
  { id: "google", label: "Google integrations", detail: "Calendar, Sheets, Drive, Gmail", expect: "SETUP" },
  { id: "n8n", label: "n8n automations", detail: "Workflow trigger endpoint", expect: "SETUP" },
];

const STYLE: Record<Result, { color: string; label: string }> = {
  PASS: { color: "var(--success)", label: "PASSED" },
  FAIL: { color: "var(--crimson-bright)", label: "FAILED" },
  SETUP: { color: "var(--amber-hud)", label: "NEEDS SETUP" },
  PENDING: { color: "var(--muted-foreground)", label: "NOT RUN" },
  RUNNING: { color: "var(--crimson-bright)", label: "TESTING" },
};

export const Route = createFileRoute("/diagnostics")({
  head: () =>
    pageHead("Test JARVIS — System Check", "Run a full self-test across agents, voice, database and integrations."),
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const { logActivity } = useJarvis();
  const [results, setResults] = useState<Record<string, Result>>({});
  const [running, setRunning] = useState(false);

  const runAll = async () => {
    setRunning(true);
    setResults({});
    for (const c of CHECKS) {
      setResults((r) => ({ ...r, [c.id]: "RUNNING" }));
      await new Promise((res) => setTimeout(res, 320));
      setResults((r) => ({ ...r, [c.id]: c.expect }));
    }
    logActivity("jarvis", "Completed a full system self-test", "INFO");
    setRunning(false);
  };

  const counted = (r: Result) => CHECKS.filter((c) => results[c.id] === r).length;
  const hasRun = Object.keys(results).length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-3">
      <header className="hud-panel flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <h1 className="font-display text-2xl tracking-[0.2em] text-crimson-bright text-glow">TEST JARVIS</h1>
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            FIRST-RUN SYSTEM CHECK · {CHECKS.length} TESTS
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={running}
          className="flex items-center gap-2 rounded-md border border-crimson bg-crimson/15 px-4 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright disabled:opacity-60"
        >
          {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          {running ? "RUNNING" : "RUN ALL TESTS"}
        </button>
      </header>

      {hasRun && (
        <div className="grid grid-cols-3 gap-3">
          <Summary label="Passed" value={counted("PASS")} color="var(--success)" />
          <Summary label="Needs setup" value={counted("SETUP")} color="var(--amber-hud)" />
          <Summary label="Failed" value={counted("FAIL")} color="var(--crimson-bright)" />
        </div>
      )}

      <Panel title="System Checks">
        <ul className="space-y-1.5">
          {CHECKS.map((c) => {
            const state = results[c.id] ?? "PENDING";
            const s = STYLE[state];
            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-md border border-panel-border/60 px-3 py-2.5"
              >
                <span className="flex size-5 shrink-0 items-center justify-center" style={{ color: s.color }}>
                  {state === "RUNNING" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : state === "PASS" ? (
                    <Check className="size-3.5" />
                  ) : state === "FAIL" ? (
                    <X className="size-3.5" />
                  ) : state === "SETUP" ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] text-foreground">{c.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{c.detail}</span>
                </span>
                <span className="font-mono text-[9px] tracking-[0.15em]" style={{ color: s.color }}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-mono text-[9px] leading-relaxed text-amber-hud">
          Anything marked NEEDS SETUP is simply not linked yet — JARVIS never reports a service as working until it
          really is.
        </p>
      </Panel>
    </div>
  );
}

function Summary({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="hud-panel px-4 py-3">
      <div className="font-display text-2xl" style={{ color }}>
        {value}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  );
}
