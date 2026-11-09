import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { KeyRound, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import type { Tables } from "@/integrations/supabase/types";

type KeyRecord = Tables<"key_registers">;
type KeyStatus = "with_staff" | "with_office" | "returned";
type FormState = { key_code: string; customer_id: string; staff_id: string; status: KeyStatus; notes: string };
const pageSize = 25;
const statusLabels: Record<KeyStatus, string> = {
  with_staff: "With staff",
  with_office: "With office",
  returned: "Returned",
};
const emptyForm: FormState = { key_code: "", customer_id: "", staff_id: "", status: "with_office", notes: "" };
const dateLabel = (value: string | null) => value ? new Date(value).toLocaleString("en-GB") : "—";

export function KeyRegisterPage() {
  const { data: owner } = useSuspenseQuery(ownerContextOptions);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<KeyRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const keysQuery = useQuery({
    queryKey: ["key-registers", owner.companyId, statusFilter, customerFilter, page],
    queryFn: async () => {
      let request = supabase.from("key_registers").select("*", { count: "exact" })
        .eq("company_id", owner.companyId).order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (statusFilter) request = request.eq("status", statusFilter);
      if (customerFilter) request = request.eq("customer_id", customerFilter);
      const { data, error, count } = await request;
      if (error) throw new Error(error.message);
      return { rows: (data ?? []) as KeyRecord[], count: count ?? 0 };
    },
  });
  const customersQuery = useQuery({
    queryKey: ["key-register-customers", owner.companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id,name")
        .eq("company_id", owner.companyId).order("name");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const staffQuery = useQuery({
    queryKey: ["key-register-staff", owner.companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("id,name")
        .eq("company_id", owner.companyId).eq("is_active", true).order("name");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase.channel(`key-registers-${owner.companyId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "key_registers",
        filter: `company_id=eq.${owner.companyId}`,
      }, () => { void queryClient.invalidateQueries({ queryKey: ["key-registers", owner.companyId] }); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [owner.companyId, queryClient]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, customer_id: customersQuery.data?.[0]?.id ?? "" });
    setActionError("");
    setModalOpen(true);
  }
  function openEdit(record: KeyRecord) {
    setEditing(record);
    setForm({
      key_code: record.key_code,
      customer_id: record.customer_id,
      staff_id: record.staff_id ?? "",
      status: record.status as KeyStatus,
      notes: record.notes ?? "",
    });
    setActionError("");
    setModalOpen(true);
  }
  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setActionError("");
    const now = new Date().toISOString();
    const payload = {
      company_id: owner.companyId,
      customer_id: form.customer_id,
      staff_id: form.status === "with_office" ? null : (form.staff_id || null),
      key_code: form.key_code.trim(),
      status: form.status,
      picked_up_at: form.status === "with_staff" ? (editing?.picked_up_at ?? now) : (editing?.picked_up_at ?? null),
      returned_at: form.status === "returned" ? (editing?.returned_at ?? now) : null,
      notes: form.notes.trim() || null,
    };
    const result = editing
      ? await supabase.from("key_registers").update(payload).eq("id", editing.id).eq("company_id", owner.companyId)
      : await supabase.from("key_registers").insert(payload);
    setSaving(false);
    if (result.error) { setActionError(result.error.message); return; }
    setModalOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["key-registers", owner.companyId] });
  }
  async function deleteRecord(record: KeyRecord) {
    if (!window.confirm(`Delete key “${record.key_code}”?`)) return;
    setActionError("");
    const { error } = await supabase.from("key_registers").delete()
      .eq("id", record.id).eq("company_id", owner.companyId);
    if (error) { setActionError(error.message); return; }
    await queryClient.invalidateQueries({ queryKey: ["key-registers", owner.companyId] });
  }

  const rows = keysQuery.data?.rows ?? [];
  const total = keysQuery.data?.count ?? 0;
  const customerNames = new Map((customersQuery.data ?? []).map(customer => [customer.id, customer.name]));
  const staffNames = new Map((staffQuery.data ?? []).map(person => [person.id, person.name]));

  return <section className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-[28px] font-bold">Keys</h1><p className="mt-1 text-sm text-muted-foreground">Track keys held by staff and stored at the office.</p></div>
      <Button onClick={openAdd} className="rounded-xl"><Plus className="mr-2 size-4" />Add Key</Button>
    </header>
    <div className="flex flex-wrap gap-3">
      <label className="grid gap-1 text-sm"><span className="text-muted-foreground">Customer</span>
        <select className="h-10 min-w-48 rounded-lg border border-input bg-background px-3" value={customerFilter} onChange={event => { setCustomerFilter(event.target.value); setPage(0); }}>
          <option value="">All customers</option>{(customersQuery.data ?? []).map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm"><span className="text-muted-foreground">Status</span>
        <select className="h-10 min-w-44 rounded-lg border border-input bg-background px-3" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setPage(0); }}>
          <option value="">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    </div>
    {actionError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{actionError}</p>}
    {keysQuery.isLoading ? <p className="py-12 text-center text-sm text-muted-foreground">Loading keys…</p>
      : keysQuery.error ? <p role="alert" className="py-12 text-center text-sm text-destructive">{keysQuery.error.message}</p>
      : <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-2 text-muted-foreground"><tr>{["Key", "Customer", "Assigned staff", "Status", "Picked up", "Returned", "Actions"].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
          <tbody>{rows.map(record => <tr key={record.id} className="border-t border-border">
            <td className="px-4 py-4 font-semibold">{record.key_code}{record.notes && <p className="mt-1 max-w-48 truncate text-xs font-normal text-muted-foreground">{record.notes}</p>}</td>
            <td className="px-4 py-4">{customerNames.get(record.customer_id) ?? "Customer unavailable"}</td>
            <td className="px-4 py-4">{record.staff_id ? staffNames.get(record.staff_id) ?? "Staff unavailable" : "—"}</td>
            <td className="px-4 py-4"><span className="rounded-full bg-primary-soft px-2 py-1 text-xs capitalize text-primary">{statusLabels[record.status as KeyStatus] ?? record.status}</span></td>
            <td className="px-4 py-4">{dateLabel(record.picked_up_at)}</td><td className="px-4 py-4">{dateLabel(record.returned_at)}</td>
            <td className="px-4 py-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openEdit(record)} aria-label={`Edit ${record.key_code}`}><Pencil className="size-4" /></Button><Button size="sm" variant="outline" onClick={() => void deleteRecord(record)} aria-label={`Delete ${record.key_code}`}><Trash2 className="size-4" /></Button></div></td>
          </tr>)}</tbody>
        </table>
        {!rows.length && <div className="grid justify-items-center gap-2 py-12 text-center"><KeyRound className="size-7 text-muted-foreground" /><p className="text-sm text-muted-foreground">No keys match these filters.</p></div>}
        <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>{total ? `Showing ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, total)} of ${total}` : "No records"}</span>
          <div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(value => value - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></Button><Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= total} onClick={() => setPage(value => value + 1)} aria-label="Next page"><ChevronRight className="size-4" /></Button></div>
        </footer>
      </div>}
    {modalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false); }}>
      <form role="dialog" aria-modal="true" aria-labelledby="key-form-title" onSubmit={event => void saveRecord(event)} className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xl">
        <header className="flex items-center justify-between"><h2 id="key-form-title" className="text-xl font-semibold">{editing ? "Edit Key" : "Add Key"}</h2><Button type="button" variant="ghost" size="icon" onClick={() => setModalOpen(false)} aria-label="Close"><X className="size-4" /></Button></header>
        <label className="grid gap-1 text-sm font-medium">Key label or code<input required maxLength={120} value={form.key_code} onChange={event => setForm({ ...form, key_code: event.target.value })} className="h-10 rounded-lg border border-input bg-background px-3 font-normal" placeholder="e.g. Front door — Flat 2" /></label>
        <label className="grid gap-1 text-sm font-medium">Customer<select required value={form.customer_id} onChange={event => setForm({ ...form, customer_id: event.target.value })} className="h-10 rounded-lg border border-input bg-background px-3 font-normal"><option value="">Select a customer</option>{(customersQuery.data ?? []).map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as KeyStatus, staff_id: event.target.value === "with_office" ? "" : form.staff_id })} className="h-10 rounded-lg border border-input bg-background px-3 font-normal">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {form.status !== "with_office" && <label className="grid gap-1 text-sm font-medium">Staff member<select required={form.status === "with_staff"} value={form.staff_id} onChange={event => setForm({ ...form, staff_id: event.target.value })} className="h-10 rounded-lg border border-input bg-background px-3 font-normal"><option value="">Select staff</option>{(staffQuery.data ?? []).map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>}
        <label className="grid gap-1 text-sm font-medium">Notes<textarea rows={3} maxLength={2000} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 font-normal" /></label>
        {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
        <footer className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving || !customersQuery.data?.length}>{saving ? "Saving…" : editing ? "Save Changes" : "Add Key"}</Button></footer>
      </form>
    </div>}
  </section>;
}
