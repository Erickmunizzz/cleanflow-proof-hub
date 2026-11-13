import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight, Briefcase, CircleCheck, ClipboardCheck, Clock3, Download,
  MapPin, Package, ShieldCheck, TrendingUp, TriangleAlert, Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { cn } from "@/lib/utils";
import { OverviewMetrics } from "@/components/admin/OverviewMetrics";
import { AdminDataBoundary } from "@/components/admin/AdminSession";
import { Button } from "@/components/ui/button";
import { readAllRows } from "@/lib/supabase-pages";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "CleanMa" },
      { name: "description", content: "Live overview of jobs, check-ins and site operations for your cleaning team." },
      { property: "og:title", content: "Operations Overview — CleanMa" },
      { property: "og:description", content: "Live overview of jobs, check-ins and site operations for your cleaning team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AdminDataBoundary><Overview /></AdminDataBoundary>,
});

type Tone = "success" | "warning" | "danger";
type Job = {
  id: string;
  title: string;
  status: string;
  scheduled_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  clients: { name: string; address: string | null } | null;
  staff: { name: string } | null;
};
type Staff = { id: string; name: string; profile_id: string | null; is_active: boolean };
type Material = { id: string; quantity: number | string };

const toneIcon: Record<Tone, string> = {
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger",
};
const toneDot: Record<Tone, string> = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" };
const ToneIcon = { success: CircleCheck, warning: TriangleAlert, danger: TriangleAlert };
const card = "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]";
const fmt = (value: string | null) => value
  ? new Date(value).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
  : "—";
const statusOf = (job: Job) => job.status.toLowerCase().replaceAll("-", "_");
const startOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

