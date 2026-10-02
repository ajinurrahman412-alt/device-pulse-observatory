import { AlertTriangle, Languages, ShieldAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Language ---------------- */
export type Lang = "en" | "hi" | "hn" | "as";
export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "en", short: "EN", label: "English" },
  { id: "hi", short: "हि", label: "हिन्दी" },
  { id: "hn", short: "HN", label: "Hinglish" },
  { id: "as", short: "অ", label: "অসমীয়া" },
];

const DICT: Record<string, Record<Lang, string>> = {
  Home: { en: "Home", hi: "होम", hn: "Home", as: "ঘৰ" },
  "Agent Town": { en: "Agent Town", hi: "एजेंट टाउन", hn: "Agent Town", as: "এজেণ্ট টাউন" },
  Chat: { en: "Chat", hi: "चैट", hn: "Baat-cheet", as: "চেট" },
  Voice: { en: "Voice", hi: "आवाज़", hn: "Awaaz", as: "কণ্ঠ" },
  Tasks: { en: "Tasks", hi: "कार्य", hn: "Kaam", as: "কাম" },
  Memory: { en: "Memory", hi: "स्मृति", hn: "Yaadein", as: "স্মৃতি" },
  Skills: { en: "Skills", hi: "कौशल", hn: "Skills", as: "দক্ষতা" },
  Integrations: { en: "Integrations", hi: "कनेक्शन", hn: "Connections", as: "সংযোগ" },
  Calendar: { en: "Calendar", hi: "कैलेंडर", hn: "Calendar", as: "কেলেণ্ডাৰ" },
  Notes: { en: "Notes", hi: "नोट्स", hn: "Notes", as: "টোকা" },
  Files: { en: "Files", hi: "फ़ाइलें", hn: "Files", as: "ফাইল" },
  Activity: { en: "Activity", hi: "गतिविधि", hn: "Activity", as: "কাৰ্যকলাপ" },
  Security: { en: "Security", hi: "सुरक्षा", hn: "Suraksha", as: "সুৰক্ষা" },
  Settings: { en: "Settings", hi: "सेटिंग्स", hn: "Settings", as: "ছেটিংছ" },
  "Visual Hub": { en: "Visual Hub", hi: "विज़ुअल हब", hn: "Visual Hub", as: "ভিজুৱেল হাব" },
  Gesture: { en: "Gesture", hi: "इशारे", hn: "Ishaare", as: "ইংগিত" },
  Onboarding: { en: "Onboarding", hi: "शुरुआत", hn: "Shuruaat", as: "আৰম্ভণি" },
  "Test JARVIS": { en: "Test JARVIS", hi: "JARVIS जाँचें", hn: "JARVIS Test", as: "JARVIS পৰীক্ষা" },
  Billing: { en: "Billing", hi: "बिलिंग", hn: "Billing", as: "বিলিং" },
  Docs: { en: "Docs", hi: "गाइड", hn: "Guide", as: "নিৰ্দেশিকা" },
  Profile: { en: "Profile", hi: "प्रोफ़ाइल", hn: "Profile", as: "প্ৰফাইল" },
  "Landing Page": { en: "Landing Page", hi: "मुख्य पेज", hn: "Landing Page", as: "মুখ্য পৃষ্ঠা" },
  Account: { en: "Account", hi: "खाता", hn: "Account", as: "একাউণ্ট" },
  "AGENTS ACTIVE": { en: "AGENTS ACTIVE", hi: "सक्रिय एजेंट", hn: "AGENTS CHALU", as: "সক্ৰিয় এজেণ্ট" },
  "AI DESKTOP": { en: "AI DESKTOP", hi: "AI डेस्कटॉप", hn: "AI DESKTOP", as: "AI ডেস্কটপ" },
  "Agent Engine Online": { en: "Agent Engine Online", hi: "एजेंट इंजन चालू", hn: "Agent Engine Chalu", as: "এজেণ্ট ইঞ্জিন অনলাইন" },
  "OpenClaw Offline": { en: "OpenClaw Offline", hi: "OpenClaw बंद", hn: "OpenClaw Band", as: "OpenClaw অফলাইন" },
  "OpenClaw Connected": { en: "OpenClaw Connected", hi: "OpenClaw जुड़ा", hn: "OpenClaw Juda", as: "OpenClaw সংযুক্ত" },
  NOTIFICATIONS: { en: "NOTIFICATIONS", hi: "सूचनाएँ", hn: "NOTIFICATIONS", as: "জাননী" },
  Language: { en: "Language", hi: "भाषा", hn: "Bhasha", as: "ভাষা" },
};

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const LangContext = createContext<LangCtx | null>(null);

