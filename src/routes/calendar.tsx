import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

const VIEWS = ["Day", "Week", "Month"] as const;
const HOURS = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const Route = createFileRoute("/calendar")({
  head: () => pageHead("Calendar — JARVIS", "Day, week and month views with events your calendar agent manages."),
  component: CalendarPage,
});

function CalendarPage() {
  const { events, addEvent, deleteEvent } = useJarvis();
  const [view, setView] = useState<(typeof VIEWS)[number]>("Day");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00 AM");

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
      <Panel
        title={`Calendar · ${view}`}
        action={
          <div className="flex gap-1">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded border px-2 py-0.5 font-mono text-[9px]",
                  view === v
                    ? "border-crimson text-crimson-bright"
                    : "border-panel-border text-muted-foreground hover:text-foreground",
                )}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        }
      >
        {view === "Day" && (
          <ul className="space-y-1">
            {HOURS.map((h) => {
              const ev = events.find((e) => e.time.startsWith(h.split(":")[0]!));
              return (
                <li key={h} className="flex items-center gap-3 border-b border-panel-border/30 py-1.5">
                  <span className="w-14 font-mono text-[10px] text-muted-foreground">{h}</span>
                  {ev ? (
                    <span className="flex-1 rounded-md border border-crimson/60 bg-crimson/15 px-2 py-1 text-[11px] text-foreground">
                      {ev.title} · {ev.durationMin}m
                    </span>
                  ) : (
                    <span className="flex-1 text-[10px] text-muted-foreground/40">free</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {view === "Week" && (
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => (
              <div key={d} className="rounded-md border border-panel-border/50 p-2">
                <div className="hud-title mb-1">{d}</div>
                {events
                  .filter((_, idx) => idx % 7 === i % 7)
                  .map((e) => (
                    <div key={e.id} className="mb-1 rounded bg-crimson/15 px-1 py-0.5 text-[9px]">
                      {e.time} {e.title}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

        {view === "Month" && (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded border border-panel-border/40 p-1 text-[9px] text-muted-foreground"
              >
                <span>{i + 1 <= 30 ? i + 1 : ""}</span>
                {i === 12 && <div className="mt-0.5 h-1 rounded-full bg-crimson-bright" />}
                {i === 18 && <div className="mt-0.5 h-1 rounded-full bg-amber-hud" />}
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="space-y-3">
        <Panel title="Create Event">
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM"
              className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={() => {
                if (!title.trim()) return;
                addEvent({ title, time, durationMin: 30, tag: "Work" });
                setTitle("");
              }}
              className="w-full rounded-md border border-crimson bg-crimson/20 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright glow-border"
            >
              ADD EVENT
            </button>
            <p className="font-mono text-[9px] text-amber-hud">Google Calendar sync activates once it's connected.</p>
          </div>
        </Panel>
        <Panel title="Events">
          <ul className="space-y-1.5">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-[11px]">
                <span className="w-16 font-mono text-[10px] text-crimson-bright">{e.time}</span>
                <span className="flex-1 truncate">{e.title}</span>
                <button onClick={() => deleteEvent(e.id)} aria-label="Delete event" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
