import { createContext, useContext, useEffect, useState, type ReactNode, Suspense } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const SessionContext = createContext<Session | null | undefined>(undefined);
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>();
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setSession(data.session); });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      setSession(next);
      if (event === "SIGNED_OUT") queryClient.clear();
      else void queryClient.invalidateQueries();
      void router.invalidate();
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
export const useAdminSession = () => useContext(SessionContext);
export function AdminDataBoundary({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  if (session === undefined) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!session) return <div className="space-y-4 py-12 text-center"><h1 className="text-xl font-semibold">Sign in to your workspace</h1><Button asChild className="rounded-xl"><Link to="/auth">Sign in</Link></Button></div>;
  return <Suspense fallback={<p className="text-sm text-muted-foreground">Loading records…</p>}>{children}</Suspense>;
}