/* ---------------- Danger confirm ---------------- */
export type DangerOptions = {
  title: string;
  description: string;
  level?: "CRITICAL" | "HIGH RISK";
  consequences?: string[];
  confirmWord?: string;
  actionLabel?: string;
};
type DangerCtx = { confirmDanger: (o: DangerOptions) => Promise<boolean> };
const DangerContext = createContext<DangerCtx | null>(null);

export function UiExtrasProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("jarvis-lang") as Lang | null;
    if (saved && LANGS.some((l) => l.id === saved)) setLangState(saved);
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("jarvis-lang", l);
  }, []);
  const t = useCallback((k: string) => DICT[k]?.[lang] ?? k, [lang]);

  const [danger, setDanger] = useState<DangerOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const confirmDanger = useCallback(
    (o: DangerOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setDanger(o);
      }),
    [],
  );
  const close = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setDanger(null);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <DangerContext.Provider value={{ confirmDanger }}>
        {children}
        {danger && <DangerModal opts={danger} onClose={close} />}
      </DangerContext.Provider>
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext) ?? { lang: "en" as Lang, setLang: () => {}, t: (k: string) => k };
}
export function useDanger() {
  return useContext(DangerContext) ?? { confirmDanger: async () => false };
}

function DangerModal({ opts, onClose }: { opts: DangerOptions; onClose: (v: boolean) => void }) {
  const word = opts.confirmWord ?? "CONFIRM";
  const [typed, setTyped] = useState("");
  const ok = typed.trim().toUpperCase() === word.toUpperCase();
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-label={opts.title}>
      <div className="relative w-full max-w-md rounded-lg border-2 border-destructive bg-card/95 p-5" style={{ boxShadow: "0 0 40px color-mix(in oklab, var(--destructive) 45%, transparent)" }}>
        <button onClick={() => onClose(false)} className="absolute right-3 top-3 text-muted-foreground hover:text-destructive" aria-label="Cancel">
          <X className="size-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex size-11 animate-pulse items-center justify-center rounded-full border border-destructive bg-destructive/15">
            <ShieldAlert className="size-5 text-destructive" />
          </div>
          <div>
            <span className="rounded border border-destructive px-1.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-destructive">
              {opts.level ?? "CRITICAL"} · SECURITY CHECK
            </span>
            <h2 className="mt-1 font-display text-sm tracking-[0.15em] text-foreground">{opts.title}</h2>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{opts.description}</p>
        {opts.consequences && (
          <ul className="mt-3 space-y-1 rounded-md border border-destructive/40 bg-destructive/5 p-3">
            {opts.consequences.map((c) => (
              <li key={c} className="flex items-start gap-2 text-[11px] text-foreground">
                <AlertTriangle className="mt-0.5 size-3 shrink-0 text-destructive" />
                {c}
              </li>
            ))}
          </ul>
        )}
        <label className="mt-4 block font-mono text-[10px] tracking-widest text-muted-foreground">
          TYPE <span className="text-destructive">{word}</span> TO CONFIRM
        </label>
        <input
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mt-1 w-full rounded-md border border-panel-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-destructive"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={() => onClose(false)} className="flex-1 rounded-md border border-panel-border py-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground">
            CANCEL
          </button>
          <button
            disabled={!ok}
            onClick={() => onClose(true)}
            className={cn(
              "flex-1 rounded-md border py-2 font-display text-[10px] tracking-[0.2em] transition-all",
              ok ? "border-destructive bg-destructive/25 text-destructive" : "cursor-not-allowed border-panel-border text-muted-foreground opacity-50",
            )}
          >
            {opts.actionLabel ?? "EXECUTE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-md border border-cyan-hud/30 p-0.5" title={t("Language")}>
      {!compact && <Languages className="ml-1 size-3 text-muted-foreground" />}
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          aria-label={l.label}
          title={l.label}
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[9px] tracking-wider transition-colors",
            lang === l.id ? "bg-cyan-hud/15 text-cyan-hud" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
