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
  const { chat, sendMessage, toggleVoice, voiceActive } = useJarvis();
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
    <div className="grid h-[calc(100vh-88px)] gap-3 lg:grid-cols-[1fr_280px]">
      <Panel title="Active Conversations" className="min-h-0">
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

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-panel-border bg-background/60 p-2">
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

      <div className="space-y-3">
        <Panel title="Conversation Context">
          <ul className="space-y-1.5 text-[11px] text-muted-foreground">
            <li>Messages: {chat.length}</li>
            <li>Engine: Lovable AI (live)</li>
            <li>OpenClaw routing: not connected</li>
            <li>Memory writes: enabled</li>
          </ul>
        </Panel>
        <Panel title="Suggestions">
          <div className="space-y-1.5">
            {[
              "Check my calendar tomorrow",
              "Research the latest AI news",
              "Analyze my PC files",
              "Log expenses to Google Sheets",
            ].map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full rounded-md border border-panel-border/60 px-2 py-1.5 text-left text-[11px] text-muted-foreground hover:border-crimson hover:text-crimson-bright"
              >
                {s}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
