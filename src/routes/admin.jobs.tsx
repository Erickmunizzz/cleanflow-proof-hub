import { LIMIT_MESSAGE } from "@/lib/subscriptions";
import { useSubscription } from "@/components/admin/SubscriptionProvider";
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Clock3, LogIn, LogOut, Plus, Square } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ownerContextOptions } from "@/lib/owner-context";
import { AdminDataBoundary } from "@/components/admin/AdminSession";
import { Button } from "@/components/ui/button";
import { checklistSummary } from "@/lib/job-summary";
import { cancelledJobStatuses } from "@/lib/overview-metrics";
import { readAllRows } from "@/lib/supabase-pages";

export const Route = createFileRoute("/admin/jobs")({
  validateSearch: (search: Record<string, unknown>): { status?: "cancelled" } =>
    search["status"] === "cancelled" ? { status: "cancelled" } : {},
  head: () => ({
    meta: [
      { title: "Jobs — Cleanma UK" },
      { name: "description", content: "Live job schedule with check-in, check-out and checklists." },
      { property: "og:title", content: "Jobs — Cleanma UK" },
      { property: "og:description", content: "Live job schedule with check-in, check-out and checklists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobsPage,
});

type ChecklistItem = { label: string; done: boolean };
type Job = {
  id: string; title: string; status: string; scheduled_date: string;
  check_in_at: string | null; check_out_at: string | null; notes: string | null;
  checklist: ChecklistItem[];
  clients: { name: string } | null; staff: { name: string } | null;
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  "Empty bins", "Vacuum floors", "Clean toilets", "Wipe surfaces", "Restock supplies",
].map((label) => ({ label, done: false }));

const card = "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]";
const input = "h-10 w-full rounded-xl border border-border bg-card px-3 text-[13.5px] outline-none focus:border-primary";
const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

const statusStyle: Record<string, string> = {
  scheduled: "bg-primary-soft text-primary",
  in_progress: "bg-warning-soft text-warning-strong",
  completed: "bg-success-soft text-success-strong",
};
const statusLabel: Record<string, string> = { scheduled: "Scheduled", in_progress: "In progress", completed: "Completed" };

function JobsPage() {
  return <AdminDataBoundary><JobsBoard /></AdminDataBoundary>;
}

function JobsBoard() {
  const { status } = Route.useSearch();
  const subscription = useSubscription();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const ownerContextQ = useQuery(ownerContextOptions);

  const companyId = ownerContextQ.data?.companyId;
  const jobsQ = useQuery({
    queryKey: ["jobs", companyId],
    enabled: Boolean(companyId),
    queryFn: async () => {
      if (!companyId) throw new Error("Owner company is unavailable.");
      const data = await readAllRows((a, b) => supabase
        .from("jobs")
        .select("*, clients!jobs_customer_same_company_fkey(name), staff!jobs_staff_same_company_fkey(name)")
        .eq("company_id", companyId)
        .order("scheduled_date", { ascending: true }).order("id").range(a, b));
      return data.map(job => ({ ...job, checklist: checklistSummary(job.checklist).items })) as Job[];
    },
  });

  useEffect(() => {
    if (!companyId) return;
    const channel = supabase
      .channel(`owner-jobs-${companyId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs", filter: `company_id=eq.${companyId}` }, () =>
        qc.invalidateQueries({ queryKey: ["jobs", companyId] }),
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [companyId, qc]);

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"jobs"> }) => {
      if (!companyId) throw new Error("Owner workspace is unavailable.");
      const { error } = await supabase.from("jobs").update(patch).eq("id", id).eq("company_id", companyId).select("id").single();
      if (error) throw error;
    },
    onSuccess: () => Promise.all([qc.invalidateQueries({ queryKey: ["jobs"] }), qc.invalidateQueries({ queryKey: ["admin-records"] }), qc.invalidateQueries({ queryKey: ["owner-overview"] })]),
    onError: (e: Error) => toast.error(e.message),
  });

  if (ownerContextQ.isLoading) return <div className="text-[13px] text-muted-foreground">Loading owner workspace…</div>;
  if (ownerContextQ.isError || !companyId) return <div role="alert" className="space-y-4"><h1 className="text-[28px] font-bold">Jobs</h1><p className="text-sm text-danger">{ownerContextQ.error?.message ?? "Your workspace is unavailable."}</p><Button onClick={() => void ownerContextQ.refetch()}>Try again</Button></div>;

  const jobs = (jobsQ.data ?? []).filter(job => !status || cancelledJobStatuses.includes(job.status));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-none tracking-tight">Jobs</h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">Live job schedule • updates automatically</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add New Job
        </button>
      </div>

      {status === "cancelled" && <div className="flex items-center gap-3 text-sm"><span>Cancelled jobs</span><Button asChild variant="outline" size="sm"><Link to="/admin/jobs" search={{}}>Show all jobs</Link></Button></div>}

      {jobsQ.isError && <div role="alert" className={cn(card, "space-y-3 p-6 text-[13px] text-danger")}>Couldn't load jobs: {jobsQ.error.message}<Button variant="outline" onClick={() => void jobsQ.refetch()}>Try again</Button></div>}
      {jobsQ.isLoading && <div className="text-[13px] text-muted-foreground">Loading jobs…</div>}
      {!jobsQ.isLoading && !jobsQ.isError && jobs.length === 0 && (
        <div className={cn(card, "p-10 text-center text-[13px] text-muted-foreground")}>{status === "cancelled" ? "No cancelled jobs." : "No jobs scheduled yet. Add your first job."}</div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => {
          const checklist = job.checklist;
          const status = job.status.toLowerCase().replaceAll("-", "_");
          const done = checklist.filter((c) => c.done).length;
          return (
            <div key={job.id} className={cn(card, "space-y-4 p-5")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold">{job.title}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {job.clients?.name ?? "No client"} • {job.staff?.name ?? "Unassigned"}
                  </div>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", statusStyle[status] ?? "bg-muted text-muted-foreground")}>
                  {statusLabel[status] ?? job.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[12px]">
                <div><div className="text-muted-foreground">Scheduled</div><div className="font-medium">{fmt(job.scheduled_date)}</div></div>
                <div><div className="text-muted-foreground">Check-in</div><div className="font-medium">{fmt(job.check_in_at)}</div></div>
                <div><div className="text-muted-foreground">Check-out</div><div className="font-medium">{fmt(job.check_out_at)}</div></div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-[12px] font-semibold">
                  <span>Checklist</span><span className="text-muted-foreground">{done}/{checklist.length}</span>
                </div>
                <div className="space-y-1">
                  {!checklist.length && <p className="text-sm text-muted-foreground">No tasks recorded for this job.</p>}
                  {checklist.map((item, i) => (
                    <button
                      key={i}
                      disabled={update.isPending}
                      onClick={() => {
                        const next = checklist.map((c, j) => (j === i ? { ...c, done: !c.done } : c));
                        update.mutate({ id: job.id, patch: { checklist: next } });
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                    >
                      {item.done ? <CheckSquare className="h-4 w-4 text-success" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                      <span className={cn(item.done && "text-muted-foreground line-through")}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {job.notes && <p className="text-[12.5px] text-muted-foreground">{job.notes}</p>}

              <div className="flex gap-2">
                <button
                  disabled={update.isPending || cancelledJobStatuses.includes(job.status) || !!job.check_in_at}
                  onClick={() => update.mutate({ id: job.id, patch: { check_in_at: new Date().toISOString(), status: "in_progress" } })}
                  className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                >
                  <LogIn className="h-4 w-4" /> Check in
                </button>
                <button
                  disabled={update.isPending || cancelledJobStatuses.includes(job.status) || !job.check_in_at || !!job.check_out_at}
                  onClick={() => update.mutate({ id: job.id, patch: { check_out_at: new Date().toISOString(), status: "completed" } })}
                  className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-[13px] font-semibold hover:bg-accent disabled:opacity-40"
                >
                  <LogOut className="h-4 w-4" /> Check out
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AddJobDialog open={open} onOpenChange={setOpen} companyId={companyId} />
    </div>
  );
}

function AddJobDialog({ open, onOpenChange, companyId }: { open: boolean; onOpenChange: (v: boolean) => void; companyId: string }) {
  const subscription = useSubscription();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", client_id: "", staff_id: "", scheduled_date: "", notes: "" });

  const people = useQuery({
    queryKey: ["job-pickers", companyId],
    enabled: open,
    queryFn: async () => {
      const [c, s] = await Promise.all([
        readAllRows((a, b) => supabase.from("clients").select("id, name").eq("company_id", companyId).order("name").order("id").range(a, b)),
        readAllRows((a, b) => supabase.from("staff").select("id, name").eq("company_id", companyId).eq("is_active", true).not("profile_id", "is", null).order("name").order("id").range(a, b)),
      ]);
      return { clients: c, staff: s };
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const scheduled = new Date(form.scheduled_date);
      if (!Number.isFinite(scheduled.getTime())) throw new Error("Enter a valid scheduled date.");
      const month = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(scheduled);
      if (!await subscription.requireCapacity("jobs", month)) throw new Error(LIMIT_MESSAGE);
      const { error } = await supabase.from("jobs").insert({
        company_id: companyId,
        title: form.title,
        client_id: form.client_id || null,
        staff_id: form.staff_id || null,
        scheduled_date: scheduled.toISOString(),
        notes: form.notes || null,
        checklist: DEFAULT_CHECKLIST,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job added");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-records"] });
      qc.invalidateQueries({ queryKey: ["owner-overview"] });
      setForm({ title: "", client_id: "", staff_id: "", scheduled_date: "", notes: "" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl">
        <DialogHeader><DialogTitle>Add New Job</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
          {people.isLoading && <p className="text-sm text-muted-foreground">Loading customers and staff…</p>}
          {people.isError && <div role="alert" className="space-y-2 text-sm text-danger"><p>Couldn't load customers and staff: {people.error.message}</p><Button type="button" variant="outline" onClick={() => void people.refetch()}>Try again</Button></div>}
          {people.isSuccess && !people.data.clients.length && <p className="text-sm text-muted-foreground">No customers found.</p>}
          {people.isSuccess && !people.data.staff.length && <p className="text-sm text-muted-foreground">No active linked cleaner accounts found.</p>}
          <input className={input} required placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className={input} value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
            <option value="">Select client</option>
            {people.data?.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className={input} value={form.staff_id} onChange={(e) => setForm({ ...form, staff_id: e.target.value })}>
            <option value="">Select staff member</option>
            {people.data?.staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <label className="block text-[12px] text-muted-foreground">
            <span className="mb-1 flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Scheduled date</span>
            <input className={input} type="datetime-local" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
          </label>
          <textarea className={cn(input, "h-20 py-2")} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button disabled={create.isPending || !people.isSuccess} className="h-10 w-full rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {create.isPending ? "Saving…" : "Add job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
