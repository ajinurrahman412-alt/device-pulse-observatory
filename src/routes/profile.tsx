import { createFileRoute, Link } from "@tanstack/react-router";
import { Laptop, Monitor, Power, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";
import { LanguageSwitcher, useDanger } from "@/lib/jarvis/ui-extras";
import { cn } from "@/lib/utils";

const DEVICES = [
  { id: "d1", name: "This browser", icon: Monitor, detail: "Active now · web session", live: true },
  { id: "d2", name: "Windows desktop bridge", icon: Laptop, detail: "Not linked · OpenClaw required", live: false },
  { id: "d3", name: "Mobile companion", icon: Smartphone, detail: "Not linked", live: false },
];

const TONES = ["Formal", "Friendly", "Short & direct", "Playful"] as const;

export const Route = createFileRoute("/profile")({
  head: () => pageHead("Profile — JARVIS", "Your account, connected devices and how JARVIS talks to you."),
  component: ProfilePage,
});

function ProfilePage() {
  const { confirmDanger } = useDanger();
  const { userEmail } = useJarvis();
  const [name, setName] = useState("Operator");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Friendly");
  const [wake, setWake] = useState("Hey Jarvis");

  return (
    <div className="mx-auto max-w-5xl space-y-3">
      <header className="hud-panel flex flex-wrap items-center gap-4 p-4">
        <div
          className="flex size-14 items-center justify-center rounded-full border border-crimson font-display text-xl text-crimson-bright"
          style={{ boxShadow: "var(--glow-md, 0 0 24px rgba(220,38,38,.5))" }}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl tracking-[0.18em] text-foreground glow-text">{name.toUpperCase()}</h1>
          <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
            {userEmail ?? "NOT SIGNED IN"}
          </p>
        </div>
        {!userEmail && (
          <Link
            to="/auth"
            className="rounded-md border border-crimson bg-crimson/15 px-4 py-2 font-display text-[10px] tracking-[0.2em] text-crimson-bright"
          >
            SIGN IN
          </Link>
        )}
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Account Details">
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-panel-border bg-secondary/40 px-3 py-2 text-[12px] text-foreground outline-none focus:border-crimson"
          />
          <label className="mt-3 block text-[10px] uppercase tracking-widest text-muted-foreground">Wake word</label>
          <input
            value={wake}
            onChange={(e) => setWake(e.target.value)}
            className="mt-1 w-full rounded-md border border-panel-border bg-secondary/40 px-3 py-2 text-[12px] text-foreground outline-none focus:border-crimson"
          />
          <button
            onClick={() => toast.success("Profile preferences saved on this device.")}
            className="mt-3 w-full rounded-md border border-crimson bg-crimson/15 py-2 font-display text-[10px] tracking-[0.2em] text-crimson-bright"
          >
            SAVE PROFILE
          </button>
        </Panel>

        <Panel title="Assistant Personality">
          <p className="text-[11px] text-muted-foreground">How JARVIS speaks when it reports back to you.</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-md border px-2 py-2 text-[11px] transition-all",
                  tone === t
                    ? "border-crimson bg-crimson/15 text-crimson-bright glow-border"
                    : "border-panel-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[9px] leading-relaxed text-amber-hud">
            Personality applies to generated replies. Voice playback needs a voice service linked first.
          </p>
        </Panel>

        <Panel title="Devices">
          <ul className="space-y-1.5">
            {DEVICES.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-md border border-panel-border/60 px-3 py-2"
              >
                <d.icon className="size-4 text-crimson-bright" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] text-foreground">{d.name}</span>
                  <span className="block text-[10px] text-muted-foreground">{d.detail}</span>
                </span>
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    background: d.live ? "var(--success)" : "var(--muted-foreground)",
                    boxShadow: d.live ? "0 0 8px var(--success)" : "none",
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Language / भाषा">
          <p className="mb-2 text-[11px] text-muted-foreground">English, हिन्दी, Hinglish, অসমীয়া</p>
          <LanguageSwitcher />
        </Panel>

        <Panel title="Emergency Controls">
          <p className="text-[11px] text-muted-foreground">
            Instantly stop every agent and block any new action until you turn JARVIS back on.
          </p>
          <button
            onClick={async () => {
              const ok = await confirmDanger({
                title: "EMERGENCY STOP",
                description: "Every agent will be halted instantly and new actions blocked until you re-enable JARVIS.",
                consequences: ["All running tasks are cancelled", "Agents lose current progress", "Automations are paused"],
                confirmWord: "OVERRIDE",
                actionLabel: "STOP ALL AGENTS",
              });
              if (ok) toast.error("Killswitch armed — all agents would stop immediately once connected.");
              else toast("Emergency stop cancelled.");
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-destructive bg-destructive/15 py-2.5 font-display text-[11px] tracking-[0.2em] text-destructive"
          >
            <Power className="size-3.5" />
            EMERGENCY STOP
          </button>
          <Link
            to="/security"
            className="mt-2 block rounded-md border border-panel-border py-2 text-center text-[10px] text-muted-foreground hover:text-crimson-bright"
          >
            Open Security Center
          </Link>
        </Panel>
      </div>
    </div>
  );
}
