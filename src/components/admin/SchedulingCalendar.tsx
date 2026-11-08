import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { adminRecordsOptions } from "@/lib/admin-records.query";
import { ownerContextOptions } from "@/lib/owner-context";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const card = "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]";

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SchedulingCalendar() {
  const { data } = useSuspenseQuery(adminRecordsOptions);
  const owner = useQuery(ownerContextOptions);
  const queryClient = useQueryClient();
  const jobs = data.jobs;
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(() => dayKey(new Date()));

  useEffect(() => {
    const companyId = owner.data?.companyId;
    if (!companyId) return;
    const channel = supabase
      .channel(`owner-scheduling-${companyId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "jobs", filter: `company_id=eq.${companyId}`,
      }, () => {
        void queryClient.invalidateQueries({ queryKey: ["admin-records"] });
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [owner.data?.companyId, queryClient]);

  const jobsByDay = useMemo(() => {
    const grouped = new Map<string, typeof jobs>();
    for (const job of jobs) {
      const scheduled = new Date(job.scheduled_date);
      if (Number.isNaN(scheduled.getTime())) continue;
      const key = dayKey(scheduled);
      const matches = grouped.get(key) ?? [];
      grouped.set(key, [...matches, job]);
    }
    for (const [key, dayJobs] of grouped) {
      grouped.set(key, [...dayJobs].sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()));
    }
    return grouped;
  }, [jobs]);

  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - ((firstOfMonth.getDay() + 6) % 7));
  const calendarDays = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));
  const selectedJobs = jobsByDay.get(selectedDay) ?? [];
  const moveMonth = (amount: number) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(nextMonth);
    setSelectedDay(dayKey(nextMonth));
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-none tracking-tight">Scheduling</h1>
        <p className="mt-2 text-[13.5px] text-muted-foreground">Scheduled jobs from your workspace</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)} className="grid size-9 place-items-center rounded-xl border border-border bg-card hover:bg-accent"><ChevronLeft className="size-4" /></button>
        <div className="min-w-36 text-center text-sm font-semibold">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
        <button type="button" aria-label="Next month" onClick={() => moveMonth(1)} className="grid size-9 place-items-center rounded-xl border border-border bg-card hover:bg-accent"><ChevronRight className="size-4" /></button>
      </div>
    </div>

    <section aria-label="Job calendar" className={cn(card, "overflow-hidden p-3 sm:p-5")}>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekdays.map(day => <div key={day} className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">{day}</div>)}
        {calendarDays.map(date => {
          const key = dayKey(date);
          const dayJobs = jobsByDay.get(key) ?? [];
          const inMonth = date.getMonth() === month.getMonth();
          const selected = key === selectedDay;
          return <button
            key={key}
            type="button"
            aria-pressed={selected}
            aria-label={`${date.toLocaleDateString("en-GB", { dateStyle: "full" })}, ${dayJobs.length} scheduled jobs`}
            onClick={() => setSelectedDay(key)}
            className={cn(
              "min-h-[76px] rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:p-2",
              inMonth ? "border-border bg-card" : "border-transparent bg-surface-2 text-muted-foreground",
              selected && "border-primary ring-2 ring-primary/20",
            )}
          >
            <span className={cn("grid size-6 place-items-center rounded-full text-xs font-semibold", selected && "bg-primary text-primary-foreground")}>{date.getDate()}</span>
            <span className="mt-1 block space-y-1">
              {dayJobs.slice(0, 2).map(job => <span key={job.id} className={cn(
                "block truncate rounded-md px-1 py-0.5 text-[9px] font-medium sm:text-[10px]",
                job.status.toLowerCase().replaceAll("-", "_") === "completed" ? "bg-success-soft text-success-strong"
                  : job.status.toLowerCase().replaceAll("-", "_") === "in_progress" ? "bg-warning-soft text-warning-strong"
                    : "bg-primary-soft text-primary",
              )}>{job.title}</span>)}
              {dayJobs.length > 2 && <span className="block px-1 text-[9px] text-muted-foreground">+{dayJobs.length - 2} more</span>}
            </span>
          </button>;
        })}
      </div>
    </section>

    <section className={cn(card, "p-4 sm:p-5")}>
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">{new Date(`${selectedDay}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h2>
        <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{selectedJobs.length} {selectedJobs.length === 1 ? "job" : "jobs"}</span>
      </div>
      {selectedJobs.length ? <div className="space-y-3">{selectedJobs.map(job => {
        const status = job.status.toLowerCase().replaceAll("-", "_");
        const scheduledTime = new Date(job.scheduled_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        return <article key={job.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Clock3 className="size-4" /></span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{job.title}</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{job.clients?.name ?? "No customer"} · {job.staff?.name ?? "Unassigned cleaner"}</p>
          </div>
          <span className="text-sm font-medium">{scheduledTime}</span>
          <span className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
            status === "completed" ? "bg-success-soft text-success-strong"
              : status === "in_progress" ? "bg-warning-soft text-warning-strong"
                : "bg-primary-soft text-primary",
          )}>{status.replaceAll("_", " ")}</span>
        </article>;
      })}</div> : <p className="py-8 text-center text-sm text-muted-foreground">No jobs scheduled for this day.</p>}
    </section>
  </div>;
}
