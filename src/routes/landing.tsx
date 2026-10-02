import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Brain,
  Check,
  Cpu,
  Hand,
  Mic,
  Monitor,
  Plug,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/landing")({
  head: () =>
    pageHead(
      "JARVIS — Your Personal AI. Always Working.",
      "JARVIS connects your AI agents, computer, tools, memory and automations into one intelligent command center.",
    ),
  component: LandingPage,
});

const FEATURES = [
  { icon: Bot, title: "Agent Town", text: "Watch five agents walk between four rooms as their work changes." },
  { icon: Cpu, title: "AI Core", text: "One master mind that thinks, plans, acts and reports back." },
  { icon: Mic, title: "Voice", text: "Speak naturally; JARVIS listens, answers and keeps the thread." },
  { icon: Monitor, title: "Computer Control", text: "Open apps, sort files and drive the browser once linked." },
  { icon: Brain, title: "Memory", text: "Remembers your preferences, projects and important details." },
  { icon: Workflow, title: "Automations", text: "Calendar, sheets, mail and workflows in one place." },
  { icon: Plug, title: "Integrations", text: "Connect the tools you already use, one switch each." },
  { icon: Shield, title: "Security", text: "Risky actions always ask you first, and everything is logged." },
];

const STEPS = [
  { n: "01", title: "Connect", text: "Link your computer, calendar and tools from one screen." },
  { n: "02", title: "Ask", text: "Type or speak what you want done, in plain language." },
  { n: "03", title: "Watch", text: "Agents move, work and report progress live in the town." },
  { n: "04", title: "Done", text: "Results land in your tasks, notes and activity log." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    tag: "Get started",
    features: ["1 agent", "100 AI requests / month", "Notes & memory", "Community support"],
  },
  {
    name: "Pro",
    price: "$19",
    tag: "Most popular",
    features: ["5 agents", "Unlimited chat", "Voice replies", "Computer control", "Priority support"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    tag: "For teams",
    features: ["Unlimited agents", "Team workspace", "Audit logs & roles", "Custom automations", "Dedicated support"],
  },
];

const FAQS = [
  { q: "Do I need to know how to code?", a: "No. Everything is set up with switches and simple screens." },
  { q: "Can JARVIS control my computer?", a: "Yes, once you link your computer. Until then it clearly says it is not connected." },
  { q: "Is my data private?", a: "Your notes, memory and activity stay in your own account." },
  { q: "Can I try it first?", a: "Yes, the free plan lets you explore the whole command center." },
];

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-panel-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <div
            className="flex size-8 items-center justify-center rounded-full border border-crimson font-display text-xs text-crimson-bright"
            style={{ boxShadow: "var(--glow-sm)" }}
          >
            J
          </div>
          <span className="font-display text-sm tracking-[0.3em] text-foreground glow-text">JARVIS</span>
          <nav className="ml-auto hidden items-center gap-5 font-mono text-[10px] tracking-widest text-muted-foreground md:flex">
            <a href="#features" className="hover:text-crimson-bright">FEATURES</a>
            <a href="#how" className="hover:text-crimson-bright">HOW IT WORKS</a>
            <a href="#pricing" className="hover:text-crimson-bright">PRICING</a>
            <a href="#faq" className="hover:text-crimson-bright">FAQ</a>
          </nav>
          <Link
            to="/"
            className="ml-auto rounded-md border border-crimson bg-crimson/20 px-4 py-1.5 font-display text-[10px] tracking-[0.2em] text-crimson-bright transition-all hover:bg-crimson/30 md:ml-4 glow-border"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden px-5 py-24 text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-0 size-[620px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, var(--crimson) 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-panel-border px-3 py-1 font-mono text-[9px] tracking-[0.25em] text-muted-foreground">
            <Sparkles className="size-3 text-crimson-bright" /> PERSONAL AI DESKTOP ASSISTANT
          </span>
          <h1 className="mt-6 font-display text-5xl leading-tight tracking-[0.06em] text-foreground glow-text sm:text-6xl">
            Your Personal AI.
            <br />
            Always Working.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            JARVIS connects your AI agents, computer, tools, memory and automations into one intelligent command center.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="rounded-md border border-crimson bg-crimson/25 px-6 py-2.5 font-display text-[11px] tracking-[0.2em] text-crimson-bright transition-all hover:bg-crimson/35 glow-border"
            >
              GET STARTED
            </Link>
            <Link
              to="/agent-town"
              className="rounded-md border border-panel-border px-6 py-2.5 font-display text-[11px] tracking-[0.2em] text-muted-foreground transition-all hover:border-crimson hover:text-foreground"
            >
              EXPLORE JARVIS
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-3">
            {[
              { k: "5", v: "AI agents" },
              { k: "4", v: "Work rooms" },
              { k: "14", v: "Control screens" },
            ].map((s) => (
              <div key={s.v} className="hud-panel px-3 py-3">
                <div className="font-display text-2xl text-crimson-bright glow-text">{s.k}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <Section id="features" title="FEATURES" heading="Everything in one command center">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="hud-panel px-4 py-4 transition-transform hover:-translate-y-1">
              <f.icon className="size-5 text-crimson-bright" />
              <div className="mt-3 font-display text-[12px] tracking-[0.16em] text-foreground">{f.title}</div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* how it works */}
      <Section id="how" title="HOW IT WORKS" heading="Four steps to a working assistant">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="hud-panel px-4 py-5">
              <div className="font-display text-3xl text-crimson/70">{s.n}</div>
              <div className="mt-2 font-display text-[12px] tracking-[0.16em] text-foreground">{s.title}</div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* agent town showcase */}
      <Section id="town" title="AGENT TOWN" heading="Your agents, visible at work">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="hud-panel space-y-3 px-5 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Four glowing rooms — Command Center, Research Lab, Computer Lab and Automation Room. Every agent walks to
              the room its task belongs to, carries a small bubble with what it is doing, and rests when the work is
              done.
            </p>
            <ul className="space-y-2">
              {["Live task bubbles above every agent", "Rooms light up while work runs", "Workload bars for each agent", "Full activity history"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2 text-[11px] text-foreground">
                    <Check className="size-3.5 text-success" /> {t}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="hud-panel grid grid-cols-2 gap-2 p-3">
            {["COMMAND CENTER", "RESEARCH LAB", "COMPUTER LAB", "AUTOMATION ROOM"].map((r, i) => (
              <div
                key={r}
                className="relative flex h-32 flex-col justify-end rounded-md border border-crimson/30 bg-secondary/40 p-3"
                style={{ boxShadow: "inset 0 0 30px rgba(220,20,60,0.12)" }}
              >
                <span
                  className="absolute right-2 top-2 size-1.5 rounded-full"
                  style={{ background: "var(--crimson-bright)", boxShadow: "0 0 10px var(--crimson-bright)" }}
                />
                <span className="font-display text-[10px] tracking-[0.18em] text-muted-foreground">{`0${i + 1}`}</span>
                <span className="font-display text-[11px] tracking-[0.14em] text-foreground">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* pricing */}
      <Section id="pricing" title="PRICING" heading="Start free, grow when you need to">
        <div className="grid gap-3 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn("hud-panel flex flex-col px-5 py-6", p.highlight && "glow-border border-crimson")}
            >
              <div className="font-mono text-[9px] tracking-[0.25em] text-crimson-bright">{p.tag.toUpperCase()}</div>
              <div className="mt-2 font-display text-lg tracking-[0.2em] text-foreground">{p.name}</div>
              <div className="mt-1 font-display text-4xl text-crimson-bright glow-text">
                {p.price}
                <span className="font-mono text-[10px] text-muted-foreground"> /mo</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Check className="size-3.5 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/"
                className={cn(
                  "mt-6 rounded-md border px-4 py-2 text-center font-display text-[10px] tracking-[0.2em] transition-all",
                  p.highlight
                    ? "border-crimson bg-crimson/25 text-crimson-bright hover:bg-crimson/35"
                    : "border-panel-border text-muted-foreground hover:border-crimson hover:text-foreground",
                )}
              >
                CHOOSE {p.name.toUpperCase()}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[9px] tracking-widest text-muted-foreground">
          PAYMENTS NOT CONNECTED YET — PLANS ARE SHOWN FOR PREVIEW
        </p>
      </Section>

      {/* faq */}
      <Section id="faq" title="FAQ" heading="Questions people ask">
        <div className="mx-auto max-w-2xl space-y-2">
          {FAQS.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="hud-panel w-full px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-foreground">{f.q}</span>
                <span className="font-mono text-crimson-bright">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{f.a}</p>}
            </button>
          ))}
        </div>
      </Section>

      {/* cta */}
      <section className="px-5 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Hand className="mx-auto size-6 text-crimson-bright" />
          <h2 className="mt-4 font-display text-3xl tracking-[0.08em] text-foreground glow-text">
            Ready to meet your AI?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Open the command center and watch your agents come online.
          </p>
          <Link
            to="/"
            className="mt-7 inline-block rounded-md border border-crimson bg-crimson/25 px-7 py-2.5 font-display text-[11px] tracking-[0.2em] text-crimson-bright transition-all hover:bg-crimson/35 glow-border"
          >
            GET STARTED
          </Link>
        </div>
      </section>

      <footer className="border-t border-panel-border/60 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span className="font-display text-[11px] tracking-[0.3em] text-muted-foreground">JARVIS</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            PERSONAL AI DESKTOP ASSISTANT
          </span>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  heading,
  children,
}: {
  id: string;
  title: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-panel-border/40 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="font-mono text-[9px] tracking-[0.3em] text-crimson-bright">{title}</div>
          <h2 className="mt-2 font-display text-2xl tracking-[0.06em] text-foreground">{heading}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
