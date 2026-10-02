import { createFileRoute } from "@tanstack/react-router";
import { Pin, Trash2 } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { timeAgo, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes")({
  head: () => pageHead("Notes — JARVIS", "Capture, pin, tag and search your notes inside the command center."),
  component: NotesPage,
});

function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useJarvis();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");

  const list = [...notes]
    .filter((n) => (n.title + n.body).toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
      <Panel title="New Note" className="h-fit">
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Write something..."
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => {
              if (!title.trim()) return;
              addNote({ title, body, tags: [] });
              setTitle("");
              setBody("");
            }}
            className="w-full rounded-md border border-crimson bg-crimson/20 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright glow-border"
          >
            SAVE NOTE
          </button>
        </div>
      </Panel>

      <div className="space-y-3">
        <Panel title="Search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
        </Panel>
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((n) => (
            <Panel
              key={n.id}
              title={n.title}
              action={
                <div className="flex gap-1">
                  <button
                    onClick={() => updateNote(n.id, { pinned: !n.pinned })}
                    aria-label="Pin note"
                    className={cn("hover:text-crimson-bright", n.pinned ? "text-crimson-bright" : "text-muted-foreground")}
                  >
                    <Pin className="size-3.5" />
                  </button>
                  <button
                    onClick={() => deleteNote(n.id)}
                    aria-label="Delete note"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              }
            >
              <p className="text-[12px] text-muted-foreground">{n.body}</p>
              <div className="mt-2 flex items-center gap-1">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-sm border border-panel-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    #{t}
                  </span>
                ))}
                <span className="ml-auto font-mono text-[9px] text-muted-foreground/70">{timeAgo(n.ts)}</span>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
