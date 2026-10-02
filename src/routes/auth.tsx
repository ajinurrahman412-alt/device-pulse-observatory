import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useJarvis } from "@/lib/jarvis/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "JARVIS Account — Sign In" },
      { name: "description", content: "Sign in to JARVIS to save your notes, memories and schedule permanently." },
      { property: "og:title", content: "JARVIS Account — Sign In" },
      { property: "og:description", content: "Sign in to JARVIS to save your notes, memories and schedule permanently." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { userEmail } = useJarvis();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mode === "in" ? "Welcome back." : "Check your email to confirm your account.");
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error(String(r.error.message ?? r.error));
  };

  if (userEmail) {
    return (
      <div className="hud-panel mx-auto max-w-md space-y-4 p-6 text-center">
        <div className="font-display tracking-[0.2em] text-crimson-bright">OPERATOR VERIFIED</div>
        <p className="text-sm text-muted-foreground">Signed in as {userEmail}. Notes, memories and schedule are saved to your account.</p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-crimson px-4 py-2 text-sm text-crimson-bright hover:bg-crimson/20">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="hud-panel mx-auto max-w-md space-y-4 p-6">
      <div className="text-center font-display tracking-[0.2em] text-crimson-bright">
        {mode === "in" ? "SIGN IN" : "CREATE ACCOUNT"}
      </div>
      <button onClick={google} className="w-full rounded-md border border-panel-border bg-secondary/60 px-4 py-2 text-sm text-foreground hover:bg-secondary">
        Continue with Google
      </button>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm text-foreground" />
        <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-panel-border bg-background/60 px-3 py-2 text-sm text-foreground" />
        <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {busy ? "..." : mode === "in" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-xs text-muted-foreground hover:text-foreground">
        {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
      </button>
    </div>
  );
}
