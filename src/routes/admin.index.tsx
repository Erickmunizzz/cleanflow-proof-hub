import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Briefcase, Camera, CircleCheck, CircleX, ClipboardCheck, Clock3, Download,
  MapPin, ShieldCheck, TrendingUp, TriangleAlert, UserCog, Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  attentionJobs, completedJobsWeek, recentCheckins, snapshot, staffPins, statusCards, type Tone,
} from "@/lib/data/overview";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Overview — CleanFlow UK" },
      { name: "description", content: "Live overview of jobs, check-ins and site issues for your cleaning team." },
      { property: "og:title", content: "Operations Overview — CleanFlow UK" },
      { property: "og:description", content: "Live overview of jobs, check-ins and site issues for your cleaning team." },
    ],
  }),
  component: Overview,
});

const toneIcon: Record<Tone, string> = {
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger",
};
const toneDot: Record<Tone, string> = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" };
const ToneIcon = { success: CircleCheck, warning: TriangleAlert, danger: CircleX };

const card = "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]";

const today = new Date();
const todayLabel = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-none tracking-tight">Operations Overview</h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">Live status of your cleaning operations • {todayLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast("Exported daily report")}
            className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-[13px] font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <Link
            to="/admin/$section"
            params={{ section: "checkin" }}
            className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <ClipboardCheck className="h-4 w-4" /> View Daily Tasks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statusCards.map((c) => {
          const Icon = ToneIcon[c.tone];
          return (
            <div key={c.title} className={cn(card, "p-5 transition hover:shadow-[var(--shadow-card-md)]")}>
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-xl", toneIcon[c.tone])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[14px] font-semibold">{c.title}</div>
                </div>
                <span className={cn("h-2.5 w-2.5 rounded-full", toneDot[c.tone])} />
              </div>
              <div className="space-y-2">
                {c.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between text-[12.5px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span
                      className={cn(
                        "font-semibold",
                        c.tone === "danger" && value !== "0" && "text-danger",
                        c.tone === "warning" && value !== "0" && "text-warning-strong",
                      )}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={cn(card, "p-6 xl:col-span-2")}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold">Company Snapshot</h3>
            <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">Demo data</span>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: "Customers", value: snapshot.customers, sub: "Active contracts", icon: Users },
              { label: "Workplaces", value: snapshot.workplaces, sub: "Sites managed", icon: MapPin },
              { label: "Employees", value: snapshot.employees, sub: "Field team", icon: Briefcase },
              { label: "Supervisors", value: snapshot.supervisors, sub: "Quality control", icon: UserCog },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-accent">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-[28px] font-bold leading-none tracking-tight">{s.value}</div>
                <div className="text-[13px] font-medium">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 text-[12.5px] sm:grid-cols-3">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success-strong" /> GDPR compliant logs</div>
            <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> 99.9% check-in uptime</div>
            <div className="flex items-center gap-2"><Camera className="h-4 w-4 text-muted-foreground" /> Photo proof on every job</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="text-[12px] font-semibold uppercase tracking-widest opacity-60">Proof of Service</div>
            <h3 className="mt-3 text-[18px] font-bold leading-tight">Show clients every job was done.</h3>
            <p className="mt-2 text-[13px] leading-relaxed opacity-70">
              Check-in and check-out times, GPS location, checklists and before/after photos — collected by cleaners on their phone.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-ink-foreground/10 px-3 py-2.5 text-[12px]">
                <span>Jobs with full proof today</span><span className="font-semibold">7 / 9</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-ink-foreground/10 px-3 py-2.5 text-[12px]">
                <span>Reports awaiting review</span><span className="font-bold text-success">3</span>
              </div>
            </div>
            <Link
              to="/admin/$section"
              params={{ section: "reports" }}
              className="mt-5 grid h-10 w-full place-items-center rounded-xl bg-card text-[13px] font-semibold text-foreground transition hover:bg-secondary"
            >
              Open Reports →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-semibold">Live staff locations - London</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success-strong">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> 4 moving
              </span>
            </div>
            <button
              onClick={() => toast("Full map view coming soon")}
              className="flex items-center gap-1 text-[12px] font-semibold text-primary transition hover:text-primary/80"
            >
              <MapPin className="h-3.5 w-3.5" /> View map
            </button>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-xl border border-ink bg-map">
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: "linear-gradient(var(--ink-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--ink-foreground) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute left-0 right-0 top-[56%] h-2 rotate-[-2deg] bg-primary/20 blur-[1px]" />
            <div className="absolute left-[10%] right-[15%] top-[22%] h-px bg-ink-foreground/10" />
            <div className="absolute left-[5%] right-[10%] top-[38%] h-px bg-ink-foreground/10" />
            <div className="absolute left-[10%] right-[5%] top-[72%] h-px bg-ink-foreground/10" />
            <div className="absolute bottom-0 left-[32%] top-0 w-px bg-ink-foreground/10" />
            <div className="absolute bottom-0 left-[62%] top-0 w-px bg-ink-foreground/10" />
            {staffPins.map((p) => {
              const color = { primary: "bg-primary", muted: "bg-muted-foreground", success: "bg-success", warning: "bg-warning" }[p.tone];
              return (
                <div key={p.name} className="absolute flex items-center gap-2" style={{ left: p.left, top: p.top }}>
                  <div className="relative">
                    <div className={cn("h-3.5 w-3.5 rounded-full border-2 border-card", color)} />
                    {p.live && <div className={cn("absolute -inset-2 animate-ping rounded-full opacity-20", color)} />}
                  </div>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground shadow">{p.name}</span>
                </div>
              );
            })}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-ink-foreground/10 bg-ink/80 px-3 py-1.5 text-[11px] font-medium text-ink-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Zone 1 • 4 staff • GPS accuracy ±4m
            </div>
          </div>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Recent Check-ins - Today</h3>
            <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
              {today.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
            </span>
          </div>
          <div className="space-y-3">
            {recentCheckins.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-xl border border-border p-2.5 transition hover:bg-accent">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{c.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium leading-tight">
                    <span className="font-semibold">{c.name}</span> <span className="font-normal text-muted-foreground">@ {c.loc}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock3 className="h-3 w-3" /> {c.time}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        c.weak ? "border-warning-border bg-warning-soft text-warning-strong" : "border-success-border bg-success-soft text-success-strong",
                      )}
                    >
                      <span className={cn("h-1 w-1 rounded-full", c.weak ? "bg-warning" : "bg-success")} /> {c.gps}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/$section"
            params={{ section: "checkin" }}
            className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-[12px] font-semibold transition hover:bg-accent"
          >
            View all check-ins <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(card, "p-5")}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold">Jobs completed — last 7 days</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">{completedJobsWeek.total} jobs with proof of service</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
              <TrendingUp className="h-3 w-3" /> {completedJobsWeek.change}
            </span>
          </div>
          <div className="mt-4">
            <div className="relative h-[160px] w-full text-primary">
              <svg viewBox="0 0 340 140" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="jobsGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="var(--border)" strokeWidth="0.5">
                  <line x1="0" y1="35" x2="340" y2="35" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="340" y2="70" strokeDasharray="4 4" />
                  <line x1="0" y1="105" x2="340" y2="105" strokeDasharray="4 4" />
                </g>
                <path d="M0,85 C40,70 60,95 85,65 C115,38 135,52 170,48 C200,44 225,72 260,62 C295,52 315,18 340,28 L340,140 L0,140 Z" fill="url(#jobsGrad)" />
                <path d="M0,85 C40,70 60,95 85,65 C115,38 135,52 170,48 C200,44 225,72 260,62 C295,52 315,18 340,28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                {[[85, 65], [170, 48], [260, 62], [340, 28]].map(([cx, cy]) => (
                  <circle key={cx} cx={cx} cy={cy} r="3.5" fill="currentColor" stroke="var(--card)" strokeWidth="2" />
                ))}
              </svg>
            </div>
            <div className="mt-3 flex justify-between px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {["Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d}>{d}</span>)}
              <span className="font-bold text-foreground">Sun</span>
            </div>
          </div>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Jobs needing attention - {attentionJobs.length} open</h3>
            <span className="grid h-6 w-6 place-items-center rounded-full border border-danger-border bg-danger-soft text-[11px] font-bold text-danger">
              {attentionJobs.length}
            </span>
          </div>
          <div className="space-y-3">
            {attentionJobs.map((j) => {
              const tone =
                j.priority === "High" ? "border-danger-border bg-danger-soft text-danger-strong"
                : j.priority === "Medium" ? "border-warning-border bg-warning-soft text-warning-strong"
                : "border-border bg-secondary text-muted-foreground";
              return (
                <div key={j.site} className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:bg-accent">
                  <div className={cn("mt-0.5 grid h-8 w-8 place-items-center rounded-xl border", tone)}>
                    <TriangleAlert className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold">{j.site} - {j.issue}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{j.time} • auto-flagged</div>
                  </div>
                  <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", tone)}>
                    {j.priority}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => toast("Opening attention queue")}
            className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-ink text-[12px] font-semibold text-ink-foreground transition hover:bg-ink/90"
          >
            Review all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
