import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Circle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  detail: string;
  cta: string;
  to?: "/auth" | "/integrations" | "/voice" | "/settings" | "/diagnostics";
}

const STEPS: Step[] = [
  {
    id: "account",
    title: "Create your account",
    detail: "Sign up with email or Google so your notes, memory and calendar are saved to you.",
    cta: "Open account screen",
    to: "/auth",
  },
  {
    id: "openclaw",
    title: "Connect OpenClaw",
    detail: "The desktop bridge that lets JARVIS control Windows, files and the browser. Not connected yet.",
    cta: "Open integrations",
    to: "/integrations",
  },
  {
    id: "voice",
    title: "Connect voice",
    detail: "Give JARVIS a speaking voice and let it listen for wake words.",
    cta: "Open voice screen",
    to: "/voice",
  },
  {
    id: "google",
    title: "Connect Google",
    detail: "Calendar, Sheets, Drive and Gmail access for your calendar and automation agents.",
    cta: "Open integrations",
    to: "/integrations",
  },
  {
    id: "agents",
    title: "Configure agents",
    detail: "Decide what each agent is allowed to touch: web, files, Windows, calendar.",
    cta: "Open settings",
    to: "/settings",
  },
  {
    id: "test",
    title: "Test JARVIS",
    detail: "Run the full system check and see what is ready and what still needs setup.",
    cta: "Run system check",
    to: "/diagnostics",
  },
];

export const Route = createFileRoute("/onboarding")({
  head: () =>
    pageHead("Onboarding — JARVIS", "Six guided steps to bring your JARVIS command center fully online."),
  component: OnboardingPage,
});

function OnboardingPage() {
  const [done, setDone] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const progress = Math.round((done.length / STEPS.length) * 100);

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <div className="mx-auto max-w-5xl space-y-3">
      <header className="hud-panel flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <h1 className="font-display text-2xl tracking-[0.2em] text-crimson-bright text-glow">WELCOME TO JARVIS</h1>
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            SETUP SEQUENCE · {done.length} OF {STEPS.length} COMPLETE
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--crimson-deep), var(--crimson-bright))",
                boxShadow: "var(--glow-sm)",
              }}
            />
          </div>
          <div className="mt-1 text-right font-mono text-[10px] text-crimson-bright">{progress}%</div>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <Panel title="Setup Steps">
          <ol className="space-y-2">
            {STEPS.map((s, i) => {
              const complete = done.includes(s.id);
              return (
                <li
                  key={s.id}
                  className={cn(
                    "rounded-md border px-3 py-2.5 transition-all",
                    i === active ? "border-crimson bg-crimson/10 glow-border" : "border-panel-border/60",
                  )}
                >
                  <button onClick={() => setActive(i)} className="flex w-full items-start gap-3 text-left">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        borderColor: complete ? "var(--success)" : "var(--panel-border)",
                        color: complete ? "var(--success)" : "var(--crimson-bright)",
                      }}
                    >
                      {complete ? <Check className="size-3" /> : <span className="font-mono text-[9px]">{i + 1}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[12px] tracking-[0.12em] text-foreground">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{s.detail}</span>
                    </span>
                  </button>
                  {i === active && (
                    <div className="mt-2 flex flex-wrap gap-2 pl-8">
                      {s.to && (
                        <Link
                          to={s.to}
                          className="rounded-md border border-crimson bg-crimson/15 px-3 py-1.5 font-display text-[10px] tracking-[0.15em] text-crimson-bright"
                        >
                          {s.cta.toUpperCase()}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          toggle(s.id);
                          if (!complete && i < STEPS.length - 1) setActive(i + 1);
                        }}
                        className="rounded-md border border-panel-border px-3 py-1.5 text-[10px] text-muted-foreground hover:text-crimson-bright"
                      >
                        {complete ? "Mark as not done" : "Mark as done"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>

        <div className="space-y-3">
          <Panel title="Setup Status">
            <ul className="space-y-2 text-[11px]">
              {STEPS.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  {done.includes(s.id) ? (
                    <Check className="size-3.5" style={{ color: "var(--success)" }} />
                  ) : (
                    <Circle className="size-3.5 text-muted-foreground/50" />
                  )}
                  <span className={done.includes(s.id) ? "text-foreground" : "text-muted-foreground"}>{s.title}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[9px] leading-relaxed text-amber-hud">
              These steps are checklists only. Nothing is connected until you link each service yourself.
            </p>
          </Panel>

          <Panel title="What happens next">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Once OpenClaw, voice and Google are linked, JARVIS starts routing real work to the four rooms instead of
              the demo simulation.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-panel-border/60 px-2.5 py-2">
              <Loader2 className="size-3.5 animate-spin text-crimson-bright" />
              <span className="font-mono text-[10px] text-muted-foreground">Awaiting first connection…</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
