import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { readAllRows } from "@/lib/supabase-pages";
import { absenceDate, absenceTypeLabel } from "@/lib/staff-absences";

const workTypes = [
  "General cleaning", "Window cleaning", "Deep cleaning", "Office cleaning", "Hospital cleaning",
  "Kitchen cleaning", "Bathroom sanitization", "Floor polishing", "Carpet cleaning", "Waste disposal", "Unclassified",
];
const options = {
  excluded: "Show excluded types",
  periodic: "Show periodic supplements",
  overtime: "Show overtime",
  personal: "Show personal supplements",
  special: "Show special supplements",
  empty: "Show empty values",
  cancelled: "Show cancelled tasks",
  firstWeek: "Show full first week",
};
const supplements = ["periodic", "overtime", "personal", "special"] as const;
const defaultOptions = { excluded: false, periodic: true, overtime: true, personal: false, special: false, empty: false, cancelled: false, firstWeek: false };
const field = "min-h-10 rounded-xl border border-border bg-card px-3 text-sm";
const card = "rounded-2xl border border-border bg-card";
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const hoursFormat = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 4 });
const london = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" });
const periodFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC" });
const dateLabel = (value: string) => periodFormat.format(new Date(value + "T00:00:00Z"));
type Job = Database["public"]["Functions"]["wage_listing"]["Returns"][number];

function mondayOf(value: string) {
  const day = new Date(value + "T00:00:00Z");
  day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  return day.toISOString().slice(0, 10);
}

