import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Clock3, LogIn, LogOut, Plus, Square } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — CleanFlow UK" },
      { name: "description", content: "Live job schedule with check-in, check-out and checklists." },
      { property: "og:title", content: "Jobs — CleanFlow UK" },
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
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="text-[13px] text-muted-foreground">Loading…</div>;
  if (!session)
    return (
      <div className={cn(card, "p-10 text-center")}>
        <div className="text-[15px] font-semibold">Sign in to view jobs</div>
        <p className="mt-1 text-[13px] text-muted-foreground">Your job schedule is private to your team.</p>
        <Link to="/auth" className="mt-5 inline-flex h-9 items-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90">
          Sign in
        </Link>
      </div>
    );
  return <JobsBoard />;
}

function JobsBoard() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const jobsQ = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, clients(name), staff(name)")
        .order("scheduled_date", { ascending: true });
      if (error) throw error;
      return data as unknown as Job[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`jobs-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () =>
        qc.invalidateQueries({ queryKey: ["jobs"] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"jobs"> }) => {
      const { error } = await supabase.from("jobs").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const jobs = jobsQ.data ?? [];

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

      {jobsQ.isError && <div className={cn(card, "p-6 text-[13px] text-danger")}>Couldn't load jobs: {(jobsQ.error as Error).message}</div>}
      {jobsQ.isLoading && <div className="text-[13px] text-muted-foreground">Loading jobs…</div>}
      {!jobsQ.isLoading && jobs.length === 0 && (
        <div className={cn(card, "p-10 text-center text-[13px] text-muted-foreground")}>No jobs scheduled yet. Add your first job.</div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => {
          const checklist = Array.isArray(job.checklist) ? job.checklist : [];
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
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusStyle[job.status] ?? "bg-muted text-muted-foreground")}>
                  {statusLabel[job.status] ?? job.status}
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
                  {checklist.map((item, i) => (
                    <button
                      key={i}
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
                  disabled={!!job.check_in_at}
                  onClick={() => update.mutate({ id: job.id, patch: { check_in_at: new Date().toISOString(), status: "in_progress" } })}
                  className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                >
                  <LogIn className="h-4 w-4" /> Check in
                </button>
                <button
                  disabled={!job.check_in_at || !!job.check_out_at}
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

      <AddJobDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function AddJobDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", client_id: "", staff_id: "", scheduled_date: "", notes: "" });

  const people = useQuery({
    queryKey: ["job-pickers"],
    enabled: open,
    queryFn: async () => {
      const [c, s] = await Promise.all([
        supabase.from("clients").select("id, name").order("name"),
        supabase.from("staff").select("id, name").order("name"),
      ]);
      if (c.error) throw c.error;
      if (s.error) throw s.error;
      return { clients: c.data, staff: s.data };
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("jobs").insert({
        title: form.title,
        client_id: form.client_id || null,
        staff_id: form.staff_id || null,
        scheduled_date: new Date(form.scheduled_date).toISOString(),
        notes: form.notes || null,
        checklist: DEFAULT_CHECKLIST,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job added");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      setForm({ title: "", client_id: "", staff_id: "", scheduled_date: "", notes: "" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader><DialogTitle>Add New Job</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
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
          <button disabled={create.isPending} className="h-10 w-full rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {create.isPending ? "Saving…" : "Add job"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
