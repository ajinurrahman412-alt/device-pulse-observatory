import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import command from "@/assets/rooms/command.jpg";
import research from "@/assets/rooms/research.jpg";
import university from "@/assets/rooms/university.jpg";
import computer from "@/assets/rooms/computer.jpg";
import automation from "@/assets/rooms/automation.jpg";
import library from "@/assets/rooms/library.jpg";
import { ROOMS } from "@/lib/jarvis/data";
import type { RoomId } from "@/lib/jarvis/types";
import { cn } from "@/lib/utils";

export const ROOM_INTERIOR: Record<RoomId, { image: string; subtitle: string; equipment: string[] }> = {
  command: { image: command, subtitle: "Strategy & Coordination", equipment: ["6 tactical monitors", "Holographic tactical table", "Operator chair", "Control panels", "Command screens"] },
  research: { image: research, subtitle: "AI Research & Analysis", equipment: ["Holographic data displays", "Research desks", "Analysis computers", "Digital model viewer", "Lab workstations"] },
  university: { image: university, subtitle: "Learning & Education", equipment: ["Holographic digital board", "Professor lectern", "Student learning desks", "Educational screens", "Lecture stage"] },
  computer: { image: computer, subtitle: "System & Computer Control", equipment: ["Triple-monitor PC desks", "Server racks", "Control panels", "World map wall screen", "Keyboard & mouse stations"] },
  automation: { image: automation, subtitle: "Workflows & Scripts", equipment: ["Workflow node wall", "Script consoles", "Data pipeline holograms", "Live chart screens", "Automation desk"] },
  library: { image: library, subtitle: "Knowledge & Meetings", equipment: ["Large bookshelves", "Round meeting table + chairs", "Holographic globe", "Knowledge displays", "Reading lounge"] },
};

export function RoomInterior({ roomId }: { roomId: RoomId }) {
  const [open, setOpen] = useState(false);
  const room = ROOMS.find((r) => r.id === roomId)!;
  const data = ROOM_INTERIOR[roomId];
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group relative mt-3 block w-full overflow-hidden rounded border border-current/40" aria-label={`View ${room.name} in full HD`}>
        <img src={data.image} alt={`${room.name} interior`} width={1920} height={1088} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[9px] text-foreground">
          <Maximize2 className="size-3" /> HD VIEW
        </span>
      </button>
      <div className="mt-2 font-mono text-[10px] text-foreground">ROOM EQUIPMENT</div>
      <ul className="mt-1 flex flex-wrap gap-1">
        {data.equipment.map((e) => (
          <li key={e} className="rounded-sm border border-current/40 px-1.5 py-0.5 text-[10px]">{e}</li>
        ))}
      </ul>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={room.name} className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4" onClick={() => setOpen(false)}>
          <div className={cn("relative w-full max-w-6xl overflow-hidden rounded-lg border-2")} onClick={(e) => e.stopPropagation()}>
            <img src={data.image} alt={`${room.name} interior`} width={1920} height={1088} className="w-full" />
            <div className="absolute inset-x-0 bottom-0 bg-background/85 p-3">
              <div className="font-display text-sm tracking-widest text-foreground">{room.name.toUpperCase()} · <span className="text-muted-foreground">{data.subtitle}</span></div>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.equipment.map((e) => (
                  <span key={e} className="rounded-sm border border-panel-border px-1.5 py-0.5 text-[11px] text-foreground">{e}</span>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-2 top-2 rounded bg-background/80 p-1.5 text-foreground">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