export function WageListing({ companyId }: { companyId: string }) {
  const [start, setStart] = useState(() => london.format(new Date()).slice(0, 7) + "-01");
  const [end, setEnd] = useState(() => {
    const [year, month] = london.format(new Date()).split("-").map(Number);
    return new Date(Date.UTC(year!, month!, 0)).toISOString().slice(0, 10);
  });
  const [flags, setFlags] = useState(defaultOptions);
  const [sort, setSort] = useState("employee");
  const [employee, setEmployee] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(workTypes);
  const [appliedTypes, setAppliedTypes] = useState(workTypes);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [page, setPage] = useState(0);
  const valid = Boolean(start && end && start <= end && Date.parse(end) - Date.parse(start) <= 360 * 86_400_000);
  const effectiveStart = valid && flags.firstWeek ? mondayOf(start) : start;

  const summary = useQuery({
    queryKey: ["finance", companyId, "wage-listing", start, effectiveStart, end, flags.cancelled],
    enabled: valid,
    queryFn: async () => {
      const [staff, jobs, rates, absences, preference, premiums] = await Promise.all([
        readAllRows((a, b) => supabase.from("staff").select("id,name,is_active")
          .eq("company_id", companyId).order("name").order("id").range(a, b)),
        readAllRows((a, b) => supabase.rpc("wage_listing", {
          target_company: companyId, period_start: effectiveStart, period_end: end, include_cancelled: flags.cancelled,
        }).order("job_id").range(a, b)),
        readAllRows((a, b) => supabase.from("staff_wages").select("staff_id,hourly_rate")
          .eq("company_id", companyId).eq("period_start", start).eq("period_end", end).order("id").range(a, b)),
        readAllRows((a, b) => supabase.from("staff_absences").select("id,staff_id,absence_type,start_date,end_date")
          .eq("company_id", companyId).eq("status", "approved").lte("start_date", end).gte("end_date", effectiveStart)
          .order("start_date").order("id").range(a, b)),
        supabase.from("company_wage_preferences").select("base_hourly_rate").eq("company_id", companyId).maybeSingle(),
        readAllRows((a, b) => supabase.rpc("wage_rule_premiums", {
          target_company: companyId, period_start: effectiveStart, period_end: end,
        }).order("job_id").range(a, b)),
      ]);
      if (preference.error) throw new Error(preference.error.message);
      return { staff, jobs, rates, absences, base: preference.data?.base_hourly_rate ?? null, premiums };
    },
  });

  const visibleJobs = (summary.data?.jobs ?? []).filter(job =>
    (!employee || employee === job.staff_id) &&
    (flags.excluded || !job.is_excluded) &&
    appliedTypes.includes(job.work_type ?? "Unclassified"),
  );
  const rates = new Map(summary.data?.rates.map(row => [row.staff_id, row.hourly_rate]));
  const premiums = new Map(summary.data?.premiums.map(row => [row.job_id, row]));
  const employees = new Map(summary.data?.staff.map(row => [row.id, row]));
  const groups = new Map<string, { staffId: string; workplace: string | null; jobs: Job[]; hours: number; supplement: number; premiumHours: number }>();
  for (const job of visibleJobs) {
    const key = JSON.stringify([job.staff_id, job.client_id]);
    const group = groups.get(key) ?? { staffId: job.staff_id, workplace: job.workplace, jobs: [], hours: 0, supplement: 0, premiumHours: 0 };
    group.jobs.push(job);
    group.hours += Number(job.hours);
    const premium = premiums.get(job.job_id);
    if (premium) group.premiumHours += Number(premium.premium_hours) + (flags.overtime ? Number(premium.overtime_premium_hours) : 0);
    group.supplement += supplements.reduce((total, kind) => total + (flags[kind] ? Number(job[kind]) : 0), 0);
    groups.set(key, group);
  }
  const staffWithJobs = new Set(visibleJobs.map(job => job.staff_id));
  const staffOnLeave = new Set(summary.data?.absences.map(row => row.staff_id));
  for (const staff of summary.data?.staff ?? []) {
    if ((employee && staff.id !== employee) || staffWithJobs.has(staff.id)) continue;
    if (staffOnLeave.has(staff.id) || (flags.empty && (staff.is_active || staff.id === employee))) {
      groups.set(staff.id, { staffId: staff.id, workplace: null, jobs: [], hours: 0, supplement: 0, premiumHours: 0 });
    }
  }
  const rows = [...groups.entries()].sort(([, a], [, b]) => {
    const nameOrder = (employees.get(a.staffId)?.name ?? "").localeCompare(employees.get(b.staffId)?.name ?? "");
    if (sort === "hours") return b.hours - a.hours || nameOrder;
    if (sort === "workplace") return (a.workplace ?? "").localeCompare(b.workplace ?? "") || nameOrder;
    return nameOrder || (a.workplace ?? "").localeCompare(b.workplace ?? "");
  });
  const currentPage = Math.min(page, Math.max(0, Math.ceil(rows.length / 25) - 1));

  return <section className="space-y-5">
    <h1 className="text-[28px] font-bold">Wages &amp; Hours</h1>
    <div className={`${card} space-y-4 p-5`}>
      <div className="flex flex-wrap items-end gap-4">
        <fieldset>
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide">Period</legend>
          <div className="flex flex-wrap items-center gap-2">
            <input aria-label="Period start" className={field} type="date" value={start} onChange={event => { setStart(event.target.value); setPage(0); }} />
            <span aria-hidden>–</span>
            <input aria-label="Period end" className={field} type="date" value={end} onChange={event => { setEnd(event.target.value); setPage(0); }} />
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-xs font-semibold uppercase">Sort by
          <select className={field} value={sort} onChange={event => { setSort(event.target.value); setPage(0); }}>
            <option value="employee">Employee</option><option value="workplace">Workplace</option><option value="hours">Hours</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold uppercase">Show
          <select className={field} value={employee} onChange={event => { setEmployee(event.target.value); setPage(0); }}>
            <option value="">All employees</option>
            {summary.data?.staff.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(options) as (keyof typeof options)[]).map(key => (
          <label key={key} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
            <input type="checkbox" className="size-4 accent-primary" checked={flags[key]}
              onChange={event => { setFlags({ ...flags, [key]: event.target.checked }); setPage(0); }} />
            {options[key]}
          </label>
        ))}
      </div>
    </div>
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(230px,1fr)]">
      <div className={`${card} min-w-0`}>
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
          <h2 className="font-semibold">Listing Information</h2>
          {valid && <span className="text-xs text-muted-foreground">Period {dateLabel(effectiveStart)} – {dateLabel(end)}</span>}
        </header>
        {!valid ? <p role="alert" className="p-4">Choose a valid date range of up to 361 days.</p> :
          summary.isPending ? <p role="status" className="p-4">Loading worked hours…</p> :
          summary.error ? <p role="alert" className="p-4 text-danger">{summary.error.message}</p> :
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[555px] text-left text-sm">
                <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground"><tr>
                  {["Employee", "Workplace", "Hours", "Supplement", "Total"].map(label => <th scope="col" key={label} className="p-3">{label}</th>)}
                </tr></thead>
                <tbody>{rows.slice(currentPage * 25, (currentPage + 1) * 25).map(([key, row]) => {
                  const name = employees.get(row.staffId)?.name ?? "Employee unavailable";
                  const override = rates.get(row.staffId);
                  const rate = override ?? summary.data.base;
                  const supplement = row.supplement + row.premiumHours * (rate ?? 0);
                  const absences = summary.data.absences.filter(a => a.staff_id === row.staffId);
                  return <tr key={key} className="border-t border-border align-top">
                    <td className="p-3">
                      <details>
                        <summary className="flex cursor-pointer list-none items-center gap-1 font-semibold">{name}<ChevronDown className="size-3" /></summary>
                        <div className="mt-2 space-y-2">
                          <RateForm key={`${start}-${end}-${override}`} companyId={companyId} staffId={row.staffId} start={start} end={end} rate={override} />
                          {row.jobs.map(job => <button key={job.job_id} type="button" className="flex items-center gap-1 text-left text-xs text-primary underline"
                            onClick={() => setEditingJob(job)}><SlidersHorizontal className="size-3 shrink-0" />{job.title} · {job.work_type ?? "Unclassified"}</button>)}
                        </div>
                      </details>
                      {absences.map(a => <p key={a.id} className="mt-1 text-xs text-warning-strong">{absenceTypeLabel(a.absence_type)} · {absenceDate(a.start_date < effectiveStart ? effectiveStart : a.start_date)} – {absenceDate(a.end_date > end ? end : a.end_date)}</p>)}
                    </td>
                    <td className="p-3">{row.workplace ?? "—"}</td>
                    <td className="p-3 tabular-nums">{hoursFormat.format(row.hours)}h
                      {row.jobs.some(job => job.status !== "completed") && <p className="text-xs text-muted-foreground">Includes cancelled tasks</p>}
                    </td>
                    <td className="p-3 tabular-nums">{supplement ? <span className="rounded bg-success-soft px-2 py-1 text-success-strong">+{money.format(supplement)}</span> : "—"}</td>
                    <td className="p-3 font-semibold tabular-nums">{rate === null && row.hours > 0 ? "Rate required" : money.format(row.hours * (rate ?? 0) + supplement)}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
            {!rows.length && <p className="p-8 text-center text-sm text-muted-foreground">No records in this period. Enable empty values to set employee rates.</p>}
            {rows.length > 25 && <footer className="flex justify-end gap-2 p-3">
              <Button variant="outline" disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>Previous</Button>
              <Button variant="outline" disabled={(currentPage + 1) * 25 >= rows.length} onClick={() => setPage(currentPage + 1)}>Next</Button>
            </footer>}
            <p className="border-t border-border p-4 text-xs text-muted-foreground">Totals use completed check-ins, the employee rate or company base rate, the highest applicable premium, and selected fixed supplements. Overtime is counted per London Monday–Sunday week. Cancelled tasks contribute zero hours. Approved absences are informational.</p>
          </>}
      </div>
      <aside className={`${card} space-y-4 p-4`} aria-label="Work type filters">
        <header className="flex items-center justify-between gap-2"><h2 className="font-semibold">Show work types</h2>
          <Button variant="link" size="sm" onClick={() => setSelectedTypes(workTypes)}>Select all</Button></header>
        <div className="space-y-3">{workTypes.map(type => <label key={type} className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={selectedTypes.includes(type)}
            onChange={event => setSelectedTypes(current => event.target.checked ? [...current, type] : current.filter(value => value !== type))} />{type}
        </label>)}</div>
        <Button className="w-full bg-ink text-ink-foreground hover:bg-ink/90" onClick={() => { setAppliedTypes(selectedTypes); setPage(0); }}>Apply filters</Button>
      </aside>
    </div>
    {editingJob && <JobDetails companyId={companyId} job={editingJob} close={() => setEditingJob(null)} />}
  </section>;
}

function RateForm({ companyId, staffId, start, end, rate }: { companyId: string; staffId: string; start: string; end: string; rate?: number | undefined }) {
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: async (hourlyRate: number) => {
      const { error } = await supabase.from("staff_wages").upsert({
        company_id: companyId, staff_id: staffId, hourly_rate: hourlyRate, period_start: start, period_end: end,
      }, { onConflict: "company_id,staff_id,period_start,period_end" });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance", companyId] }),
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save.mutate(Number(new FormData(event.currentTarget).get("rate")));
  }
  return <form onSubmit={submit} className="space-y-1">
    <label className="block text-xs">Employee rate override (GBP)
      <input className={`${field} mt-1 block w-24`} name="rate" type="number" required min="0" max="99999999.99" step="0.01" defaultValue={rate ?? ""} />
    </label>
    <Button type="submit" size="sm" variant="outline" disabled={save.isPending}>Save rate</Button>
    {save.error && <p role="alert" className="text-xs text-danger">{save.error.message}</p>}
  </form>;
}

function JobDetails({ companyId, job, close }: { companyId: string; job: Job; close: () => void }) {
  const queryClient = useQueryClient();
  const detail = useQuery({
    queryKey: ["job-wage-details", companyId, job.job_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_wage_details").select("*")
        .eq("company_id", companyId).eq("job_id", job.job_id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
  const save = useMutation({
    mutationFn: async (form: FormData) => {
      const { error } = await supabase.from("job_wage_details").upsert({
        company_id: companyId, job_id: job.job_id,
        work_type: String(form.get("work_type") ?? "") || null, is_excluded: form.has("is_excluded"),
        periodic: Number(form.get("periodic")), overtime: Number(form.get("overtime")),
        personal: Number(form.get("personal")), special: Number(form.get("special")),
      }, { onConflict: "company_id,job_id" });
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["job-wage-details", companyId, job.job_id] }),
        queryClient.invalidateQueries({ queryKey: ["finance", companyId] }),
      ]);
      close();
    },
  });
  return <Dialog open onOpenChange={open => { if (!open && !save.isPending) close(); }}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto">
      <DialogHeader><DialogTitle>{job.title}</DialogTitle><DialogDescription>Work type and fixed GBP supplements assigned to this job.</DialogDescription></DialogHeader>
      {detail.isPending ? <p>Loading job details…</p> : detail.error ? <p role="alert">{detail.error.message}</p> :
        <form className="space-y-3" onSubmit={event => { event.preventDefault(); save.mutate(new FormData(event.currentTarget)); }}>
          <label className="grid gap-1 text-sm">Work type
            <select className={field} name="work_type" defaultValue={detail.data?.work_type ?? ""}>
              <option value="">Unclassified</option>{workTypes.filter(type => type !== "Unclassified").map(type => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_excluded" defaultChecked={detail.data?.is_excluded ?? false} /> Exclude from the default listing</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {supplements.map(kind => <label key={kind} className="grid gap-1 text-sm capitalize">{kind} (GBP)
              <input name={kind} className={field} type="number" min="0" max="99999999.99" step="0.01" required defaultValue={detail.data?.[kind] ?? 0} />
            </label>)}
          </div>
          {save.error && <p role="alert" className="text-sm text-danger">{save.error.message}</p>}
          <Button type="submit" disabled={save.isPending}>Save job details</Button>
        </form>}
    </DialogContent>
  </Dialog>;
}
