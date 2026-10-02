import { createFileRoute } from "@tanstack/react-router";
import { Hand, Pointer, ThumbsUp, Camera, Move, Grab } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gesture")({
  head: () =>
    pageHead(
      "Gesture Control — JARVIS",
      "Preview of the hand-gesture command layer for controlling JARVIS without touching a keyboard.",
    ),
  component: GesturePage,
});

const GESTURES = [
  { id: "palm", icon: Hand, name: "Open Palm", command: "Pause everything", detail: "Freezes all running agent work." },
  { id: "point", icon: Pointer, name: "Point", command: "Select", detail: "Picks the highlighted agent or task." },
  { id: "thumb", icon: ThumbsUp, name: "Thumbs Up", command: "Confirm", detail: "Approves a waiting confirmation." },
  { id: "swipe", icon: Move, name: "Swipe", command: "Switch room", detail: "Moves the view between town rooms." },
  { id: "grab", icon: Grab, name: "Grab", command: "Drag task", detail: "Reassigns a task to another agent." },
];

function GesturePage() {
  const [selected, setSelected] = useState("palm");
  const active = GESTURES.find((g) => g.id === selected)!;

  return (
    <div className="space-y-3">
      <div className="hud-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="font-display text-sm tracking-[0.3em] text-crimson-bright glow-text">GESTURE CONTROL</div>
          <div className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">
            HAND COMMAND LAYER · PREVIEW
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-amber-hud/50 px-3 py-1.5">
          <Camera className="size-3.5 text-amber-hud" />
          <span className="font-mono text-[10px] tracking-widest text-amber-hud">CAMERA NOT CONNECTED</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <Panel title="Camera Preview">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md border border-panel-border/70 bg-black">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(var(--panel-border) 1px, transparent 1px), linear-gradient(90deg, var(--panel-border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute left-4 top-4 font-mono text-[9px] tracking-widest text-muted-foreground">
              CAM 01 · OFFLINE
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div
                className="flex size-24 items-center justify-center rounded-full border border-crimson/60"
                style={{ boxShadow: "var(--glow-sm)" }}
              >
                <active.icon className="size-10 text-crimson-bright" />
              </div>
              <div className="font-display text-lg tracking-[0.2em] text-foreground glow-text">{active.name}</div>
              <div className="font-mono text-[10px] tracking-widest text-crimson-bright">
                → {active.command.toUpperCase()}
              </div>
              <p className="max-w-xs text-[11px] text-muted-foreground">{active.detail}</p>
            </div>
            <div className="absolute bottom-4 font-mono text-[9px] tracking-widest text-muted-foreground">
              NO LIVE CAMERA — SHOWING EXAMPLE ONLY
            </div>
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel title="Gesture Commands">
            <div className="space-y-1.5">
              {GESTURES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelected(g.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-all",
                    g.id === selected
                      ? "border-crimson bg-crimson/15 text-crimson-bright glow-border"
                      : "border-panel-border/50 text-muted-foreground hover:border-crimson/60 hover:text-foreground",
                  )}
                >
                  <g.icon className="size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[11px] tracking-[0.16em]">{g.name}</div>
                    <div className="truncate font-mono text-[9px] text-muted-foreground">{g.command}</div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Status">
            <ul className="space-y-1.5 font-mono text-[10px] tracking-wide text-muted-foreground">
              <li className="flex justify-between">
                <span>CAMERA</span>
                <span className="text-amber-hud">NOT CONNECTED</span>
              </li>
              <li className="flex justify-between">
                <span>HAND TRACKING</span>
                <span className="text-amber-hud">NOT CONNECTED</span>
              </li>
              <li className="flex justify-between">
                <span>COMMAND MAP</span>
                <span className="text-success">READY</span>
              </li>
            </ul>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              The gesture screen is designed and ready. Real hand tracking starts working once a camera is linked.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
