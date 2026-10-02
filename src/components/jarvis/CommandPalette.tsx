import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";

type Target =
  | "/"
  | "/agent-town"
  | "/visual-hub"
  | "/gesture"
  | "/chat"
  | "/voice"
  | "/tasks"
  | "/memory"
  | "/skills"
  | "/integrations"
  | "/calendar"
  | "/notes"
  | "/files"
  | "/activity"
  | "/security"
  | "/settings"
  | "/onboarding"
  | "/diagnostics"
  | "/billing"
  | "/docs"
  | "/profile"
  | "/landing"
  | "/auth";

interface Cmd {
  label: string;
  hint: string;
  to?: Target;
  run?: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { createTask, toggleVoice } = useJarvis();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands = useMemo<Cmd[]>(
    () => [
      { label: "Dashboard", hint: "Go to the command center", to: "/" },
      { label: "Agent Town", hint: "Full screen agent view", to: "/agent-town" },
      { label: "Visual Hub", hint: "Live monitoring", to: "/visual-hub" },
      { label: "Gesture Control", hint: "Hand command layer", to: "/gesture" },
      { label: "Chat with JARVIS", hint: "Open the chat", to: "/chat" },
      { label: "Voice", hint: "Voice console", to: "/voice" },
      { label: "Tasks", hint: "Task queue", to: "/tasks" },
      { label: "Memory", hint: "What JARVIS remembers", to: "/memory" },
      { label: "Skills", hint: "Abilities", to: "/skills" },
      { label: "Integrations", hint: "Connect services", to: "/integrations" },
      { label: "Calendar", hint: "Schedule", to: "/calendar" },
      { label: "Notes", hint: "Your notes", to: "/notes" },
      { label: "Files", hint: "File browser", to: "/files" },
      { label: "Activity", hint: "Live feed", to: "/activity" },
      { label: "Security Center", hint: "Permissions and audit", to: "/security" },
      { label: "Settings", hint: "Preferences", to: "/settings" },
      { label: "Onboarding", hint: "Setup steps", to: "/onboarding" },
      { label: "Test JARVIS", hint: "Run system check", to: "/diagnostics" },
      { label: "Billing & Usage", hint: "Plans and limits", to: "/billing" },
      { label: "Documentation", hint: "Guides", to: "/docs" },
      { label: "Profile", hint: "Account and devices", to: "/profile" },
      {
        label: "New research task",
        hint: "Send work to ALICE",
        run: () => createTask({ title: "Research request from command palette", agentId: "alice", source: "Command palette" }),
      },
      {
        label: "New computer task",
        hint: "Send work to BOB",
        run: () => createTask({ title: "Computer request from command palette", agentId: "bob", source: "Command palette" }),
      },
      { label: "Toggle voice", hint: "Start or stop listening", run: toggleVoice },
    ],
    [createTask, toggleVoice],
  );

  const filtered = query
    ? commands.filter((c) => (c.label + c.hint).toLowerCase().includes(query.toLowerCase()))
    : commands;

  const execute = (c: Cmd) => {
    setOpen(false);
    setQuery("");
    if (c.to) void navigate({ to: c.to });
    else {
      c.run?.();
      toast.success(`${c.label} triggered`);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/70 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-lg border border-crimson/60 bg-card/95 glow-border"
      >
        <div className="flex items-center gap-2 border-b border-panel-border/60 px-3 py-2.5">
          <Search className="size-3.5 text-crimson-bright" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) execute(filtered[0]);
            }}
            placeholder="Type a command or screen name…"
            className="flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-panel-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1.5">
          {filtered.map((c, i) => (
            <li key={c.label}>
              <button
                onClick={() => execute(c)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
                  i === 0 ? "bg-crimson/15 text-crimson-bright" : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <ArrowRight className="size-3 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] text-foreground">{c.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{c.hint}</span>
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-[10px] text-muted-foreground">NO MATCHING COMMAND</li>
          )}
        </ul>
      </div>
    </div>
  );
}
