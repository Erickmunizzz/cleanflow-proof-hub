import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";

export function AddReportButton() {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [error, setError] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (!title.trim() || !description.trim()) { setError("Enter a title and description."); return; }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const { error: insertError } = await supabase.from("reports").insert({ company_id: owner.companyId, created_by: owner.ownerId, title: title.trim(), description: description.trim() });
      if (insertError) throw new Error(insertError.message);
      void queryClient.invalidateQueries({ queryKey: ["reports", owner.companyId] });
      toast.success("Report saved");
      setOpen(false);
      setTitle("");
      setDescription("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Report could not be saved."); }
    finally { busy.current = false; setSaving(false); }
  }
  return <>
    <Button className="rounded-xl" onClick={() => { setError(""); setOpen(true); }}><Plus className="size-4" />Add Report</Button>
    <Dialog open={open} onOpenChange={value => { if (!saving) setOpen(value); }}>
      <DialogContent><DialogHeader><DialogTitle>Add Report</DialogTitle><DialogDescription>Create a general management report. Record incidents in Safety &amp; Compliance.</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={event => void save(event)}>
          <label className="grid gap-1 text-sm font-medium">Title<input required maxLength={200} value={title} onChange={event => setTitle(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3" /></label>
          <label className="grid gap-1 text-sm font-medium">Description<textarea required maxLength={10000} rows={5} value={description} onChange={event => setDescription(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2" /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Report"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}

export function ReportLists() {
  return <div className="space-y-6"><ReportList table="incidents" title="Incidents from Safety & Compliance" /><ReportList table="reports" title="All Reports" /></div>;
}

function ReportList({ table, title }: { table: "incidents" | "reports"; title: string }) {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const query = useQuery({
    queryKey: [table, owner.companyId, "report-list", page],
    queryFn: async () => {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact" })
        .eq("company_id", owner.companyId).order("created_at", { ascending: false }).order("id", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) throw new Error(error.message);
      return { rows: data ?? [], count: count ?? 0 };
    },
  });
  useEffect(() => {
    const refresh = () => { void queryClient.invalidateQueries({ queryKey: [table, owner.companyId] }); };
    const channel = supabase.channel(`report-list-${table}-${owner.companyId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table, filter: `company_id=eq.${owner.companyId}` }, refresh)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table, filter: `company_id=eq.${owner.companyId}` }, refresh)
      // DELETE events cannot be filtered; refetch only the authenticated company's rows.
      .on("postgres_changes", { event: "DELETE", schema: "public", table }, refresh)
      .subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
    return () => { void supabase.removeChannel(channel); };
  }, [table, owner.companyId, queryClient]);
  const count = query.data?.count ?? 0;
  return <section className="space-y-3" aria-label={title}>
    <h2 className="text-lg font-semibold">{title}</h2>
    {table === "incidents" && <p className="text-sm text-muted-foreground">Read only. Create and manage incidents in Safety &amp; Compliance.</p>}
    {query.isLoading ? <p>Loading records…</p> : query.error ? <p role="alert" className="text-sm text-destructive">{query.error.message}</p> : <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <table className="w-full min-w-[550px] text-left text-sm"><thead className="bg-surface-2 text-muted-foreground"><tr><th className="px-4 py-3">{table === "incidents" ? "Type" : "Title"}</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Created</th></tr></thead>
        <tbody>{query.data?.rows.map(row => <tr key={row.id} className="border-t border-border"><td className="px-4 py-4 font-semibold">{"type" in row ? row.type : row.title}</td><td className="max-w-xl whitespace-pre-wrap break-words px-4 py-4">{row.description}</td><td className="px-4 py-4">{new Date(row.created_at).toLocaleString("en-GB")}</td></tr>)}</tbody>
      </table>
      {!query.data?.rows.length && <p className="py-10 text-center text-sm text-muted-foreground">{table === "incidents" ? "No incidents reported." : "No reports created."}</p>}
      <footer className="flex items-center justify-between border-t border-border px-4 py-3"><span className="text-sm text-muted-foreground">{count} records</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</Button><Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= count} onClick={() => setPage(value => value + 1)}>Next</Button></div></footer>
    </div>}
  </section>;
}
