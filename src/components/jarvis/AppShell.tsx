import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Calendar,
  Cog,
  Command,
  CreditCard,
  FileText,
  FolderOpen,
  Globe,
  Hand,
  Home,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Mic,
  Minus,
  Plug,
  Rocket,
  Shield,
  Sparkles,
  Square,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CommandPalette } from "@/components/jarvis/CommandPalette";
import { clock, useJarvis } from "@/lib/jarvis/store";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, UiExtrasProvider, useLang, useDanger } from "@/lib/jarvis/ui-extras";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/owner", label: "Owner Console", icon: Shield },
  { to: "/agent-town", label: "Agent Town", icon: LayoutGrid },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/voice", label: "Voice", icon: Mic },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/files", label: "Files", icon: FolderOpen },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/security", label: "Security", icon: Shield },
  { to: "/settings", label: "Settings", icon: Cog },
  { to: "/visual-hub", label: "Visual Hub", icon: Boxes },
  { to: "/gesture", label: "Gesture", icon: Hand },
  { to: "/onboarding", label: "Onboarding", icon: Rocket },
  { to: "/diagnostics", label: "Test JARVIS", icon: Stethoscope },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/docs", label: "Docs", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/landing", label: "Landing Page", icon: Globe },
  { to: "/auth", label: "Account", icon: Bot },
] as const;

