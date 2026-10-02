import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { timeAgo, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

const CATEGORIES = [
  "User Preferences",
  "Conversations",
  "Tasks",
  "Projects",
  "Important Information",
  "Long-Term Memory",
];

export const Route = createFileRoute("/memory")({
  head: () => pageHead("Memory — JARVIS", "Everything JARVIS remembers about you, searchable and editable."),
  component: MemoryPage,
});

function MemoryPage() {
  const { memories, addMemory, deleteMemory } = useJarvis();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0] ?? "User Preferences");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filtered = memories.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <Panel title="Search Memory">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything JARVIS remembers..."
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
        </Panel>

        {CATEGORIES.map((cat) => {
          const items = filtered.filter((m) => m.category === cat);
          if (items.length === 0) return null;
          return (
            <Panel key={cat} title={cat}>
              <ul className="space-y-2">
                {items.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start gap-3 rounded-md border border-panel-border/50 p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] text-foreground">{m.title}</div>
                      <p className="text-[11px] text-muted-foreground">{m.content}</p>
                      <div className="mt-1 font-mono text-[9px] text-muted-foreground/70">
                        {m.importance} · {m.source} · {timeAgo(m.ts)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>

      <Panel title="Add Memory" className="h-fit">
        <div className="space-y-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-panel-border bg-background/60 px-2 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What should JARVIS remember?"
            rows={4}
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => {
              if (!title.trim()) return;
              addMemory({ category, title, content, importance: "MEDIUM", source: "Manual" });
              setTitle("");
              setContent("");
            }}
            className="w-full rounded-md border border-crimson bg-crimson/20 py-2 font-display text-[11px] tracking-[0.2em] text-crimson-bright glow-border"
          >
            SAVE MEMORY
          </button>
          <p className="font-mono text-[9px] text-amber-hud">
            Memories live in this session only until the cloud database is switched on.
          </p>
        </div>
      </Panel>
    </div>
  );
}
