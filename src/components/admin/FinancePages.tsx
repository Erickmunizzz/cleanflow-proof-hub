import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { WageListing } from "./WageListing";
import { adminRecordsOptions } from "@/lib/admin-records.query";
const input = "h-10 rounded-lg border border-input bg-background px-3 text-sm";
const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
const statuses = ["draft", "sent", "paid", "overdue"] as const;
function useFinanceRealtime(companyId: string) {
  const client = useQueryClient();
  useEffect(() => {
    const refresh = () => { void client.invalidateQueries({ queryKey: ["finance", companyId] }); void client.invalidateQueries({ queryKey: ["admin-records"] }); };
    const channel = supabase.channel(`finance-${companyId}`);
    for (const table of ["invoices", "staff_wages", "job_wage_details", "staff_absences", "jobs", "staff", "clients"]) {
      channel.on("postgres_changes", { event: "INSERT", schema: "public", table, filter: `company_id=eq.${companyId}` }, refresh)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table, filter: `company_id=eq.${companyId}` }, refresh)
        .on("postgres_changes", { event: "DELETE", schema: "public", table }, refresh);
    }
    channel.subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
    return () => { void supabase.removeChannel(channel); };
  }, [companyId, client]);
}
function Pagination({ page, count, setPage }: { page: number; count: number; setPage: (page: number) => void }) {
  return <footer className="flex items-center justify-between p-3 text-sm"><span>{count} records</span><div className="flex gap-2"><Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="outline" disabled={(page + 1) * 25 >= count} onClick={() => setPage(page + 1)}>Next</Button></div></footer>;
}
export function InvoicesPage() {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  const { data: records } = useSuspenseQuery(adminRecordsOptions);
  const client = useQueryClient();
  useFinanceRealtime(owner.companyId);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const invoices = useQuery({
    queryKey: ["finance", owner.companyId, "invoices", status, page],
    queryFn: async () => {
      let query = supabase.from("invoices").select("*", { count: "exact" }).eq("company_id", owner.companyId);
      if (status) query = query.eq("status", status);
      const result = await query.order("created_at", { ascending: false }).order("id", { ascending: false }).range(page * 25, page * 25 + 24);
      if (result.error) throw new Error(result.error.message);
      return { rows: result.data, count: result.count ?? 0 };
    },
  });
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (saving) return;
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const number = String(form.get("number") ?? "").trim();
    if (!number || !Number.isFinite(amount) || amount < 0) { setError("Enter a valid invoice number and amount."); return; }
    setSaving(true); setError("");
    try {
      const result = await supabase.from("invoices").insert({ company_id: owner.companyId, customer_id: String(form.get("customer")), invoice_number: number, amount, status: String(form.get("status")), due_date: String(form.get("due")) });
      if (result.error) throw new Error(result.error.message);
      void client.invalidateQueries({ queryKey: ["finance", owner.companyId] });
      setPage(0); setOpen(false); toast.success("Invoice created");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Invoice could not be saved."); }
    finally { setSaving(false); }
  }
  async function updateStatus(id: string, next: string) {
    setSaving(true); setError("");
    try {
      const result = await supabase.from("invoices").update({ status: next }).eq("id", id).eq("company_id", owner.companyId).select("id").single();
      if (result.error) throw new Error(result.error.message);
      await client.invalidateQueries({ queryKey: ["finance", owner.companyId] });
      toast.success("Invoice updated");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Invoice could not be updated."); }
    finally { setSaving(false); }
  }
  return <section className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-[28px] font-bold">Invoicing</h1><Button onClick={() => { setError(""); setOpen(true); }} className="rounded-xl"><Plus />Create Invoice</Button></header>
    <label className="flex items-center gap-3 text-sm">Status<select className={input} value={status} onChange={event => { setStatus(event.target.value); setPage(0); }}><option value="">All statuses</option>{statuses.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    <p className="text-sm text-muted-foreground">Amounts in GBP. Status changes record your workflow; they do not send invoices or collect payments.</p>
    {error && !open && <p role="alert" className="text-destructive">{error}</p>}
    {invoices.isPending ? <p>Loading invoices…</p> : invoices.error ? <p role="alert" className="text-destructive">{invoices.error.message}</p> : <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-surface-2"><tr>{["Invoice", "Customer", "Amount", "Due date", "Status"].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{invoices.data.rows.map(row => <tr key={row.id} className="border-t border-border"><td className="p-4 font-semibold">{row.invoice_number}</td><td className="p-4">{records.clients.find(c => c.id === row.customer_id)?.name ?? "Customer unavailable"}</td><td className="p-4">{money(row.amount)}</td><td className="p-4">{row.due_date}</td><td className="p-4"><select aria-label={`Status for ${row.invoice_number}`} className={input} value={row.status} disabled={saving} onChange={event => void updateStatus(row.id, event.target.value)}>{statuses.map(value => <option key={value}>{value}</option>)}</select></td></tr>)}</tbody></table>
      {!invoices.data.rows.length && <p className="p-8 text-center text-muted-foreground">No invoices found.</p>}<Pagination page={page} count={invoices.data.count} setPage={setPage} />
    </div>}
    <Dialog open={open} onOpenChange={value => { if (!saving) setOpen(value); }}><DialogContent><DialogHeader><DialogTitle>Create Invoice</DialogTitle><DialogDescription>Create an invoice for a customer in your company.</DialogDescription></DialogHeader><form onSubmit={event => void create(event)} className="grid gap-4">
      <label className="grid gap-1 text-sm">Customer<select className={input} name="customer" required defaultValue=""><option value="" disabled>Select customer</option>{records.clients.filter(c => !c.is_archived).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="grid gap-1 text-sm">Invoice number<input className={input} name="number" required maxLength={80} /></label>
      <label className="grid gap-1 text-sm">Amount (GBP)<input className={input} name="amount" type="number" required min="0" step="0.01" max="9999999999.99" /></label>
      <label className="grid gap-1 text-sm">Due date<input className={input} name="due" type="date" required /></label>
      <label className="grid gap-1 text-sm">Status<select className={input} name="status">{statuses.map(value => <option key={value}>{value}</option>)}</select></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Invoice"}</Button>
    </form></DialogContent></Dialog>
  </section>;
}

export function WagesPage() {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  useFinanceRealtime(owner.companyId);
  return <WageListing companyId={owner.companyId} />;
}
