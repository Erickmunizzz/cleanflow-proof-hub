import {roleDestination} from "@/lib/role-access";
import { AuthLegalFooter } from "@/components/legal/LegalDocuments";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CleanMa" },
      { name: "description", content: "Sign in to your CleanMa workspace." },
      { property: "og:title", content: "Sign in — CleanMa" },
      { property: "og:description", content: "Sign in to your CleanMa workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const input = "h-10 w-full rounded-xl border border-border bg-card px-3 text-[13.5px] outline-none focus:border-primary";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.href } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (!res.data.session) { toast.success("Check your email to confirm your account."); return; }
    const token=new URLSearchParams(location.search).get('invite');
    if(token){const result=await supabase.rpc('accept_staff_invite' as never,{invite_token:token} as never);if(result.error){toast.error(result.error.message);return;}}
    window.location.replace(await roleDestination());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <img src="/cleanma-logo.png" alt="CleanMa logo" className="h-8 w-12 shrink-0 rounded object-contain" />
          <div className="text-[17px] font-bold tracking-tight">{mode === "signin" ? "Sign in" : "Create account"}</div>
        </div>
        <input className={input} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={busy} className="h-10 w-full rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-[12.5px] text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
        <AuthLegalFooter />
      </form>
    </div>
  );
}
