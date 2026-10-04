import { useEffect, useRef, useState } from "react";
import { AGENT_AVATARS, AGENT_WALK_AVATARS } from "@/lib/jarvis/avatars";
import townImage from "@/assets/agent-town-8k.jpg";
import { ROOMS, ROOM_ANCHOR } from "@/lib/jarvis/data";
import { statusColor, useJarvis } from "@/lib/jarvis/store";
import type { Agent, Room } from "@/lib/jarvis/types";
import { cn } from "@/lib/utils";
import { JarvisCore } from "./JarvisCore";

const toneClasses: Record<Room["tone"], string> = {
  crimson: "border-crimson-bright/80 text-crimson-bright",
  cyan: "border-cyan-hud/80 text-cyan-hud",
  violet: "border-violet-400/80 text-violet-300",
  emerald: "border-success/80 text-success",
  magenta: "border-fuchsia-400/80 text-fuchsia-300",
  amber: "border-amber-hud/80 text-amber-hud",
};

function AgentSprite({ agent }: { agent: Agent }) {
  const { tasks, setSelectedAgentId, selectedAgentId } = useJarvis();
  const task = tasks.find((item) => item.id === agent.currentTaskId);
  const bubble = task?.title ?? (agent.status === "RESTING" ? "RESTING" : "Standing by");
  const selected = selectedAgentId === agent.id;
  const prev = useRef({ x: agent.x, y: agent.y });
  const [walking, setWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  useEffect(() => {
    const dx = agent.x - prev.current.x;
    const dy = agent.y - prev.current.y;
    prev.current = { x: agent.x, y: agent.y };
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return;
    if (Math.abs(dx) >= 0.05) setFacingLeft(dx < 0);
    setWalking(true);
    const t = window.setTimeout(() => setWalking(false), 1150);
    return () => window.clearTimeout(t);
  }, [agent.x, agent.y]);
  const walkSrc = AGENT_WALK_AVATARS[agent.id];
  const isWalking = walking && !!walkSrc;

  return (
    <button
      type="button"
      aria-label={`${agent.name}, ${agent.status}`}
      onClick={() => setSelectedAgentId(selected ? null : agent.id)}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000 ease-linear"
      style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
    >
      {task ? (
        <span
          className="mx-auto mb-1 block w-24 animate-fade-in rounded-md border bg-background/90 px-1.5 py-1 text-left shadow-lg sm:w-32"
          style={{ borderColor: agent.color, boxShadow: `0 0 10px ${agent.color}` }}
        >
          <span className="flex items-center justify-between gap-1 font-display text-[8px] tracking-widest" style={{ color: agent.color }}>
            <span className="truncate">{agent.name.toUpperCase()}</span>
            <span className="shrink-0 font-mono">{Math.round(task.progress)}%</span>
          </span>
          <span className="block truncate font-mono text-[8px] text-foreground sm:text-[9px]">{task.title}</span>
          <span className="mt-0.5 block h-0.5 overflow-hidden rounded bg-muted">
            <span className="block h-full transition-all duration-700" style={{ width: `${task.progress}%`, background: agent.color }} />
          </span>
          <span className="mt-0.5 hidden font-mono text-[7px] text-muted-foreground sm:block">{task.status}</span>
        </span>
      ) : (
        <span className="mx-auto mb-1 block max-w-28 truncate rounded-sm border border-panel-border bg-background/90 px-2 py-0.5 font-mono text-[9px] text-foreground shadow-lg">
          {bubble}
        </span>
      )}
      <span className={cn("relative mx-auto block w-fit", agent.status !== "OFFLINE" && !isWalking && "agent-bob")}>
        {agent.status === "THINKING" && (
          <span className="absolute -right-3 -top-2 flex gap-0.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="agent-think size-1 rounded-full" style={{ background: agent.color, animationDelay: `${i * 0.2}s` }} />
            ))}
          </span>
        )}
        {isWalking ? (
          <span className={cn("relative mx-auto block w-9 sm:w-12 2xl:w-14", selected && "scale-110")}>
            <span className="agent-walk block">
              <img
                src={walkSrc}
                alt={`${agent.name} walking`}
                width={1024}
                height={1024}
                className="block h-auto w-full transition-transform duration-200"
                style={{ transform: facingLeft ? "scaleX(-1)" : undefined, filter: `drop-shadow(0 0 6px ${agent.color}) drop-shadow(0 4px 4px rgb(0 0 0 / .6))` }}
              />
            </span>
            <span className="agent-footstep absolute bottom-0 left-1/2 h-1.5 w-8 rounded-full border" style={{ borderColor: agent.color }} aria-hidden />
          </span>
        ) : AGENT_AVATARS[agent.id] ? (
          <span className={cn("relative mx-auto block w-12 transition-transform sm:w-16 2xl:w-20", selected && "scale-110")}>
            <img
              src={AGENT_AVATARS[agent.id]}
              alt={`${agent.name} seated at workstation`}
              width={1024}
              height={1024}
              loading="lazy"
              className="block h-auto w-full"
              style={{ filter: `drop-shadow(0 0 6px ${agent.color}) drop-shadow(0 4px 4px rgb(0 0 0 / .6))` }}
            />
            <span className="absolute right-1 top-1 size-2 rounded-full ring-1 ring-background" style={{ background: statusColor[agent.status] }} />
          </span>
        ) : (
          <span
            className={cn("relative mx-auto flex size-8 items-center justify-center rounded-full border bg-background/90 font-display text-[11px]", selected && "scale-110")}
            style={{ borderColor: agent.color, color: agent.color, boxShadow: `0 0 16px ${agent.color}` }}
          >
            {agent.avatar}
            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full" style={{ background: statusColor[agent.status] }} />
          </span>
        )}
        {agent.status === "WORKING" && !isWalking && (
          <span className="mx-auto mt-0.5 flex w-8 flex-col items-center" aria-hidden>
            <span className="agent-screen h-1 w-6 rounded-sm" style={{ background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
            <span className="flex gap-1">
              <span className="agent-type mt-px h-0.5 w-1.5 rounded-full bg-foreground/80" />
              <span className="agent-type mt-px h-0.5 w-1.5 rounded-full bg-foreground/80" style={{ animationDelay: ".17s" }} />
            </span>
          </span>
        )}
      </span>
      <span className="mt-0.5 block font-mono text-[8px] text-foreground drop-shadow">{agent.name}</span>
    </button>
  );
}

