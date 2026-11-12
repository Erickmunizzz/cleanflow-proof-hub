import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAdminSession } from "./AdminSession";
import { ownerContextOptions } from "@/lib/owner-context";
import { supabase } from "@/integrations/supabase/client";
import { allowsFeature, isPlanError, LIMIT_MESSAGE, loadSubscription, plans, type Feature, type Resource } from "@/lib/subscriptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SubscriptionActions = {
  canUse: (feature: Feature) => boolean;
  requireFeature: (feature: Feature) => boolean;
  requireCapacity: (resource: Resource, month?: string) => Promise<boolean>;
  handleError: (error: unknown) => void;
};
const Context = createContext<SubscriptionActions | null>(null);
export function useSubscription() {
  const context = useContext(Context);
  if (!context) throw new Error("SubscriptionProvider is required.");
  return context;
}
const routeFeatures: Record<string, Feature> = {
  "/admin/wages": "payroll",
};
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const owner = useQuery({ ...ownerContextOptions, enabled: Boolean(session) });
  const companyId = session ? owner.data?.companyId : undefined;
  const client = useQueryClient();
  const pathname = useLocation({ select: location => location.pathname });
  const feature = routeFeatures[pathname.replace(/\/$/, "")];
  const [reason, setReason] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const query = useQuery({
    queryKey: ["subscription", companyId], enabled: Boolean(companyId),
    queryFn: () => loadSubscription(companyId!), refetchInterval: 30_000,
  });
  const status = companyId && !query.isError ? query.data : undefined;
  const blocked = Boolean(session && feature && (!status || !allowsFeature(status.plan, feature)));
  const refresh = () => void client.invalidateQueries({ queryKey: ["subscription"] });
  useEffect(() => { setReason(null); setConfirmation(""); }, [companyId]);
  useEffect(() => {
    if (blocked && status) setReason(`Unlock ${feature} with an upgraded plan.`);
  }, [blocked, feature, status?.plan]);
  useEffect(() => {
    if (!companyId) return;
    const channel = supabase.channel(`subscription-${companyId}`);
    for (const table of ["companies", "staff", "jobs", "upgrade_requests"]) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, refresh);
    }
    channel.subscribe();
    const unsubscribe = client.getMutationCache().subscribe(event => {
      if (event.type !== "updated") return;
      if (isPlanError(event.mutation.state.error)) { setReason(LIMIT_MESSAGE); refresh(); }
      if (event.mutation.state.status === "success") refresh();
    });
    return () => { unsubscribe(); void supabase.removeChannel(channel); };
  }, [companyId, client]);
  const request = useMutation({
    mutationFn: async (requestedPlan: string) => {
      if (!companyId) throw new Error("Sign in to your company first.");
      const result = await supabase.rpc("request_plan_upgrade", { target_company: companyId, requested_plan: requestedPlan });
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => {
      setConfirmation("Request received. Your current plan remains active while your request is reviewed.");
      refresh();
    },
  });
  function requireFeature(required: Feature) {
    if (status && allowsFeature(status.plan, required)) return true;
    setConfirmation(""); setReason(`Unlock ${required} with an upgraded plan.`);
    return false;
  }
  async function requireCapacity(resource: Resource, month?: string) {
    if (!companyId) return false;
    try {
      const current = await loadSubscription(companyId, month);
      const full = resource === "staff" ? current.staffUsed >= current.staffLimit : current.jobsUsed >= current.jobsLimit;
      if (full) { setConfirmation(""); setReason(LIMIT_MESSAGE); refresh(); return false; }
      return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not verify plan limits."); return false; }
  }
  function handleError(error: unknown) {
    if (isPlanError(error)) { setConfirmation(""); setReason(LIMIT_MESSAGE); refresh(); }
  }
  const full = status && (status.staffUsed >= status.staffLimit || status.jobsUsed >= status.jobsLimit);
  const near = status && (status.staffUsed >= status.staffLimit * 0.8 || status.jobsUsed >= status.jobsLimit * 0.8);
  const rank = plans.findIndex(plan => plan.id === status?.plan);
  return <Context.Provider value={{ canUse: required => Boolean(status && allowsFeature(status.plan, required)), requireFeature, requireCapacity, handleError }}>
    {session && query.isError && <div role="alert" className="mb-5 rounded-xl border border-border p-4 text-sm">Could not verify your subscription. <Button variant="link" onClick={() => void query.refetch()}>Try again</Button></div>}
    {status && near && <aside role="status" className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div><p className="font-serif text-lg">{full ? LIMIT_MESSAGE : "Your workspace is approaching its plan limit."}</p>
        <p className="mt-1 text-sm text-muted-foreground">{status.staffUsed}/{status.staffLimit} active employees · {status.jobsUsed}/{status.jobsLimit} jobs in {status.month.slice(0, 7)}</p></div>
      <Button variant="outline" onClick={() => { setConfirmation(""); setReason(full ? LIMIT_MESSAGE : "Choose more room for your team."); }}> {status.plan === "scale" ? "Contact support" : "View plans"}</Button>
    </aside>}
    {blocked ? <section className="rounded-2xl border border-border bg-card p-8"><h1 className="font-serif text-2xl">{query.isPending ? "Checking your plan…" : "Upgrade your workspace"}</h1>
      <p className="my-4 text-muted-foreground">This feature requires {feature === "payments" ? "Scale" : "Growth or Scale"}.</p>
      <Button disabled={!status} onClick={() => feature && requireFeature(feature)}>View plans</Button></section> : children}
    <Dialog open={reason !== null} onOpenChange={open => { if (!open) { setReason(null); request.reset(); setConfirmation(""); } }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-border bg-card p-8 sm:max-w-3xl sm:p-10">
        <DialogHeader><DialogTitle className="font-serif text-3xl font-normal">Room for your next chapter</DialogTitle>
          <DialogDescription className="pt-3 leading-relaxed">{reason}</DialogDescription></DialogHeader>
        {!status ? <p role="status">Verifying your subscription…</p> : <>
          <p className="text-sm text-muted-foreground capitalize">Current plan · {status.plan}{status.pendingPlan ? ` · Pending request: ${status.pendingPlan}` : ""}</p>
          <div className="grid gap-4 py-4 sm:grid-cols-3">{plans.map((plan, index) => <section key={plan.id} className="flex flex-col gap-4 rounded-xl border border-border p-5">
            <h2 className="font-serif text-xl">{plan.name}</h2><p><strong className="text-xl font-medium">{plan.price}</strong><span className="text-xs text-muted-foreground"> / month</span></p>
            <p className="text-sm leading-7">{plan.staff} active employees<br />{plan.jobs.toLocaleString("en-GB")} jobs / month</p>
            <Button variant={index === 2 ? "default" : "outline"} className="mt-auto whitespace-normal" disabled={index <= rank || request.isPending}
              onClick={() => { setConfirmation(""); request.mutate(plan.id); }}>{plan.id === status.plan ? "Current plan" : index < rank ? "Included" : "Request upgrade"}</Button>
          </section>)}</div>
          {status.plan === "scale" && <Button disabled={request.isPending} onClick={() => request.mutate("support")}>Request capacity review</Button>}
          <p className="text-xs leading-relaxed text-muted-foreground">Requests are reviewed before activation. No payment is collected here.</p>
        </>}
        {confirmation && <p role="status" className="text-sm text-success-strong">{confirmation}</p>}
        {request.error && <p role="alert" className="text-sm text-destructive">{request.error.message}</p>}
      </DialogContent>
    </Dialog>
  </Context.Provider>;
}
