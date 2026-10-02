import { createFileRoute } from "@tanstack/react-router";
import { JarvisCore } from "@/components/jarvis/JarvisCore";
import { Panel } from "@/components/jarvis/Panels";
import { clock, useJarvis } from "@/lib/jarvis/store";
import { pageHead } from "@/lib/jarvis/head";

export const Route = createFileRoute("/voice")({
  head: () => pageHead("Voice — JARVIS", "Voice core with live waveform, transcript and speech settings."),
  component: VoicePage,
});

function VoicePage() {
  const { chat, voiceActive } = useJarvis();

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <Panel title="AI Core" className="min-h-[520px] items-center justify-center">
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <JarvisCore />
          <div className="flex h-16 items-end gap-1">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: voiceActive ? `${8 + ((i * 53) % 52)}px` : "4px",
                  background: "linear-gradient(to top, var(--crimson-deep), var(--crimson-bright))",
                  animation: voiceActive ? `core-pulse ${0.5 + (i % 7) * 0.12}s ease-in-out infinite` : undefined,
                  opacity: voiceActive ? 1 : 0.35,
                }}
              />
            ))}
          </div>
        </div>
      </Panel>

      <div className="space-y-3">
        <Panel title="Voice Pipeline">
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex justify-between"><span className="text-muted-foreground">Microphone</span><span>Browser</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Speech to text</span><span>Not connected</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Text to speech</span><span>ElevenLabs pending</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Wake word</span><span>“Jarvis”</span></li>
          </ul>
          <p className="mt-2 font-mono text-[9px] text-amber-hud">
            Voice keys stay on the server — nothing sensitive is stored in this interface.
          </p>
        </Panel>
        <Panel title="Conversation History">
          <ul className="space-y-1.5 text-[11px]">
            {chat.slice(-8).reverse().map((m) => (
              <li key={m.id} className="flex gap-2">
                <span className="font-mono text-[9px] text-muted-foreground/70">{clock(m.ts)}</span>
                <span className="truncate text-muted-foreground">
                  <span className="text-crimson-bright">{m.role === "user" ? "YOU" : "JARVIS"}</span> {m.text}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
