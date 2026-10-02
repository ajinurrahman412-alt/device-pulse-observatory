import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Crown, User } from "lucide-react";
import { ROOMS } from "@/lib/jarvis/data";
import { useJarvis } from "@/lib/jarvis/store";
import type { RoomId } from "@/lib/jarvis/types";
import { cn } from "@/lib/utils";
import { AgentBar } from "./AgentBar";
import { AgentTown, ROOM_TONE_CLASSES } from "./AgentTown";
import { ActivityPanel, AgentDetailPanel } from "./Panels";

type Mode = "owner" | "user";

function RoomPanel({ roomId }: { roomId: RoomId }) {
  const { agents, tasks } = useJarvis();
  const room = ROOMS.find((r) => r.id === roomId)!;
  const present = agents.filter((a) => a.currentRoom === roomId);
  const roomTasks = tasks.filter((t) => t.room === roomId);
  return (
    <div className={cn("hud-panel border p-4", ROOM_TONE_CLASSES[room.tone])}>
      <div className="font-display text-sm tracking-widest">{room.name.toUpperCase()}</div>
      <p className="mt-1 text-xs text-muted-foreground">{room.purpose}</p>
      <div className="mt-3 font-mono text-[10px] text-foreground">AGENTS PRESENT · {present.length}</div>
      <ul className="mt-1 space-y-1 text-xs text-foreground">
        {present.length === 0 && <li className="text-muted-foreground">Nobody here right now.</li>}
        {present.map((a) => (
          <li key={a.id}>{a.name} — <span className="text-muted-foreground">{a.status}</span></li>
        ))}
      </ul>
      <div className="mt-3 font-mono text-[10px] text-foreground">TASKS · {roomTasks.length}</div>
      <ul className="mt-1 space-y-1 text-xs text-foreground">
        {roomTasks.length === 0 && <li className="text-muted-foreground">No tasks in this room.</li>}
        {roomTasks.slice(0, 5).map((t) => (
          <li key={t.id} className="truncate">{t.title} — <span className="text-muted-foreground">{t.status}</span></li>
        ))}
      </ul>
    </div>
  );
}

export function HomeDashboard() {
  const { userRole, userEmail } = useJarvis();
  const isOwner = userRole === "owner";
  const [preview, setPreview] = useState<Mode>("owner");
  // Only the verified Owner can switch views; everyone else always sees the User view.
  const mode: Mode = isOwner ? preview : "user";
  const setMode = setPreview;
  const [room, setRoom] = useState<RoomId | null>("command");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl tracking-[0.2em] text-foreground">AJINUR2.0</h1>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">YOUR PERSONAL AI ASSISTANT</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        {isOwner ? (
          <span className="flex items-center gap-1 rounded border border-amber-hud/60 bg-amber-hud/15 px-2 py-1 font-display text-[10px] tracking-widest text-amber-hud">
            <Crown className="size-3.5" /> KING · Ajinur2.0
          </span>
        ) : userEmail ? (
          <span className="rounded border border-cyan-hud/50 px-2 py-1 font-mono text-[10px] text-cyan-hud">{userRole?.toUpperCase() ?? "…"} · {userEmail}</span>
        ) : (
          <Link to="/auth" className="rounded border border-cyan-hud/50 px-2 py-1 font-mono text-[10px] text-cyan-hud">SIGN IN</Link>
        )}
        {isOwner && (
        <div role="tablist" aria-label="Dashboard view" className="flex rounded border border-panel-border bg-background/80 p-1">
          <button
            role="tab"
            aria-selected={mode === "owner"}
            onClick={() => setMode("owner")}
            className={cn("flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-[11px]", mode === "owner" ? "bg-amber-hud/20 text-amber-hud" : "text-muted-foreground")}
          >
            <Crown className="size-3.5" /> OWNER
          </button>
          <button
            role="tab"
            aria-selected={mode === "user"}
            onClick={() => setMode("user")}
            className={cn("flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-[11px]", mode === "user" ? "bg-cyan-hud/20 text-cyan-hud" : "text-muted-foreground")}
          >
            <User className="size-3.5" /> USER PREVIEW
          </button>
        </div>
        )}
        </div>
      </div>

      <AgentBar />

      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        <AgentTown selectedRoom={room} onSelectRoom={setRoom} />
        <div className="space-y-3">
          {room && <RoomPanel roomId={room} />}
          {mode === "owner" ? <AgentDetailPanel /> : null}
          <ActivityPanel limit={mode === "owner" ? 8 : 4} />
        </div>
      </div>
    </div>
  );
}
