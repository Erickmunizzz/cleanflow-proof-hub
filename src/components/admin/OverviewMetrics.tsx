import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, CalendarX, KeyRound, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { loadOverviewMetrics } from "@/lib/overview-metrics";

const cards = [
  { title: "Cancellations", key: "cancellations", icon: CalendarX, labels: ["In total", "Next 7 days", "Later"], detail: "Cancelled jobs by scheduled date" },
  { title: "Active Work Settings", key: "work", icon: CalendarClock, labels: ["In total", "Next 7 days"], detail: "Scheduled and in-progress jobs" },
  { title: "Key Returns", key: "returns", icon: KeyRound, labels: ["In total", "Today", "Past"], detail: "Recorded returns by return date" },
  { title: "Product Requests", key: "products", icon: Package, labels: ["In total", "To be sent", "Global"], detail: "Open, approved awaiting fulfilment, and all company requests" },
] as const;

export function OverviewMetrics({ companyId }: { companyId: string }) {
  const queryClient = useQueryClient();
  const metrics = useQuery({
    queryKey: ["overview-metrics", companyId],
    queryFn: () => loadOverviewMetrics(companyId),
    refetchInterval: 60_000,
  });

  useEffect(() => {
    const refresh = () => { void queryClient.invalidateQueries({ queryKey: ["overview-metrics", companyId] }); };
    const channel = supabase.channel(`overview-metrics-${companyId}`);
    for (const table of ["jobs", "key_registers", "material_requests"]) {
      const filter = { schema: "public", table, filter: `company_id=eq.${companyId}` };
      channel.on("postgres_changes", { ...filter, event: "INSERT" }, refresh)
        .on("postgres_changes", { ...filter, event: "UPDATE" }, refresh)
        .on("postgres_changes", { schema: "public", table, event: "DELETE" }, refresh);
    }
    channel.subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
    return () => { void supabase.removeChannel(channel); };
  }, [companyId, queryClient]);

  return (
    <section aria-label="Additional operations metrics" className="space-y-3">
      {metrics.isPending && <p role="status" className="text-sm text-muted-foreground">Loading operation metrics…</p>}
      {metrics.isError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-danger">
          Could not refresh operation metrics.
          <Button variant="outline" size="sm" onClick={() => void metrics.refetch()}>Try again</Button>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, key, icon: Icon, labels, detail }) => {
          const content = <>
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></div>
              <h2 className="flex-1 text-sm font-semibold">{title}</h2>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <p className="mb-4 mt-2 min-h-8 text-xs text-muted-foreground">{detail}</p>
            <dl className="space-y-2 text-[12.5px]">
              {labels.map((label, index) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold tabular-nums">{metrics.isError ? "—" : metrics.data?.[key][index] ?? "—"}</dd>
                </div>
              ))}
            </dl>
          </>;
          const className = "block rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:border-primary/40 hover:shadow-[var(--shadow-card-md)] focus-visible:outline-2 focus-visible:outline-primary";
          if (key === "cancellations") return <Link key={key} to="/admin/jobs" search={{ status: "cancelled" }} className={className}>{content}</Link>;
          if (key === "products") return <Link key={key} to="/admin/storage" search={{ q: "", tab: "Product requests" }} className={className}>{content}</Link>;
          return <Link key={key} to="/admin/$section" params={{ section: key === "returns" ? "keys" : "scheduling" }} className={className}>{content}</Link>;
        })}
      </div>
    </section>
  );
}
