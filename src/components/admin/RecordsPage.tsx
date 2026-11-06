import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search, Users, Package, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminDataBoundary } from "./AdminSession";
import { adminRecordsOptions } from "@/lib/admin-records.query";
import { addCustomer, addStaff, addMaterial } from "@/lib/admin-records.functions";

export type RecordKind = "customers" | "staff" | "materials";
const config = {
  customers: { title: "Customers", singular: "Customer", icon: Users, fields: ["name", "email", "phone", "address"] },
  staff: { title: "Staff", singular: "Staff", icon: Briefcase, fields: ["name", "email", "phone", "role"] },
  materials: { title: "Materials & Replenishment", singular: "Material", icon: Package, fields: ["name", "quantity", "unit"] },
} as const;
export function RecordsPage({ kind, search, onSearch }: { kind: RecordKind; search: string; onSearch: (value: string) => void }) {
  return <AdminDataBoundary><RecordsContent kind={kind} search={search} onSearch={onSearch} /></AdminDataBoundary>;
}
function RecordsContent({ kind, search, onSearch }: { kind: RecordKind; search: string; onSearch: (value: string) => void }) {
  const { data } = useSuspenseQuery(adminRecordsOptions);
  const qc = useQueryClient();
  const customer = useServerFn(addCustomer);
  const staff = useServerFn(addStaff);
  const material = useServerFn(addMaterial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const c = config[kind];
  const Icon = c.icon;
  const records = kind === "customers" ? data.clients : kind === "staff" ? data.staff : data.materials;
  const rows = records.filter(row => Object.values(row).some(value => String(value ?? "").toLowerCase().includes(search.toLowerCase())));
  const save = useMutation({
    mutationFn: async () => {
      const name = form.name ?? "";
      const email = form.email ?? "";
      const phone = form.phone ?? "";
      if (kind === "customers") return customer({ data: { name, email, phone, address: form.address ?? "" } });
      if (kind === "staff") return staff({ data: { name, email, phone, role: form.role ?? "" } });
      return material({ data: { name, quantity: Number(form.quantity ?? 0), unit: form.unit ?? "" } });
    },
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: ["admin-records"] }), qc.invalidateQueries({ queryKey: ["job-pickers"] })]);
      setOpen(false); setForm({}); toast.success(`${c.singular} added`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-[28px] font-bold">{c.title}</h1><p className="mt-1 text-sm text-muted-foreground">{records.length} {kind === "customers" ? "customers" : kind === "staff" ? "staff members" : "materials"}</p></div><Button onClick={() => { setOpen(true); save.reset(); }} className="rounded-xl"><Plus />Add {c.singular}</Button></div>
    <div className="relative max-w-sm"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label={`Search ${kind}`} placeholder={`Search ${kind}…`} value={search} onChange={e => onSearch(e.target.value)} className="rounded-xl bg-card pl-9" /></div>
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-border bg-surface-2 text-muted-foreground"><tr>{c.fields.map(field => <th key={field} className="px-5 py-3 font-medium capitalize">{field}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent">{c.fields.map((field, i) => {
        const value = field in row ? row[field as keyof typeof row] : null;
        return <td key={field} className="max-w-[300px] break-words px-5 py-4">{i === 0 ? <span className="flex items-center gap-3 font-semibold"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></span>{String(value ?? "—")}</span> : String(value ?? "—")}</td>;
      })}</tr>)}</tbody></table>
      {!rows.length && <p className="py-12 text-center text-sm text-muted-foreground">{search ? "No matching records." : `No ${kind} yet.`}</p>}
    </div>
    <Dialog open={open} onOpenChange={v => { if (!save.isPending) setOpen(v); }}><DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl bg-card"><DialogHeader><DialogTitle>Add {c.singular}</DialogTitle><DialogDescription className="sr-only">{c.singular} details</DialogDescription></DialogHeader>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); save.mutate(); }}>{c.fields.map(field => <div key={field} className="space-y-2"><Label htmlFor={`record-${field}`} className="capitalize">{field}{field === "name" && " *"}</Label><Input id={`record-${field}`} type={field === "email" ? "email" : field === "quantity" ? "number" : field === "phone" ? "tel" : "text"} min={field === "quantity" ? 0 : undefined} step={field === "quantity" ? "any" : undefined} required={field === "name" || field === "quantity"} value={form[field] ?? (field === "quantity" ? "0" : "")} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))} className="rounded-xl" /></div>)}
        {save.isError && <p role="alert" className="text-sm text-danger">{save.error.message}</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={save.isPending} onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button><Button disabled={save.isPending} className="rounded-xl">{save.isPending ? "Saving…" : `Save ${c.singular.toLowerCase()}`}</Button></div>
      </form></DialogContent></Dialog>
  </div>;
}