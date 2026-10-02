import { createFileRoute } from "@tanstack/react-router";
import { File, FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/jarvis/Panels";
import { useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/files")({
  head: () => pageHead("Files — JARVIS", "Browse, search and manage files your computer agent can reach."),
  component: FilesPage,
});

function FilesPage() {
  const { files } = useJarvis();
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const folders = [...new Set(files.map((f) => f.folder))];
  const list = files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
      <Panel title="Folders" className="h-fit">
        <ul className="space-y-1">
          {folders.map((f) => (
            <li key={f} className="flex items-center gap-2 rounded px-2 py-1.5 text-[12px] text-muted-foreground hover:bg-secondary/50">
              <FolderOpen className="size-3.5 text-crimson-bright" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[9px] text-amber-hud">
          Windows Control: Not Connected — this listing is demo data.
        </p>
      </Panel>

      <div className="space-y-3">
        <Panel title="Search Files">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm outline-none"
          />
        </Panel>
        <Panel title="Recent Files">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal">Type</th>
                <th className="pb-2 font-normal">Size</th>
                <th className="pb-2 font-normal">Modified</th>
                <th className="pb-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-t border-panel-border/40">
                  <td className="flex items-center gap-2 py-2 text-foreground">
                    <File className="size-3.5 text-crimson-bright" />
                    {f.name}
                  </td>
                  <td className="py-2 text-muted-foreground">{f.type}</td>
                  <td className="py-2 font-mono text-muted-foreground">{f.size}</td>
                  <td className="py-2 text-muted-foreground">{f.modified}</td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <button onClick={() => toast.info(`Preview needs the desktop bridge.`)} className="text-muted-foreground hover:text-crimson-bright">
                        Open
                      </button>
                      <span className="text-muted-foreground/40">·</span>
                      <button
                        onClick={() => setConfirming(f.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                    {confirming === f.id && (
                      <div className="mt-1 rounded border border-destructive/60 bg-destructive/10 p-2">
                        <p className="text-[10px] text-destructive">Delete {f.name}? This is a high-risk action.</p>
                        <div className="mt-1 flex gap-2">
                          <button
                            onClick={() => {
                              setConfirming(null);
                              toast.error("Blocked: Windows control is not connected.");
                            }}
                            className="rounded border border-destructive px-2 py-0.5 text-[10px] text-destructive"
                          >
                            Confirm
                          </button>
                          <button onClick={() => setConfirming(null)} className="text-[10px] text-muted-foreground">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
