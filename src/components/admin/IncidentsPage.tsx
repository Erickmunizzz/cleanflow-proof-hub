import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { adminRecordsOptions } from "@/lib/admin-records.query";
import type { Tables } from "@/integrations/supabase/types";

type Incident = Tables<"incidents">;
const pageSize = 25;
const fmt = (value: string | null) => value ? new Date(value).toLocaleString("en-GB") : "—";

export function IncidentsPage() {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  const { data: adminData } = useSuspenseQuery(adminRecordsOptions);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobId, setJobId] = useState("");
  const [type, setType] = useState("Hazard");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const incidentsQuery = useQuery({
    queryKey: ["incidents", owner.companyId, page],
    queryFn: async () => {
      const { data, error, count } = await supabase.from("incidents").select("*", { count: "exact" })
        .eq("company_id", owner.companyId).order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) throw new Error(error.message);
      return { rows: (data ?? []) as Incident[], count: count ?? 0 };
    },
  });
  const profilesQuery = useQuery({
    queryKey: ["incident-reporters", owner.companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name").eq("company_id", owner.companyId);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase.channel(`incidents-${owner.companyId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "incidents",
        filter: `company_id=eq.${owner.companyId}`,
      }, () => { void queryClient.invalidateQueries({ queryKey: ["incidents", owner.companyId] }); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [owner.companyId, queryClient]);

  async function submitIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setActionError("");
    const { error } = await supabase.from("incidents").insert({
      company_id: owner.companyId,
      job_id: jobId,
      type: type.trim(),
      description: description.trim(),
      reported_by: owner.ownerId,
    });
    setSaving(false);
    if (error) { setActionError(error.message); return; }
    setModalOpen(false);
    setType("Hazard");
    setDescription("");
    setPage(0);
    await queryClient.invalidateQueries({ queryKey: ["incidents", owner.companyId] });
  }

  const jobs = adminData.jobs;
  const jobById = new Map(jobs.map(job => [job.id, job]));
  const reporterById = new Map((profilesQuery.data ?? []).map(profile => [profile.id, profile.full_name]));
  const incidents = incidentsQuery.data?.rows ?? [];
  const total = incidentsQuery.data?.count ?? 0;

  return <section className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-[28px] font-bold">Safety &amp; Compliance</h1><p className="mt-1 text-sm text-muted-foreground">Review scheduled services and record safety incidents.</p></div>
      <Button onClick={() => { setJobId(jobs[0]?.id ?? ""); setActionError(""); setModalOpen(true); }} disabled={!jobs.length} className="rounded-xl"><Plus className="mr-2 size-4" />Report Incident</Button>
    </header>

    <section className="space-y-3" aria-labelledby="safety-jobs-title">
      <div><h2 id="safety-jobs-title" className="text-lg font-semibold">Services (Jobs)</h2><p className="text-sm text-muted-foreground">Jobs in this company workspace.</p></div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-surface-2 text-muted-foreground"><tr>{["Job", "Customer / Staff", "Status", "Scheduled"].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
          <tbody>{jobs.map(job => <tr key={job.id} className="border-t border-border">
            <td className="px-4 py-4 font-semibold">{job.title}</td><td className="px-4 py-4">{job.clients?.name ?? "No customer"}<div className="text-xs text-muted-foreground">{job.staff?.name ?? "Unassigned"}</div></td>
            <td className="px-4 py-4"><span className="rounded-full bg-primary-soft px-2 py-1 text-xs capitalize text-primary">{job.status.replaceAll("_", " ")}</span></td><td className="px-4 py-4">{fmt(job.scheduled_date)}</td>
          </tr>)}</tbody>
        </table>
        {!jobs.length && <p className="py-10 text-center text-sm text-muted-foreground">No jobs recorded.</p>}
      </div>
    </section>

    <section className="space-y-3" aria-labelledby="incidents-title">
      <div><h2 id="incidents-title" className="text-lg font-semibold">Reported Incidents</h2><p className="text-sm text-muted-foreground">Incident reports are scoped to this company and update in real time.</p></div>
      {actionError && !modalOpen && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{actionError}</p>}
      {incidentsQuery.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading incidents…</p>
        : incidentsQuery.error ? <p role="alert" className="py-8 text-center text-sm text-destructive">{incidentsQuery.error.message}</p>
        : <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-surface-2 text-muted-foreground"><tr>{["Type", "Job", "Description", "Reported by", "Reported"].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
            <tbody>{incidents.map(incident => <tr key={incident.id} className="border-t border-border">
              <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-semibold"><AlertTriangle className="size-4 text-primary" />{incident.type}</span></td>
              <td className="px-4 py-4">{jobById.get(incident.job_id)?.title ?? "Job unavailable"}</td>
              <td className="max-w-sm whitespace-pre-wrap break-words px-4 py-4">{incident.description}</td>
              <td className="px-4 py-4">{reporterById.get(incident.reported_by) ?? "Workspace member"}</td>
              <td className="px-4 py-4">{fmt(incident.created_at)}</td>
            </tr>)}</tbody>
          </table>
          {!incidents.length && <p className="py-10 text-center text-sm text-muted-foreground">No incidents reported.</p>}
          <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>{total ? `Showing ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, total)} of ${total}` : "No records"}</span>
            <div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(value => value - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></Button><Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= total} onClick={() => setPage(value => value + 1)} aria-label="Next page"><ChevronRight className="size-4" /></Button></div>
          </footer>
        </div>}
    </section>

    {modalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false); }}>
      <form role="dialog" aria-modal="true" aria-labelledby="incident-form-title" onSubmit={event => void submitIncident(event)} className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xl">
        <header className="flex items-center justify-between"><h2 id="incident-form-title" className="text-xl font-semibold">Report Incident</h2><Button type="button" variant="ghost" size="icon" onClick={() => setModalOpen(false)} aria-label="Close"><X className="size-4" /></Button></header>
        <label className="grid gap-1 text-sm font-medium">Related job<select required value={jobId} onChange={event => setJobId(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 font-normal"><option value="">Select a job</option>{jobs.map(job => <option key={job.id} value={job.id}>{job.title} — {job.clients?.name ?? "No customer"}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Incident type<select value={type} onChange={event => setType(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 font-normal">{["Hazard", "Injury", "Property damage", "Equipment issue", "Other"].map(option => <option key={option}>{option}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Description<textarea required rows={4} maxLength={5000} value={description} onChange={event => setDescription(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 font-normal" placeholder="Describe what happened and any immediate action taken." /></label>
        {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
        <footer className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving || !jobId}>{saving ? "Submitting…" : "Submit Report"}</Button></footer>
      </form>
    </div>}
  </section>;
}
