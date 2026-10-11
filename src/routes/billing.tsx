import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

const USAGE = [
  { label: "AI tokens", used: 184_000, limit: 500_000, unit: "" },
  { label: "Voice minutes", used: 42, limit: 120, unit: " min" },
  { label: "Agent task runs", used: 268, limit: 1000, unit: "" },
  { label: "OpenClaw actions", used: 0, limit: 500, unit: "" },
  { label: "Automation runs", used: 57, limit: 300, unit: "" },
  { label: "Memory entries", used: 128, limit: 2000, unit: "" },
];

const PLANS = [
  { id: "basic", name: "Basic", price: "Setup Required", period: "1 / 6 / 12 months", features: ["JARVIS chat", "Six-room Agent Town", "Monthly credits", "Browser voice"] },
  { id: "pro", name: "Pro", price: "Setup Required", period: "1 / 6 / 12 months", features: ["All agents (Alice, Bob, Carol, Dave, Eve)", "OpenClaw desktop control", "Voice in / voice out", "More credits"], popular: true },
  { id: "premium", name: "Premium", price: "Setup Required", period: "1 / 6 / 12 months", features: ["Highest credits", "Priority agents", "Full integrations", "Priority support"] },
];

const INVOICES = [
  { id: "INV-0004", date: "01 Sep 2026", amount: "$0.00", status: "Free plan" },
  { id: "INV-0003", date: "01 Aug 2026", amount: "$0.00", status: "Free plan" },
  { id: "INV-0002", date: "01 Jul 2026", amount: "$0.00", status: "Free plan" },
];

export const Route = createFileRoute("/billing")({
  head: () => pageHead("Billing & Usage — JARVIS", "Track token, voice and agent usage and compare JARVIS plans."),
  component: BillingPage,
});

function BillingPage() {
  const [plan, setPlan] = useState("basic");

  return (
    <div className="mx-auto max-w-6xl space-y-3">
      <header className="hud-panel flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <h1 className="font-display text-2xl tracking-[0.2em] text-crimson-bright text-glow">BILLING & USAGE</h1>
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            CURRENT PLAN · BASIC · PRICES SET BY OWNER
          </p>
        </div>
        <span className="rounded-md border border-amber-hud/60 px-3 py-1.5 font-mono text-[9px] tracking-[0.15em] text-amber-hud">
          PAYMENTS NOT CONNECTED
        </span>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <Panel title="This Month's Usage">
            <div className="grid gap-3 sm:grid-cols-2">
              {USAGE.map((u) => {
                const pct = Math.round((u.used / u.limit) * 100);
                return (
                  <div key={u.label} className="rounded-md border border-panel-border/60 px-3 py-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-muted-foreground">{u.label}</span>
                      <span className="font-mono text-[10px] text-crimson-bright">{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            pct > 80
                              ? "var(--crimson-bright)"
                              : "linear-gradient(90deg, var(--crimson-deep), var(--crimson-bright))",
                          boxShadow: "var(--glow-sm)",
                        }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-[9px] text-muted-foreground">
                      {u.used.toLocaleString()}
                      {u.unit} of {u.limit.toLocaleString()}
                      {u.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Plans">
            <div className="grid gap-3 md:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "relative rounded-md border p-3",
                    plan === p.id ? "border-crimson bg-crimson/10 glow-border" : "border-panel-border/60",
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-2 right-3 rounded-sm border border-crimson bg-background px-1.5 py-0.5 font-mono text-[8px] tracking-[0.2em] text-crimson-bright">
                      POPULAR
                    </span>
                  )}
                  <div className="font-display text-[13px] tracking-[0.18em] text-foreground">{p.name}</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-2xl text-crimson-bright">{p.price}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{p.period}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <Check className="mt-0.5 size-3 shrink-0 text-crimson-bright" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setPlan(p.id);
                      toast.info("Payments are not connected yet — plan selection is a preview only.");
                    }}
                    className={cn(
                      "mt-3 w-full rounded-md border py-1.5 font-display text-[10px] tracking-[0.15em]",
                      plan === p.id
                        ? "border-crimson bg-crimson/20 text-crimson-bright"
                        : "border-panel-border text-muted-foreground hover:border-crimson hover:text-crimson-bright",
                    )}
                  >
                    {plan === p.id ? "CURRENT PLAN" : "SELECT"}
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Payment Method">
            <div className="rounded-md border border-dashed border-panel-border px-3 py-6 text-center">
              <div className="font-mono text-[10px] tracking-[0.15em] text-amber-hud">NO CARD ON FILE</div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                A payment provider has not been connected to this project yet.
              </p>
            </div>
          </Panel>

          <Panel title="Invoices">
            <ul className="space-y-1.5">
              {INVOICES.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between rounded-md border border-panel-border/50 px-2.5 py-1.5"
                >
                  <span className="font-mono text-[10px] text-crimson-bright">{i.id}</span>
                  <span className="text-[10px] text-muted-foreground">{i.date}</span>
                  <span className="text-[10px] text-foreground">{i.amount}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
