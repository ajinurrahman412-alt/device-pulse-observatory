import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { JarvisCore } from "@/components/jarvis/JarvisCore";
import { Panel } from "@/components/jarvis/Panels";
import { pageHead } from "@/lib/jarvis/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/voice")({
  head: () => pageHead("Voice Command Center — AJINUR2.0", "Talk to JARVIS 2.0 with a live waveform, wake word and transcript."),
  component: VoicePage,
});

type Line = { ts: number; text: string; wake: boolean };

function VoicePage() {
  const [listening, setListening] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(64).fill(2));
  const [interim, setInterim] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => stopRef.current();
  }, []);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let raf = 0;
      const loop = () => {
        analyser.getByteFrequencyData(data);
        setLevels(Array.from(data, (v) => 2 + (v / 255) * 70));
        raf = requestAnimationFrame(loop);
      };
      loop();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rec: any = null;
      if (SR) {
        rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onresult = (e: any) => {
          let temp = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript.trim();
            if (e.results[i].isFinal) setLines((l) => [{ ts: Date.now(), text: t, wake: /jarvis/i.test(t) }, ...l].slice(0, 30));
            else temp += t;
          }
          setInterim(temp);
        };
        rec.onerror = (e: { error: string }) => setError(`Speech recognition: ${e.error}`);
        rec.start();
      }
      stopRef.current = () => {
        cancelAnimationFrame(raf);
        rec?.stop();
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        setLevels(Array(64).fill(2));
        setInterim("");
        setListening(false);
      };
      setListening(true);
    } catch {
      setError("Microphone permission was denied or no microphone was found.");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="font-display text-xl tracking-[0.2em] text-cyan-hud">VOICE COMMAND CENTER</h1>
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">SAY “JARVIS” TO WAKE · JARVIS 2.0</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
        <Panel title="AI Core">
          <div className="flex min-h-[460px] flex-col items-center justify-center gap-6">
            <JarvisCore />
            <div className="flex h-20 items-end gap-[3px]">
              {levels.map((h, i) => (
                <span key={i} className="w-1 rounded-full bg-cyan-hud transition-[height] duration-75" style={{ height: `${h}px`, opacity: listening ? 1 : 0.3 }} />
              ))}
            </div>
            <p className="min-h-5 font-mono text-xs text-foreground">{interim || (listening ? "Listening…" : "Tap the mic to start")}</p>
            <button
              onClick={() => (listening ? stopRef.current() : start())}
              className={cn("flex items-center gap-2 rounded-full border px-6 py-3 font-display text-xs tracking-widest", listening ? "border-crimson-bright bg-crimson/20 text-crimson-bright" : "border-cyan-hud bg-cyan-hud/10 text-cyan-hud")}
            >
              {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              {listening ? "STOP LISTENING" : "START LISTENING"}
            </button>
            {error && <p className="font-mono text-[10px] text-amber-hud">{error}</p>}
          </div>
        </Panel>
        <div className="space-y-3">
          <Panel title="Voice Pipeline">
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex justify-between"><span className="text-muted-foreground">Microphone</span><span className={listening ? "text-success" : ""}>{listening ? "Live" : "Off"}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Speech to text</span><span>{supported ? "Browser" : "Not supported here"}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">JARVIS voice reply</span><span className="text-amber-hud">Setup Required</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Wake word</span><span>“JARVIS”</span></li>
            </ul>
          </Panel>
          <Panel title="Live Transcript">
            <ul className="max-h-[360px] space-y-1.5 overflow-y-auto text-[11px]">
              {lines.length === 0 && <li className="text-muted-foreground">Nothing heard yet.</li>}
              {lines.map((l) => (
                <li key={l.ts} className="flex gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground">{new Date(l.ts).toLocaleTimeString()}</span>
                  <span className={l.wake ? "text-cyan-hud" : "text-foreground"}>{l.wake && "⚡ "}{l.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
