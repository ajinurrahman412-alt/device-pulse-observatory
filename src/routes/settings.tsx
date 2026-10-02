import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings — JARVIS", "Tune the assistant's voice, confirmations, appearance and engine setup."),
  component: SettingsPage,
});

function Toggle({ label, hint, defaultOn }: { label: string; hint?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-3 border-b border-panel-border/30 py-2">
      <div>
        <div className="text-[12px] text-foreground">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "h-5 w-9 shrink-0 rounded-full border transition-colors",
          on ? "border-crimson bg-crimson/40" : "border-panel-border bg-secondary",
        )}
        aria-label={label}
      >
        <span
          className={cn(
            "block size-3.5 rounded-full bg-foreground transition-transform",
            on ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <Panel title="Assistant">
        <Toggle label="Wake word" hint="Respond to “Jarvis”" defaultOn />
        <Toggle label="Spoken replies" hint="Read answers out loud" defaultOn />
        <Toggle label="Proactive suggestions" hint="Offer next steps unprompted" />
      </Panel>
      <Panel title="Safety">
        <Toggle label="Confirm medium-risk actions" defaultOn />
        <Toggle label="Confirm high-risk actions" hint="Always recommended" defaultOn />
        <Toggle label="Allow shell commands" hint="Off until the desktop bridge is trusted" />
      </Panel>
      <Panel title="Appearance">
        <Toggle label="Scanline overlay" defaultOn />
        <Toggle label="Core animations" defaultOn />
        <Toggle label="Reduced motion" />
      </Panel>
      <Panel title="Gesture Control">
        <Toggle label="Camera gestures" hint="Needs a connected camera" />
        <Toggle label="Air tap to confirm" />
      </Panel>
      <Panel title="Engine">
        <ul className="space-y-1.5 text-[11px] text-muted-foreground">
          <li className="flex justify-between"><span>Agent engine</span><span>Local simulation</span></li>
          <li className="flex justify-between"><span>OpenClaw gateway</span><span>Not configured</span></li>
          <li className="flex justify-between"><span>Persistence</span><span>Session only</span></li>
        </ul>
        <p className="mt-2 font-mono text-[9px] text-amber-hud">
          Connection keys are held on the server and never shown in this interface.
        </p>
      </Panel>
      <Panel title="Account">
        <ul className="space-y-1.5 text-[11px] text-muted-foreground">
          <li className="flex justify-between"><span>Profile</span><span>Local operator</span></li>
          <li className="flex justify-between"><span>Sign-in</span><span>Not enabled yet</span></li>
        </ul>
      </Panel>
    </div>
  );
}