export { toneClasses as ROOM_TONE_CLASSES };

export function AgentTown({ showCore = true, selectedRoom, onSelectRoom }: { showCore?: boolean; selectedRoom?: Room["id"] | null; onSelectRoom?: (id: Room["id"]) => void }) {
  const { agents } = useJarvis();

  return (
    <div className="hud-panel hud-crisp relative aspect-[4/3] w-full overflow-hidden">
      <img
        src={townImage}
        alt="Isometric six-room AJINUR2.0 agent headquarters surrounding a central AI platform"
        width={1536}
        height={1152}
        fetchPriority="high"
        decoding="async"
        className="town-hd absolute inset-0 size-full object-fill"
      />

      {ROOMS.map((room) => {
        const position = ROOM_ANCHOR[room.id];
        return (
          <button
            type="button"
            key={room.id}
            aria-label={`Open ${room.name}`}
            aria-pressed={selectedRoom === room.id}
            onClick={() => onSelectRoom?.(room.id)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <div className={cn("rounded border bg-background/85 px-2 py-1 text-center shadow-lg backdrop-blur-sm transition-transform hover:scale-105 sm:px-3", toneClasses[room.tone], selectedRoom === room.id && "scale-110 border-2 shadow-[0_0_18px_currentColor]")}>
              <div className="font-display text-[8px] leading-tight sm:text-[10px]">{room.name}</div>
              <div className="hidden font-mono text-[8px] text-foreground/80 sm:block">{agents.filter((agent) => agent.currentRoom === room.id).length} PRESENT</div>
            </div>
          </button>
        );
      })}

      {showCore && (
        <div className="pointer-events-none absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto scale-[0.8] sm:scale-[0.9] xl:scale-100">
            <JarvisCore size="sm" />
          </div>
        </div>
      )}

      {agents.filter((agent) => agent.id !== "jarvis").map((agent) => (
        <AgentSprite key={agent.id} agent={agent} />
      ))}
      <div className="absolute bottom-2 left-3 z-10 rounded border border-cyan-hud/40 bg-background/80 px-2 py-1 font-mono text-[8px] tracking-widest text-cyan-hud sm:bottom-3 sm:left-4">
        AJINUR2.0 · AGENT TOWN · 6 ZONES
      </div>
    </div>
  );
}