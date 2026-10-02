import { statusColor, useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

export function AgentBar() {
  const { agents, tasks, selectedAgentId, setSelectedAgentId } = useJarvis();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
      {agents.map((agent) => {
        const task = tasks.find((t) => t.id === agent.currentTaskId);
        const selected = selectedAgentId === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentId(selected ? null : agent.id)}
            className={cn(
              "hud-panel group flex items-center gap-3 px-3 py-2 text-left transition-all hover:-translate-y-0.5",
              selected && "glow-border",
            )}
            style={selected ? { borderColor: agent.color } : undefined}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border font-display text-xs"
              style={{ borderColor: agent.color, color: agent.color, boxShadow: `0 0 14px ${agent.color}` }}
            >
              {agent.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[11px] tracking-[0.18em] text-foreground">{agent.name}</div>
              <div className="truncate text-[10px] text-muted-foreground">{agent.role}</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full" style={{ background: statusColor[agent.status] }} />
                <span className="truncate font-mono text-[9px] text-muted-foreground">
                  {task ? task.title : agent.status}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
