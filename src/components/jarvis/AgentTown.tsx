import townImage from "@/assets/agent-town-six.jpg";
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

  return (
    <button
      type="button"
      aria-label={`${agent.name}, ${agent.status}`}
      onClick={() => setSelectedAgentId(selected ? null : agent.id)}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000 ease-linear"
      style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
    >
      <span className="mx-auto mb-1 block max-w-28 truncate rounded-sm border border-panel-border bg-background/90 px-2 py-0.5 font-mono text-[9px] text-foreground shadow-lg">
        {bubble}
      </span>
      <span
        className={cn(
          "relative mx-auto flex size-8 items-center justify-center rounded-full border bg-background/90 font-display text-[11px] transition-transform",
          selected && "scale-110",
        )}
        style={{ borderColor: agent.color, color: agent.color, boxShadow: `0 0 16px ${agent.color}` }}
      >
        {agent.avatar}
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full" style={{ background: statusColor[agent.status] }} />
      </span>
      <span className="mt-0.5 block font-mono text-[8px] text-foreground drop-shadow">{agent.name}</span>
    </button>
  );
}

export { toneClasses as ROOM_TONE_CLASSES };

export function AgentTown({ showCore = true, selectedRoom, onSelectRoom }: { showCore?: boolean; selectedRoom?: Room["id"] | null; onSelectRoom?: (id: Room["id"]) => void }) {
  const { agents } = useJarvis();

  return (
    <div className="hud-panel scanlines relative aspect-[4/3] w-full overflow-hidden">
      <img
        src={townImage}
        alt="Isometric six-room AJINUR2.0 agent headquarters surrounding a central AI platform"
        width={1536}
        height={1152}
        fetchPriority="high"
        className="absolute inset-0 size-full object-fill"
      />
      <div className="absolute inset-0 bg-background/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/30" />

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
          <div className="pointer-events-auto scale-[0.8] rounded-full bg-background/55 p-2 backdrop-blur-sm sm:scale-[0.9] xl:scale-100">
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