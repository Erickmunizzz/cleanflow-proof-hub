import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { adminRecordsOptions } from "@/lib/admin-records.query";
const input = "h-10 rounded-lg border border-input bg-background px-3 text-sm";
const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
const statuses = ["draft", "sent", "paid", "overdue"] as const;
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
function useFinanceRealtime(companyId: string) {
  const client = useQueryClient();
  useEffect(() => {
    const refresh = () => { void client.invalidateQueries({ queryKey: ["finance", companyId] }); void client.invalidateQueries({ queryKey: ["admin-records"] }); };
    const channel = supabase.channel(`finance-${companyId}`);
    for (const table of ["invoices", "staff_wages", "jobs", "staff", "clients"]) {
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
  const client = useQueryClient();
  useFinanceRealtime(owner.companyId);
  const [start, setStart] = useState(() => today().slice(0, 7) + "-01");
  const [end, setEnd] = useState(today);
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const valid = Boolean(start && end && start <= end);
  const summary = useQuery({
    queryKey: ["finance", owner.companyId, "wages", start, end, page], enabled: valid,
    queryFn: async () => {
      const hours = await supabase.rpc("get_wage_hours", { target_company: owner.companyId, start_date: start, end_date: end }).range(page * 25, page * 25 + 25);
      if (hours.error) throw new Error(hours.error.message);
      const ids = hours.data.slice(0, 25).map(row => row.staff_id);
      const saved = ids.length ? await supabase.from("staff_wages").select("*").eq("company_id", owner.companyId).eq("period_start", start).eq("period_end", end).in("staff_id", ids) : { data: [], error: null };
      if (saved.error) throw new Error(saved.error.message);
      return { rows: hours.data.slice(0, 25), more: hours.data.length > 25, saved: saved.data ?? [] };
    },
  });
  async function save(event: FormEvent<HTMLFormElement>, staffId: string) {
    event.preventDefault(); if (saving) return;
    const rate = Number(new FormData(event.currentTarget).get("rate"));
    if (!Number.isFinite(rate) || rate < 0) { setError("Enter a valid hourly rate."); return; }
    setSaving(staffId); setError("");
    try {
      const result = await supabase.from("staff_wages").upsert({ company_id: owner.companyId, staff_id: staffId, hourly_rate: rate, period_start: start, period_end: end }, { onConflict: "company_id,staff_id,period_start,period_end" }).select("id").single();
      if (result.error) throw new Error(result.error.message);
      await client.invalidateQueries({ queryKey: ["finance", owner.companyId] }); toast.success("Wages saved");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Wages could not be saved."); }
    finally { setSaving(null); }
  }
  return <section className="space-y-6"><h1 className="text-[28px] font-bold">Wages &amp; Hours</h1>
    <div className="flex flex-wrap gap-4"><label className="grid gap-1 text-sm">Period start<input className={input} type="date" value={start} disabled={Boolean(saving)} onChange={event => { setStart(event.target.value); setPage(0); }} /></label><label className="grid gap-1 text-sm">Period end<input className={input} type="date" value={end} disabled={Boolean(saving)} onChange={event => { setEnd(event.target.value); setPage(0); }} /></label></div>
    <p className="text-sm text-muted-foreground">Completed jobs with valid check-in and check-out only. Hours are limited to the selected dates in Europe/London. Breaks are not deducted. Rates are saved per employee and period; totals update when attendance changes. These are gross estimates, not payroll payments.</p>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {!valid ? <p role="alert">Choose a valid start and end date.</p> : summary.isPending ? <p>Loading worked hours…</p> : summary.error ? <p role="alert" className="text-destructive">{summary.error.message}</p> : <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-surface-2"><tr>{["Employee", "Worked hours", "Hourly rate (GBP)", "Saved total (GBP)"].map(label => <th className="p-4" key={label}>{label}</th>)}</tr></thead><tbody>{summary.data.rows.map(row => {
        const saved = summary.data.saved.find(wage => wage.staff_id === row.staff_id);
        return <tr key={row.staff_id} className="border-t border-border"><td className="p-4 font-semibold">{row.staff_name}</td><td className="p-4">{Number(row.total_hours).toFixed(4)}</td><td className="p-4"><form key={`${start}-${end}-${saved?.hourly_rate ?? "new"}`} onSubmit={event => void save(event, row.staff_id)} className="flex gap-2"><input className={`${input} w-28`} aria-label={`Hourly rate for ${row.staff_name}`} name="rate" type="number" min="0" max="99999999.99" step="0.01" required defaultValue={saved?.hourly_rate ?? ""} /><Button disabled={Boolean(saving)} type="submit">{saving === row.staff_id ? "Saving…" : "Save"}</Button></form></td><td className="p-4">{saved ? money(saved.total_amount) : "Set rate and save"}</td></tr>;
      })}</tbody></table>{!summary.data.rows.length && <p className="p-8 text-center text-muted-foreground">No employees found.</p>}
      <footer className="flex justify-end gap-2 p-3"><Button variant="outline" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</Button><Button variant="outline" disabled={!summary.data.more} onClick={() => setPage(value => value + 1)}>Next</Button></footer>
    </div>}
  </section>;
}
