import { createFileRoute } from "@tanstack/react-router";
import { AgentBar } from "@/components/jarvis/AgentBar";
import { AgentTown } from "@/components/jarvis/AgentTown";
import { AgentDetailPanel, ActivityPanel, WorkloadPanel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/agent-town")({
  head: () => pageHead("Agent Town — JARVIS", "Watch every AI agent move between the six rooms in real time."),
  component: AgentTownPage,
});

function AgentTownPage() {
  return (
    <div className="space-y-3">
      <AgentBar />
      <div className="grid gap-3 xl:grid-cols-[1fr_310px]">
        <AgentTown />
        <div className="space-y-3">
          <AgentDetailPanel />
          <WorkloadPanel />
          <ActivityPanel limit={10} />
        </div>
      </div>
    </div>
  );
}
