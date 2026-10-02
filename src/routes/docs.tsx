import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

interface Doc {
  id: string;
  title: string;
  summary: string;
  body: string[];
}

const DOCS: Doc[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    summary: "What JARVIS is and what works today.",
    body: [
      "JARVIS is your personal AI command center. The centre orb is the master mind; the four rooms around it are where your agents do their work.",
      "Right now the agent town runs on a realistic simulation so you can see exactly how everything behaves. Real actions begin once you connect the services below.",
      "Start with the Onboarding screen — it walks you through the six setup steps in order.",
    ],
  },
  {
    id: "openclaw",
    title: "OpenClaw Setup",
    summary: "The bridge that lets JARVIS use your computer.",
    body: [
      "OpenClaw is the desktop agent engine that runs on your Windows machine and carries out the actions JARVIS decides on.",
      "Install OpenClaw on your PC, start it, and paste its connection address into the Integrations screen.",
      "Until it is connected, every screen clearly shows OpenClaw Offline — JARVIS will never pretend an action ran.",
    ],
  },
  {
    id: "windows",
    title: "Windows Setup",
    summary: "Apps, files, browser and screen control.",
    body: [
      "Windows control covers opening apps, moving and sorting files, driving the browser and reading the screen.",
      "Each of those abilities is a separate permission you grant per agent, so the computer agent can touch files while the research agent cannot.",
      "Live CPU, memory and disk figures stay blank until the desktop bridge is linked.",
    ],
  },
  {
    id: "voice",
    title: "Voice Setup",
    summary: "Talking to JARVIS and hearing it reply.",
    body: [
      "Voice has two halves: listening (speech to text) and speaking (text to speech).",
      "Connect a voice service in Integrations, then set your wake word on the Profile screen.",
      "Until then the Voice screen shows a local-only preview with no microphone access.",
    ],
  },
  {
    id: "google",
    title: "Google Setup",
    summary: "Calendar, Sheets, Drive and Gmail.",
    body: [
      "Connecting Google lets the calendar agent read and create events, and the automation agent write rows to Sheets.",
      "You approve the exact scopes during sign-in, and you can revoke them at any time from the Security Center.",
      "Risky actions such as sending mail always ask you to confirm first.",
    ],
  },
  {
    id: "n8n",
    title: "n8n Setup",
    summary: "Running your own automation workflows.",
    body: [
      "n8n lets JARVIS trigger any workflow you have built — reports, scrapers, notifications, syncs.",
      "Paste your n8n instance URL and webhook key in Integrations, then each workflow appears as a skill the automation agent can run.",
    ],
  },
  {
    id: "agents",
    title: "Agents",
    summary: "Who does what in the town.",
    body: [
      "JARVIS orchestrates. ALICE researches. BOB handles the computer. CAROL manages calendar and schedule. DAVE runs automations.",
      "An agent walks to the room its current task belongs to, carries a small bubble with what it is doing, and rests when the work is done.",
      "Click any agent to open its detail card, see its workload and adjust its permissions.",
    ],
  },
  {
    id: "skills",
    title: "Skills",
    summary: "Individual abilities you can switch on and off.",
    body: [
      "A skill is one concrete ability — web search, file sort, calendar write, workflow run.",
      "Every skill shows its risk level and which services it needs. Skills that require a disconnected service cannot run.",
    ],
  },
  {
    id: "memory",
    title: "Memory",
    summary: "What JARVIS remembers about you.",
    body: [
      "Memory stores your preferences, projects and important facts so you do not repeat yourself.",
      "Each entry has a category, an importance level and a source. You can delete any entry at any time.",
      "Memory is saved to your account once you sign in.",
    ],
  },
  {
    id: "security",
    title: "Security",
    summary: "Confirmations, permissions and the audit log.",
    body: [
      "Risky actions — deleting files, sending mail, buying anything — always ask for explicit confirmation.",
      "Every tool call an agent makes is written to the audit log with its result and risk level.",
      "The emergency stop on your Profile screen halts all agents instantly.",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    summary: "When something does not behave.",
    body: [
      "Run Test JARVIS first — it tells you exactly which parts are passing and which still need setup.",
      "If an agent is stuck, open its card and cancel the running task, then re-queue it.",
      "If a service shows Not Connected, reconnect it from Integrations; nothing will run until it is green.",
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    summary: "Publishing and desktop readiness.",
    body: [
      "The web command center can be published at any time and used from any browser.",
      "The layout is built like a desktop application, so it can later be wrapped as a native Windows app with the same screens.",
    ],
  },
];

export const Route = createFileRoute("/docs")({
  head: () => pageHead("Documentation — JARVIS", "Beginner-friendly guides for setup, agents, skills, memory and security."),
  component: DocsPage,
});

function DocsPage() {
  const [activeId, setActiveId] = useState(DOCS[0]!.id);
  const doc = DOCS.find((d) => d.id === activeId) ?? DOCS[0]!;

  return (
    <div className="mx-auto max-w-6xl space-y-3">
      <header className="hud-panel p-4">
        <h1 className="font-display text-2xl tracking-[0.2em] text-crimson-bright text-glow">DOCUMENTATION</h1>
        <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          PLAIN-LANGUAGE GUIDES · {DOCS.length} ARTICLES
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[250px_1fr]">
        <Panel title="Contents">
          <nav className="space-y-0.5">
            {DOCS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={cn(
                  "block w-full rounded-md px-2.5 py-1.5 text-left text-[11px] transition-all",
                  d.id === activeId
                    ? "bg-crimson/20 text-crimson-bright glow-border"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {d.title}
              </button>
            ))}
          </nav>
        </Panel>

        <Panel title={doc.title}>
          <p className="font-mono text-[10px] tracking-[0.12em] text-crimson-bright">{doc.summary.toUpperCase()}</p>
          <div className="mt-3 space-y-3">
            {doc.body.map((p, i) => (
              <p key={i} className="text-[12px] leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
