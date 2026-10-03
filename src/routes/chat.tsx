import { createFileRoute } from "@tanstack/react-router";
import { Check, Mic, Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/jarvis/Panels";
import { clock, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => pageHead("Chat — JARVIS", "Talk to JARVIS and watch tool steps and agent delegation live."),
  component: ChatPage,
});

function ChatPage() {
  const { chat, sendMessage, toggleVoice, voiceActive, agents, tasks } = useJarvis();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  const submit = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="grid h-[calc(100vh-88px)] gap-3 lg:grid-cols-[1fr_300px]">
      <Panel title="JARVIS 2.0 · Holographic Chat" className="min-h-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {chat.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[78%] rounded-lg px-3 py-2 text-[13px]",
                    m.role === "user"
                      ? "bg-crimson/25 text-foreground border border-panel-border"
                      : "text-foreground",
                  )}
                >
                  {m.role === "jarvis" && (
                    <div className="mb-1 font-display text-[9px] tracking-[0.25em] text-crimson-bright">JARVIS</div>
                  )}
                  <p>{m.text}</p>
                  {m.steps && (
                    <ul className="mt-2 space-y-1">
                      {m.steps.map((s) => (
                        <li key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Check className="size-3 text-success" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1 font-mono text-[9px] text-muted-foreground/60">{clock(m.ts)}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["System Diagnostics", "Run full system diagnostics"],
              ["Agent Dispatch", "Dispatch an agent to research latest AI news"],
              ["Memory Query", "What do you remember about my projects?"],
              ["OpenClaw Run", "Open my browser and check email"],
              ["Today's Schedule", "Check my calendar today"],
            ] as const).map(([label, prompt]) => (
              <button
                key={label}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-panel-border px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground hover:border-crimson hover:text-crimson-bright"
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-lg border border-panel-border bg-background/60 p-2">
            <button className="p-1 text-muted-foreground hover:text-crimson-bright" aria-label="Attach">
              <Paperclip className="size-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Ask JARVIS to do something..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={toggleVoice}
              className={cn("p-1", voiceActive ? "text-crimson-bright" : "text-muted-foreground hover:text-crimson-bright")}
              aria-label="Voice"
            >
              <Mic className="size-4" />
            </button>
            <button
              onClick={submit}
              className="rounded-md border border-crimson bg-crimson/20 p-1.5 text-crimson-bright glow-border"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </Panel>

      <div className="min-h-0 space-y-3 overflow-y-auto">
        <Panel title="JARVIS 2.0 · Link Status">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Core Load", "34%", "text-crimson-bright"],
              ["Memory", "SYNCED", "text-success"],
              ["Uplink", "STABLE", "text-success"],
              ["OpenClaw", "NOT CONNECTED", "text-amber-hud"],
            ] as const).map(([k, v, c]) => (
              <div key={k} className="rounded-md border border-panel-border/60 px-2 py-1.5">
                <div className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground">{k.toUpperCase()}</div>
                <div className={cn("font-display text-[11px] tracking-wider", c)}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-6 items-end gap-0.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-crimson-bright/70"
                style={{
                  height: voiceActive ? `${20 + ((i * 37) % 80)}%` : "15%",
                  animation: voiceActive ? `core-pulse ${0.5 + (i % 5) * 0.15}s ease-in-out infinite` : undefined,
                }}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Agent Delegation">
          <ul className="space-y-1.5">
            {agents.map((a) => {
              const t = tasks.find((x) => x.id === a.currentTaskId);
              return (
                <li key={a.id} className="flex items-center gap-2 rounded-md border border-panel-border/60 px-2 py-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      a.status === "OFFLINE" ? "bg-muted-foreground" : a.status === "IDLE" ? "bg-amber-hud" : "bg-success animate-pulse",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-foreground">{a.name}</div>
                    <div className="truncate font-mono text-[9px] text-muted-foreground">{t ? t.title : "Awaiting handover"}</div>
                  </div>
                  <span className="font-mono text-[8px] tracking-wider text-crimson-bright">{a.status}</span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Tool Trace">
          <ul className="space-y-1.5">
            {chat
              .filter((m) => m.steps?.length)
              .slice(-4)
              .reverse()
              .flatMap((m) => (m.steps ?? []).map((s, i) => ({ id: `${m.id}-${i}`, s, ts: m.ts })))
              .slice(0, 8)
              .map((x) => (
                <li key={x.id} className="flex items-center gap-2 text-[10px]">
                  <Check className="size-3 shrink-0 text-success" />
                  <span className="flex-1 truncate text-muted-foreground">{x.s}</span>
                  <span className="font-mono text-[8px] text-muted-foreground/60">{clock(x.ts)}</span>
                </li>
              ))}
            {!chat.some((m) => m.steps?.length) && (
              <li className="text-[10px] text-muted-foreground">No tool calls yet.</li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