/** Pages only the verified Owner may open; hidden from everyone else. */
const OWNER_ONLY = new Set<string>(["/owner", "/integrations", "/security", "/diagnostics", "/activity"]);

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <UiExtrasProvider>
      <Shell>{children}</Shell>
    </UiExtrasProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const { confirmDanger } = useDanger();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { integrations, agents, activity, userRole } = useJarvis();
  const isOwner = userRole === "owner";
  const blocked = OWNER_ONLY.has(pathname) && !isOwner;
  const [notifOpen, setNotifOpen] = useState(false);
  const openclaw = integrations.find((i) => i.id === "openclaw")?.status === "CONNECTED";
  const activeAgents = agents.filter((a) => a.status === "WORKING" || a.status === "THINKING").length;

  // The public landing page has its own chrome.
  if (pathname === "/landing") return <>{children}</>;


  return (
    <div className="flex min-h-screen w-full">
      {/* left nav */}
      <aside className="sticky top-0 hidden h-screen w-[190px] shrink-0 flex-col border-r border-panel-border/60 bg-sidebar/80 backdrop-blur-md md:flex">
        <div className="flex items-center gap-2 px-4 py-4">
          <div
            className="flex size-8 items-center justify-center rounded-full border border-crimson font-display text-xs text-crimson-bright"
            style={{ boxShadow: "var(--glow-sm)" }}
          >
            J
          </div>
          <div>
            <div className="font-display text-[13px] tracking-[0.25em] text-foreground glow-text">JARVIS</div>
            <div className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground">{t("AI DESKTOP")}</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
          {NAV.filter((item) => isOwner || !OWNER_ONLY.has(item.to)).map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] tracking-wide transition-all",
                  active
                    ? "bg-crimson/20 text-crimson-bright glow-border"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-3.5" />
                {t(item.label)}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-panel-border/60 px-4 py-3">
          <div className="font-mono text-[9px] text-muted-foreground">{t("AGENTS ACTIVE")}</div>
          <div className="font-display text-lg text-crimson-bright glow-text">{activeAgents}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-30 flex min-h-12 items-center gap-3 border-b border-cyan-hud/30 bg-background/90 px-3 py-2 backdrop-blur-md">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="AJINUR2.0 dashboard">
            <span className="flex size-7 items-center justify-center rounded-full border border-cyan-hud/70 font-display text-[10px] text-cyan-hud" style={{ boxShadow: "0 0 12px color-mix(in oklab, var(--cyan-hud) 35%, transparent)" }}>J</span>
            <span className="hidden font-display text-[10px] tracking-[0.16em] text-foreground sm:inline">AJINUR<span className="text-cyan-hud">2.0</span></span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {[
              { label: "AGENTS", icon: Bot, to: "/agent-town" as const },
              { label: "VISUAL HUB", icon: Boxes, to: "/visual-hub" as const },
              { label: "GESTURE", icon: Hand, to: "/gesture" as const },
            ].map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="flex items-center gap-1.5 rounded-md border border-cyan-hud/25 px-2.5 py-1 font-display text-[9px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-cyan-hud hover:text-cyan-hud"
              >
                <t.icon className="size-3" />
                {t.label}
              </Link>
            ))}
          </div>

          <div className="ml-2 hidden items-center gap-3 lg:flex">
            <StatusDot ok={openclaw} label={t(openclaw ? "OpenClaw Connected" : "OpenClaw Offline")} />
            <StatusDot ok label={t("Agent Engine Online")} />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <div className="mr-1 hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }),
                )
              }
              className="mr-1 hidden items-center gap-1.5 rounded-md border border-cyan-hud/30 px-2 py-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground transition-colors hover:border-cyan-hud hover:text-cyan-hud sm:flex"
              aria-label="Open command palette"
            >
              <Command className="size-3" />
              CTRL + K
            </button>
            <button
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className={cn(
                "relative rounded p-1.5 transition-colors",
                notifOpen ? "text-cyan-hud" : "text-muted-foreground hover:text-cyan-hud",
              )}
            >
              <Bell className="size-3.5" />
              {activity.length > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 size-1.5 rounded-full"
                  style={{ background: "var(--crimson-bright)", boxShadow: "0 0 8px var(--crimson-bright)" }}
                />
              )}
            </button>
            <Link
              to="/settings"
              className="rounded p-1.5 text-muted-foreground transition-colors hover:text-cyan-hud"
              aria-label="Settings"
            >
              <Cog className="size-3.5" />
            </Link>
            <span className="mx-1 h-4 w-px bg-panel-border" />
            <WinBtn label="Minimize">
              <Minus className="size-3.5" />
            </WinBtn>
            <WinBtn label="Maximize">
              <Square className="size-3" />
            </WinBtn>
            <WinBtn
              label="Close"
              danger
              onClick={() =>
                confirmDanger({
                  title: "SHUT DOWN JARVIS",
                  description: "This will stop all agents and close the command center.",
                  level: "HIGH RISK",
                  consequences: ["All running tasks pause", "Agents go offline"],
                  confirmWord: "SHUTDOWN",
                  actionLabel: "SHUT DOWN",
                })
              }
            >
              <X className="size-3.5" />
            </WinBtn>
          </div>

          {notifOpen && (
            <div className="absolute right-3 top-[calc(100%+6px)] z-50 w-[320px] rounded-md border border-cyan-hud/40 bg-card/95 p-3 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="font-display text-[10px] tracking-[0.22em] text-cyan-hud">{t("NOTIFICATIONS")}</span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-muted-foreground hover:text-crimson-bright"
                  aria-label="Close notifications"
                >
                  <X className="size-3" />
                </button>
              </div>
              <ul className="mt-2 max-h-80 space-y-1 overflow-y-auto">
                {activity.slice(0, 12).map((a) => {
                  const agent = agents.find((x) => x.id === a.agentId);
                  return (
                    <li key={a.id} className="rounded border border-panel-border/40 px-2.5 py-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[10px] tracking-[0.14em]" style={{ color: agent?.color }}>
                          {agent?.name ?? "JARVIS"}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">{clock(a.ts)}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{a.action}</div>
                    </li>
                  );
                })}
                {activity.length === 0 && (
                  <li className="px-1 py-4 text-center font-mono text-[10px] text-muted-foreground">
                    NOTHING NEW
                  </li>
                )}
              </ul>
            </div>
          )}
        </header>

        <main className="min-w-0 flex-1 p-3">
          {blocked ? (
            <div className="hud-panel mx-auto mt-10 max-w-md p-6 text-center">
              <Shield className="mx-auto size-8 text-amber-hud" />
              <h1 className="mt-3 font-display text-lg tracking-widest text-foreground">OWNER ONLY</h1>
              <p className="mt-2 text-sm text-muted-foreground">This area is reserved for the AJINUR2.0 Owner.</p>
              <Link to="/" className="mt-4 inline-block rounded border border-cyan-hud/50 px-3 py-1.5 font-mono text-xs text-cyan-hud">BACK TO HOME</Link>
            </div>
          ) : children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-muted-foreground">
      <span
        className="size-1.5 rounded-full"
        style={{ background: ok ? "var(--success)" : "var(--amber-hud)", boxShadow: `0 0 8px ${ok ? "var(--success)" : "var(--amber-hud)"}` }}
      />
      {label.toUpperCase()}
    </span>
  );
}

function WinBtn({ children, label, danger, onClick }: { children: ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded p-1.5 text-muted-foreground transition-colors",
        danger ? "hover:bg-destructive/20 hover:text-destructive" : "hover:text-crimson-bright",
      )}
    >
      {children}
    </button>
  );
}
