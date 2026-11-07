import { createContext, useContext, useEffect, useState, type ReactNode, Suspense } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const SessionContext = createContext<Session | null | undefined>(undefined);
const AccountContext = createContext<{ name: string; email: string } | null>(null);
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>();
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) { if (active) setSession(null); return; }
        const verified = await supabase.auth.getUser();
        if (verified.error?.status === 401 || verified.error?.status === 403) {
          await supabase.auth.signOut({ scope: "local" });
          if (active) setSession(null);
          return;
        }
        if (active) setSession(data.session);
      } catch { if (active) setSession(null); }
    }
    void restoreSession();
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      setSession(next);
      if (event === "SIGNED_OUT") queryClient.clear();
      else void queryClient.invalidateQueries();
      void router.invalidate();
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);
  const accountQuery = useQuery({
    queryKey: ["account-profile", session?.user.id],
    enabled: Boolean(session),
    queryFn: async () => {
      if (!session) return null;
      const { data, error } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
  const account = session ? { name: accountQuery.data?.full_name?.trim() || session.user.email || "Account", email: session.user.email || "" } : null;
  return <SessionContext.Provider value={session}><AccountContext.Provider value={account}>{children}</AccountContext.Provider></SessionContext.Provider>;
}
export const useAdminSession = () => useContext(SessionContext);
export const useAdminAccount = () => useContext(AccountContext);
export function AdminDataBoundary({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  if (session === undefined) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!session) return <div className="space-y-4 py-12 text-center"><h1 className="text-xl font-semibold">Sign in to your workspace</h1><Button asChild className="rounded-xl"><Link to="/auth">Sign in</Link></Button></div>;
  return <Suspense fallback={<p className="text-sm text-muted-foreground">Loading records…</p>}>{children}</Suspense>;
}