async function loadOverview(companyId: string) {
  const jobs: Job[] = [];
  for (let start = 0; ; start += 1000) {
    const { data, error } = await supabase
      .from("jobs")
      .select("id,title,status,scheduled_date,check_in_at,check_out_at,check_in_latitude,check_in_longitude,clients!jobs_customer_same_company_fkey(name,address),staff!jobs_staff_same_company_fkey(name)")
      .eq("company_id", companyId)
      .order("scheduled_date", { ascending: true })
      .order("id")
      .range(start, start + 999);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as unknown as Job[];
    jobs.push(...page);
    if (page.length < 1000) break;
  }

  const [staffResult, clientsResult, materialsResult] = await Promise.all([
    readAllRows((a, b) => supabase.from("staff").select("id,name,profile_id,is_active").eq("company_id", companyId).order("name").order("id").range(a, b)),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("company_id", companyId),
    readAllRows((a, b) => supabase.from("materials").select("id,quantity").eq("company_id", companyId).order("id").range(a, b)),
  ]);
  for (const result of [clientsResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    jobs,
    staff: staffResult as Staff[],
    customerCount: clientsResult.count ?? 0,
    materials: materialsResult as Material[],
  };
}

function downloadJobs(jobs: Job[]) {
  const fields = ["title", "status", "scheduled_date", "customer", "staff", "check_in_at", "check_out_at"];
  const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = jobs.map((job) => [
    job.title, job.status, job.scheduled_date, job.clients?.name ?? "",
    job.staff?.name ?? "", job.check_in_at ?? "", job.check_out_at ?? "",
  ]);
  const csv = [fields, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cleanma-jobs.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function Overview() {
  const queryClient = useQueryClient();
  const ownerQuery = useQuery(ownerContextOptions);
  const companyId = ownerQuery.data?.companyId;
  const overviewQuery = useQuery({
    queryKey: ["owner-overview", companyId],
    enabled: Boolean(companyId),
    queryFn: () => {
      if (!companyId) throw new Error("Owner company is unavailable.");
      return loadOverview(companyId);
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!companyId) return;
    const channel = supabase
      .channel(`owner-overview-${companyId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "jobs", filter: `company_id=eq.${companyId}`,
      }, () => {
        void queryClient.invalidateQueries({ queryKey: ["owner-overview", companyId] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "staff", filter: `company_id=eq.${companyId}` }, () => { void queryClient.invalidateQueries({ queryKey: ["owner-overview", companyId] }); })
      .on("postgres_changes", { event: "*", schema: "public", table: "clients", filter: `company_id=eq.${companyId}` }, () => { void queryClient.invalidateQueries({ queryKey: ["owner-overview", companyId] }); })
      .on("postgres_changes", { event: "*", schema: "public", table: "materials", filter: `company_id=eq.${companyId}` }, () => { void queryClient.invalidateQueries({ queryKey: ["owner-overview", companyId] }); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [companyId, queryClient]);

  if (ownerQuery.isLoading || overviewQuery.isLoading) {
    return <div className="text-[13px] text-muted-foreground">Loading operations overview…</div>;
  }
  if (ownerQuery.isError || overviewQuery.isError) {
    const error = ownerQuery.error ?? overviewQuery.error;
    return <div role="alert" className="space-y-4"><h1 className="text-[28px] font-bold">Operations Overview</h1><p className="text-sm text-danger">Couldn't load operations overview: {error?.message ?? "Workspace unavailable."}</p><Button onClick={() => { void ownerQuery.refetch(); void overviewQuery.refetch(); }}>Try again</Button></div>;
  }

  const data = overviewQuery.data;
  if (!data) return <div role="alert" className="space-y-4"><h1 className="text-[28px] font-bold">Operations Overview</h1><p className="text-sm text-muted-foreground">Your workspace could not be loaded.</p><Button onClick={() => { void ownerQuery.refetch(); }}>Try again</Button></div>;

  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const priorWeekStart = new Date(todayStart);
  priorWeekStart.setDate(priorWeekStart.getDate() - 13);
  const inRange = (value: string, start: Date, end: Date) => {
    const time = new Date(value).getTime();
    return time >= start.getTime() && time < end.getTime();
  };

  const todayJobs = data.jobs.filter((job) => inRange(job.scheduled_date, todayStart, tomorrow));
  const upcomingEnd = new Date(tomorrow);
  upcomingEnd.setDate(upcomingEnd.getDate() + 6);
  const upcomingJobs = data.jobs.filter((job) => inRange(job.scheduled_date, tomorrow, upcomingEnd));
  const completedThisWeek = data.jobs.filter((job) => statusOf(job) === "completed" && inRange(job.scheduled_date, weekStart, tomorrow));
  const completedPriorWeek = data.jobs.filter((job) => statusOf(job) === "completed" && inRange(job.scheduled_date, priorWeekStart, weekStart));
  const activeStaff = data.staff.filter((person) => person.is_active);
  const linkedStaff = activeStaff.filter((person) => Boolean(person.profile_id));
  const outOfStock = data.materials.filter((material) => Number(material.quantity) <= 0).length;
  const activeJobs = data.jobs.filter((job) => statusOf(job) === "in_progress" && job.check_in_at && !job.check_out_at);
  const todayCheckins = data.jobs
    .filter((job) => job.check_in_at && inRange(job.check_in_at, todayStart, tomorrow))
    .sort((a, b) => new Date(b.check_in_at ?? "").getTime() - new Date(a.check_in_at ?? "").getTime());
  const attentionJobs = data.jobs.flatMap<{ job: Job; issue: string; priority: "High" | "Medium" }>((job) => {
    const status = statusOf(job);
    const scheduled = new Date(job.scheduled_date);
    if (status === "scheduled" && scheduled < now) {
      return [{ job, issue: "Scheduled time has passed", priority: "High" as const }];
    }
    if (status === "in_progress" && job.check_in_at && !job.check_out_at
      && now.getTime() - new Date(job.check_in_at).getTime() > 2 * 60 * 60 * 1000) {
      return [{ job, issue: "Check-out is overdue", priority: "Medium" as const }];
    }
    return [];
  }).sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1));

  const chartDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    return {
      date,
      count: data.jobs.filter((job) => statusOf(job) === "completed" && inRange(job.scheduled_date, date, end)).length,
    };
  });
  const chartMax = Math.max(1, ...chartDays.map((day) => day.count));
  const chartPoints = chartDays.map((day, index) => ({
    x: index * (340 / 6),
    y: 124 - (day.count / chartMax) * 96,
    count: day.count,
  }));
  const linePath = chartPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const areaPath = `${linePath} L340,140 L0,140 Z`;
  const weekDifference = completedThisWeek.length - completedPriorWeek.length;
  const summaryCards = [
    {
      title: "Jobs Today", tone: todayJobs.length ? "success" as Tone : "warning" as Tone,
      rows: [
        ["Scheduled:", String(todayJobs.filter((job) => statusOf(job) === "scheduled").length)],
        ["In progress:", String(todayJobs.filter((job) => statusOf(job) === "in_progress").length)],
        ["Completed:", String(todayJobs.filter((job) => statusOf(job) === "completed").length)],
      ] as [string, string][],
    },
    {
      title: "Customers & Staff", tone: "success" as Tone,
      rows: [
        ["Customers:", String(data.customerCount)],
        ["Active staff:", String(activeStaff.length)],
        ["Linked cleaner accounts:", String(linkedStaff.length)],
      ] as [string, string][],
    },
    {
      title: "Upcoming Work", tone: upcomingJobs.length ? "success" as Tone : "warning" as Tone,
      rows: [
        ["Next 7 days:", String(upcomingJobs.length)],
        ["Unassigned:", String(upcomingJobs.filter((job) => !job.staff).length)],
        ["Awaiting check-in:", String(upcomingJobs.filter((job) => statusOf(job) === "scheduled").length)],
      ] as [string, string][],
    },
    {
      title: "Materials", tone: outOfStock ? "warning" as Tone : "success" as Tone,
      rows: [
        ["Items tracked:", String(data.materials.length)],
        ["Out of stock:", String(outOfStock)],
      ] as [string, string][],
    },
  ];
  const gpsJobs = activeJobs.filter((job) => job.check_in_latitude !== null && job.check_in_longitude !== null).slice(0, 12);
  const latitudes = gpsJobs.map((job) => Number(job.check_in_latitude));
  const longitudes = gpsJobs.map((job) => Number(job.check_in_longitude));
  const minLat = Math.min(...latitudes), maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes), maxLng = Math.max(...longitudes);
  const gpsPosition = (job: Job) => {
    const latSpan = maxLat - minLat || 1;
    const lngSpan = maxLng - minLng || 1;
    const left = 8 + ((Number(job.check_in_longitude) - minLng) / lngSpan) * 84;
    const top = 12 + (1 - (Number(job.check_in_latitude) - minLat) / latSpan) * 76;
    return { left: `${left}%`, top: `${top}%` };
  };
  const proofToday = todayJobs.filter((job) => job.check_in_at && job.check_out_at).length;
  const awaitingCheckout = activeJobs.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-none tracking-tight">Operations Overview</h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Live status of your cleaning operations • {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadJobs(data.jobs)} className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-[13px] font-medium hover:bg-accent">
            <Download className="h-4 w-4" /> Export jobs
          </Button>
          <Link to="/admin/$section" params={{ section: "checkin" }} className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
            <ClipboardCheck className="h-4 w-4" /> View Daily Tasks
          </Link>
        </div>
      </div>

      <section aria-label="Operations summaries" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((item) => {
          const Icon = ToneIcon[item.tone];
          return (
            <div key={item.title} className={cn(card, "min-w-0 p-6 transition hover:shadow-[var(--shadow-card-md)]")}>
              <div className="mb-3 flex items-center justify-between">
                <div className={cn("grid h-9 w-9 place-items-center rounded-xl", toneIcon[item.tone])}><Icon className="h-5 w-5" /></div>
                <span className={cn("h-2.5 w-2.5 rounded-full", toneDot[item.tone])} />
              </div>
              <h2 className="mb-4 whitespace-nowrap text-sm font-semibold leading-5">{item.title}</h2>
              <div className="space-y-2">
                {item.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 text-[12.5px]">
                    <span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {companyId && <OverviewMetrics companyId={companyId} />}
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl bg-linear-to-br from-blue-950 to-blue-800 p-6 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">New feature · Stripe &amp; GoCardless</p>
          <h2 className="text-xl font-bold leading-tight">Collect from clients. Pay your team.</h2>
          <p className="text-sm leading-relaxed text-blue-100">
            Try payment links with QR codes and simulated team payouts. The demo includes a 1% CleanMa fee plus an illustrative gateway fee.
          </p>
          <Link
            to="/admin/$section"
            params={{ section: "payments" }}
            className="mt-auto flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Open Payments <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={cn(card, "p-6 xl:col-span-2")}>
          <div className="mb-6 flex items-center justify-between"><h3 className="text-[15px] font-semibold">Company Snapshot</h3></div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: "Customers", value: data.customerCount, sub: "Company records", icon: Users },
              { label: "Active staff", value: activeStaff.length, sub: "Enabled staff records", icon: Briefcase },
              { label: "Jobs today", value: todayJobs.length, sub: "Scheduled for today", icon: MapPin },
              { label: "Materials", value: data.materials.length, sub: "Tracked items", icon: Package },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-accent"><item.icon className="h-5 w-5 text-muted-foreground" /></div>
                <div className="text-[28px] font-bold leading-none tracking-tight">{item.value}</div>
                <div className="text-[13px] font-medium">{item.label}</div>
                <div className="text-[11px] text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 text-[12.5px] sm:grid-cols-3">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success-strong" /> Company-scoped records</div>
            <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> Live job updates</div>
            <div className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-success-strong" /> {proofToday} jobs with check-in and check-out today</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="text-[12px] font-semibold uppercase tracking-widest opacity-60">Proof of Service</div>
            <h3 className="mt-3 text-[18px] font-bold leading-tight">Track each assigned job.</h3>
            <p className="mt-2 text-[13px] leading-relaxed opacity-70">Check-in and check-out timestamps, GPS coordinates and job status are recorded from the cleaner app.</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-ink-foreground/10 px-3 py-2.5 text-[12px]">
                <span>Jobs completed today</span><span className="font-semibold">{todayJobs.filter((job) => statusOf(job) === "completed").length} / {todayJobs.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-ink-foreground/10 px-3 py-2.5 text-[12px]">
                <span>Awaiting check-out</span><span className="font-bold text-success">{awaitingCheckout}</span>
              </div>
            </div>
            <Link to="/admin/$section" params={{ section: "reports" }} className="mt-5 grid h-10 w-full place-items-center rounded-xl bg-card text-[13px] font-semibold text-foreground transition hover:bg-secondary">
              Open Reports →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-[14px] font-semibold">Active staff check-ins</h3><p className="mt-1 text-[11px] text-muted-foreground">Relative plot of current GPS points</p></div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success-strong">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> {activeJobs.length} active
            </span>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-xl border border-ink bg-map">
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(var(--ink-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--ink-foreground) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            {gpsJobs.map((job) => (
              <div key={job.id} className="absolute flex items-center gap-2" style={gpsPosition(job)}>
                <span className="relative h-3.5 w-3.5 rounded-full border-2 border-card bg-primary"><span className="absolute -inset-2 animate-ping rounded-full bg-primary opacity-20" /></span>
                <span className="max-w-40 truncate rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground shadow">{job.staff?.name ?? job.title}</span>
              </div>
            ))}
            {!gpsJobs.length && <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted-foreground">No active jobs with GPS coordinates.</p>}
            {gpsJobs.length > 0 && <div className="absolute bottom-3 left-3 rounded-full border border-ink-foreground/10 bg-ink/80 px-3 py-1.5 text-[11px] font-medium text-ink-foreground backdrop-blur">Relative position • GPS from active jobs</div>}
          </div>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Recent Check-ins — Today</h3>
            <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">{todayCheckins.length}</span>
          </div>
          <div className="space-y-3">
            {todayCheckins.slice(0, 6).map((job) => {
              const cleanerName = job.staff?.name ?? "Unassigned";
              const initials = cleanerName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
              const hasGps = job.check_in_latitude !== null && job.check_in_longitude !== null;
              return (
                <div key={job.id} className="flex items-center gap-3 rounded-xl border border-border p-2.5 transition hover:bg-accent">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{initials || "—"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium leading-tight"><span className="font-semibold">{cleanerName}</span> <span className="font-normal text-muted-foreground">@ {job.clients?.name ?? job.title}</span></div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock3 className="h-3 w-3" /> {fmt(job.check_in_at)}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", hasGps ? "border-success-border bg-success-soft text-success-strong" : "border-warning-border bg-warning-soft text-warning-strong")}>{hasGps ? "GPS recorded" : "GPS unavailable"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {!todayCheckins.length && <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No check-ins recorded today.</p>}
          </div>
          <Link to="/admin/$section" params={{ section: "checkin" }} className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-[12px] font-semibold transition hover:bg-accent">
            View all check-ins <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(card, "p-5")}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div><h3 className="text-[14px] font-semibold">Jobs completed — last 7 days</h3><p className="mt-1 text-[12px] text-muted-foreground">{completedThisWeek.length} completed jobs</p></div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
              <TrendingUp className="h-3 w-3" /> {weekDifference > 0 ? `+${weekDifference}` : weekDifference} vs prior 7d
            </span>
          </div>
          {completedThisWeek.length ? (
            <>
              <div className="mt-4 relative h-[160px] w-full text-primary">
                <svg viewBox="0 0 340 140" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Completed jobs per day">
                  <defs><linearGradient id="jobsGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.22" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                  <g stroke="var(--border)" strokeWidth="0.5"><line x1="0" y1="35" x2="340" y2="35" strokeDasharray="4 4" /><line x1="0" y1="70" x2="340" y2="70" strokeDasharray="4 4" /><line x1="0" y1="105" x2="340" y2="105" strokeDasharray="4 4" /></g>
                  <path d={areaPath} fill="url(#jobsGrad)" />
                  <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  {chartPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.5" fill="currentColor" stroke="var(--card)" strokeWidth="2"><title>{point.count} completed</title></circle>)}
                </svg>
              </div>
              <div className="mt-3 flex justify-between px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {chartDays.map(({ date }) => <span key={date.toISOString()}>{date.toLocaleDateString("en-GB", { weekday: "short" })}</span>)}
              </div>
            </>
          ) : <p className="py-12 text-center text-sm text-muted-foreground">No completed jobs in this period.</p>}
        </div>

        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Jobs needing attention — {attentionJobs.length}</h3>
            <span className="grid h-6 w-6 place-items-center rounded-full border border-danger-border bg-danger-soft text-[11px] font-bold text-danger">{attentionJobs.length}</span>
          </div>
          <div className="space-y-3">
            {attentionJobs.slice(0, 5).map(({ job, issue, priority }) => {
              const tone = priority === "High" ? "border-danger-border bg-danger-soft text-danger-strong" : "border-warning-border bg-warning-soft text-warning-strong";
              return (
                <div key={job.id} className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:bg-accent">
                  <div className={cn("mt-0.5 grid h-8 w-8 place-items-center rounded-xl border", tone)}><TriangleAlert className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold">{job.clients?.name ?? job.title} — {issue}</div><div className="mt-1 text-[11px] text-muted-foreground">{fmt(job.scheduled_date)} • {job.staff?.name ?? "Unassigned"}</div></div>
                  <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", tone)}>{priority}</span>
                </div>
              );
            })}
            {!attentionJobs.length && <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No jobs need attention.</p>}
          </div>
          <Link to="/admin/$section" params={{ section: "reports" }} className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-ink text-[12px] font-semibold text-ink-foreground transition hover:bg-ink/90">
            Review job reports <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
