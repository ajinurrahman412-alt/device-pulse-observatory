import { useEffect, useState } from "react";
import { useJarvis } from "@/lib/jarvis/store";

const key = (email: string) => `ajinur.intro.${email}`;

/** First-login JARVIS2.0 greeting. Stores the preferred name per account on this device. */
export function JarvisIntro() {
  const { userEmail, userRole } = useJarvis();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!userEmail || userRole === "owner") return;
    if (!localStorage.getItem(key(userEmail))) setOpen(true);
  }, [userEmail, userRole]);

  if (!open || !userEmail) return null;

  const save = () => {
    const n = name.trim();
    localStorage.setItem(key(userEmail), JSON.stringify({ preferredName: n || null }));
    setDone(n);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="hud-panel w-full max-w-md animate-scale-in border border-cyan-hud/60 p-6" style={{ boxShadow: "0 0 30px oklch(0.72 0.16 245 / 35%)" }}>
        <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full border-2 border-cyan-hud" style={{ boxShadow: "0 0 24px oklch(0.72 0.16 245 / 60%)" }}>
          <div className="size-10 animate-pulse rounded-full bg-cyan-hud/60" />
        </div>
        <div className="text-center font-display text-sm tracking-[0.3em] text-cyan-hud">JARVIS 2.0</div>
        {done === null ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              Hello, I am JARVIS2.0. I was created by Ajinur2.0. May I know your name so we can build a connection or friendship? You can tell me any name you would like me to call you.
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              maxLength={40}
              placeholder="Your name…"
              className="mt-4 w-full rounded border border-panel-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-cyan-hud"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setName(""); save(); }} className="rounded px-3 py-2 font-mono text-[11px] text-muted-foreground">SKIP</button>
              <button onClick={save} className="rounded border border-cyan-hud px-4 py-2 font-mono text-[11px] text-cyan-hud">CONTINUE</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-center text-sm text-foreground">
              {done ? `Nice to meet you, ${done}. I'll remember that — but I'll usually call you Boss.` : "No problem. I'll call you Boss."}
            </p>
            <div className="mt-4 flex justify-center">
              <button onClick={() => setOpen(false)} className="rounded border border-cyan-hud px-4 py-2 font-mono text-[11px] text-cyan-hud">LET'S GO, BOSS</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
