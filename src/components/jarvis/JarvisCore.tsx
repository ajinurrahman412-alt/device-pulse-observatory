import { Mic, MicOff } from "lucide-react";
import { useJarvis } from "@/lib/jarvis/store";
import type { JarvisState } from "@/lib/jarvis/types";
import { cn } from "@/lib/utils";

const STATE_LINE: Record<JarvisState, string> = {
  IDLE: "How can I help you today?",
  LISTENING: "Listening...",
  THINKING: "Thinking...",
  PLANNING: "Planning next steps...",
  EXECUTING: "Executing task...",
  SPEAKING: "Speaking...",
  WAITING: "Waiting for confirmation...",
  ERROR: "Something failed. Review the task queue.",
  COMPLETED: "Task completed.",
};

export function JarvisCore({ size = "lg" }: { size?: "lg" | "sm" }) {
  const { jarvisState, voiceActive, toggleVoice, agents, tasks } = useJarvis();
  const active = jarvisState !== "IDLE";
  const working = tasks.filter((t) => t.status === "RUNNING").length;

  const dim = size === "lg" ? "h-[300px] w-[300px]" : "h-[170px] w-[170px]";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn("relative flex items-center justify-center", dim)}>
        {/* outer rings */}
        <div
          className="animate-ring-spin absolute inset-0 rounded-full border border-dashed"
            style={{ borderColor: "oklch(0.72 0.16 245 / 55%)" }}
        />
        <div
          className="animate-ring-spin-rev absolute inset-[10%] rounded-full border-2"
          style={{
            borderColor: "oklch(0.72 0.16 245 / 40%)",
            borderTopColor: "var(--core-blue)",
            boxShadow: "0 0 30px oklch(0.72 0.16 245 / 50%)",
          }}
        />
        <div
          className="animate-ring-spin absolute inset-[22%] rounded-full border"
          style={{
            borderColor: "oklch(0.72 0.16 245 / 42%)",
            borderRightColor: "var(--core-blue)",
          }}
        />
        {/* orb */}
        <div
          className={cn(
            "relative rounded-full",
            size === "lg" ? "h-[46%] w-[46%]" : "h-[48%] w-[48%]",
            active ? "animate-core-pulse" : "animate-float-soft",
          )}
          style={{ background: "var(--gradient-core)", boxShadow: "var(--glow-lg)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-[3px] items-end h-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-background/80"
                  style={{
                    height: active ? `${8 + ((i * 37) % 16)}px` : "6px",
                    animation: active ? `core-pulse ${0.7 + i * 0.15}s ease-in-out infinite` : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* status arc label */}
        <div className="absolute -bottom-1 rounded-full border border-cyan-hud/50 bg-background/90 px-3 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-hud">
          {jarvisState}
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-display text-3xl tracking-[0.2em] text-foreground drop-shadow-[0_0_14px_var(--core-blue)]">JARVIS 2.0</h2>
        <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
          THINK • PLAN • ACT • EXECUTE
        </p>
        <p className="mt-3 text-sm text-cyan-hud">{STATE_LINE[jarvisState]}</p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          {agents.filter((a) => a.status === "WORKING" || a.status === "THINKING").length} agents active ·{" "}
          {working} task{working === 1 ? "" : "s"} running
        </p>
      </div>

      <button
        onClick={toggleVoice}
        className={cn(
          "group flex items-center gap-2 rounded-full border px-5 py-2 font-display text-[11px] tracking-[0.2em] transition-all",
          voiceActive
            ? "border-crimson-bright bg-crimson/20 text-crimson-bright glow-border"
            : "border-panel-border text-muted-foreground hover:border-crimson hover:text-crimson-bright",
        )}
      >
        {voiceActive ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
        {voiceActive ? "STOP VOICE" : "START VOICE"}
      </button>
    </div>
  );
}
