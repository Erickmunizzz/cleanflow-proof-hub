import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Search, Trash2, Users, Package, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeTable } from "./EmployeeTable";
import { AdminDataBoundary } from "./AdminSession";
import { adminRecordsOptions } from "@/lib/admin-records.query";
import {
  addCustomer, addStaff, addMaterial,
  updateCustomer, updateStaff, updateMaterial,
  deleteCustomer, deleteStaff, deleteMaterial,
} from "@/lib/admin-records.functions";
import { ownerContextOptions } from "@/lib/owner-context";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type RecordKind = "customers" | "staff" | "materials";
type RecordRow = Tables<"clients"> | Tables<"staff"> | Tables<"materials">;

const config = {
  customers: { title: "Customers", singular: "Customer", icon: Users, fields: ["name", "email", "phone", "address"] },
  staff: { title: "Employees", singular: "Employee", icon: Briefcase, fields: ["name", "email", "phone", "role", "weekly_hours"] },
  materials: { title: "Materials & Replenishment", singular: "Material", icon: Package, fields: ["name", "quantity", "unit"] },
} as const;

type RecordsProps = { kind: RecordKind; search: string; onSearch: (value: string) => void; archived?: boolean; navigation?: ReactNode };
export function RecordsPage(props: RecordsProps) {
  return <AdminDataBoundary><RecordsContent {...props} /></AdminDataBoundary>;
}

function RecordsContent({ kind, search, onSearch, archived, navigation }: RecordsProps) {
  const { data } = useSuspenseQuery(adminRecordsOptions);
  const queryClient = useQueryClient();
  const addCustomerFn = useServerFn(addCustomer);
  const addStaffFn = useServerFn(addStaff);
  const addMaterialFn = useServerFn(addMaterial);
  const updateCustomerFn = useServerFn(updateCustomer);
  const updateStaffFn = useServerFn(updateStaff);
  const updateMaterialFn = useServerFn(updateMaterial);
  const deleteCustomerFn = useServerFn(deleteCustomer);
  const deleteStaffFn = useServerFn(deleteStaff);
  const deleteMaterialFn = useServerFn(deleteMaterial);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecordRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const ownerContext = useQuery(ownerContextOptions);

  const cleanerProfiles = useQuery({
    queryKey: ["cleaner-profiles", ownerContext.data?.companyId],
    enabled: open && kind === "staff" && Boolean(ownerContext.data?.companyId),
    queryFn: async () => {
      if (!ownerContext.data?.companyId) return [];
      const { data, error } = await supabase.from("profiles").select("id, full_name")
        .eq("company_id", ownerContext.data.companyId).eq("role", "cleaner").eq("is_active", true).order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const configItem = config[kind];
  const Icon = configItem.icon;
  const records: RecordRow[] = kind === "customers" ? data.clients : kind === "staff" ? data.staff : data.materials;
  const rows = records.filter(row => Object.values(row).some(value => String(value ?? "").toLowerCase().includes(search.toLowerCase())));
  const visibleIds = new Set(rows.map(row => row.id));
  const invalidateRecords = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin-records"] }),
    queryClient.invalidateQueries({ queryKey: ["job-pickers"] }),
    queryClient.invalidateQueries({ queryKey: ["message-staff"] }),
    queryClient.invalidateQueries({ queryKey: ["owner-overview"] }),
  ]);

  const save = useMutation({
    mutationFn: async () => {
      const name = form["name"] ?? "";
      const email = form["email"] ?? "";
      const phone = form["phone"] ?? "";
      if (kind === "customers") {
        const payload = { name, email, phone, address: form["address"] ?? "" };
        return editingId
          ? updateCustomerFn({ data: { id: editingId, data: payload } })
          : addCustomerFn({ data: payload });
      }
      if (kind === "staff") {
        const payload = { name, email, phone, role: form["role"] ?? "", weekly_hours: form["weekly_hours"] ? Number(form["weekly_hours"]) : null, profile_id: form["profile_id"] ?? "" };
        return editingId
          ? updateStaffFn({ data: { id: editingId, data: payload } })
          : addStaffFn({ data: payload });
      }
      const payload = { name, quantity: Number(form["quantity"] ?? 0), unit: form["unit"] ?? "" };
      return editingId
        ? updateMaterialFn({ data: { id: editingId, data: payload } })
        : addMaterialFn({ data: payload });
    },
    onSuccess: async () => {
      await invalidateRecords();
      setOpen(false);
      setEditingId(null);
      setForm({});
      toast.success(`${configItem.singular} ${editingId ? "updated" : "added"}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (kind === "customers") return deleteCustomerFn({ data: { id } });
      if (kind === "staff") return deleteStaffFn({ data: { id } });
      return deleteMaterialFn({ data: { id } });
    },
    onSuccess: async () => {
      await invalidateRecords();
      setDeleteTarget(null);
      toast.success(`${configItem.singular} deleted`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function startCreate() {
    setEditingId(null);
    setForm({});
    save.reset();
    setOpen(true);
  }

  function startEdit(row: RecordRow) {
    const values = row as unknown as Record<string, unknown>;
    const nextForm: Record<string, string> = {};
    for (const field of configItem.fields) nextForm[field] = String(values[field] ?? "");
    if (kind === "staff") nextForm["profile_id"] = String(values["profile_id"] ?? "");
    setEditingId(row.id);
    setForm(nextForm);
    save.reset();
    setOpen(true);
  }

  const deleteName = deleteTarget
    ? String((deleteTarget as unknown as Record<string, unknown>)["name"] ?? configItem.singular.toLowerCase())
    : "";

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-[28px] font-bold">{configItem.title}</h1><p className="mt-1 text-sm text-muted-foreground">{records.length} {kind === "customers" ? "customers" : kind === "staff" ? "staff members" : "materials"}</p></div>
      <Button onClick={startCreate} className="rounded-xl"><Plus />{kind === "staff" ? "Add employee" : `Add ${configItem.singular}`}</Button>
    </div>
    {navigation}
    <div className="relative max-w-sm"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label={`Search ${kind}`} placeholder={`Search ${kind}…`} value={search} onChange={e => onSearch(e.target.value)} className="rounded-xl bg-card pl-9" /></div>
    {kind === "staff" ? (ownerContext.isError ? <p role="alert">{ownerContext.error.message}</p> : ownerContext.data &&
      <EmployeeTable key={`${Boolean(archived)}:${search}`} companyId={ownerContext.data.companyId}
        rows={data.staff.filter(employee => employee.is_active !== Boolean(archived) && visibleIds.has(employee.id))}
        jobs={data.jobs} onEdit={startEdit}
        onDelete={row => { remove.reset(); setDeleteTarget(row); }} refresh={invalidateRecords} />
    ) : <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface-2 text-muted-foreground"><tr>{configItem.fields.map(field => <th key={field} className="px-5 py-3 font-medium capitalize">{field}</th>)}<th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent">{configItem.fields.map((field, index) => {
          const value = (row as unknown as Record<string, unknown>)[field];
          return <td key={field} className="max-w-[300px] break-words px-5 py-4">{index === 0 ? <span className="flex items-center gap-3 font-semibold"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></span>{String(value ?? "—")}</span> : String(value ?? "—")}</td>;
        })}<td className="px-5 py-4"><div className="flex justify-end gap-1">
          <button type="button" aria-label={`Edit ${configItem.singular.toLowerCase()} ${String((row as unknown as Record<string, unknown>)["name"] ?? "")}`} disabled={save.isPending || remove.isPending} onClick={() => startEdit(row)} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-primary-soft hover:text-primary disabled:opacity-50"><Pencil className="size-4" /></button>
          <button type="button" aria-label={`Delete ${configItem.singular.toLowerCase()} ${String((row as unknown as Record<string, unknown>)["name"] ?? "")}`} disabled={save.isPending || remove.isPending} onClick={() => { remove.reset(); setDeleteTarget(row); }} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-danger-soft hover:text-danger disabled:opacity-50"><Trash2 className="size-4" /></button>
        </div></td></tr>)}</tbody>
      </table>
      {!rows.length && <p className="py-12 text-center text-sm text-muted-foreground">{search ? "No matching records." : `No ${kind} yet.`}</p>}
    </div>}

    <Dialog open={open} onOpenChange={value => { if (!save.isPending) setOpen(value); }}>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl bg-card">
        <DialogHeader><DialogTitle>{editingId ? `Edit ${configItem.singular}` : `Add ${configItem.singular}`}</DialogTitle><DialogDescription className="sr-only">{configItem.singular} details</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
          {configItem.fields.map(field => <div key={field} className="space-y-2"><Label htmlFor={`record-${field}`} className="capitalize">{field === "weekly_hours" ? "Weekly hours" : field}{field === "name" && " *"}</Label><Input id={`record-${field}`} type={field === "email" ? "email" : field === "quantity" || field === "weekly_hours" ? "number" : field === "phone" ? "tel" : "text"} min={field === "quantity" || field === "weekly_hours" ? 0 : undefined} max={field === "weekly_hours" ? 168 : undefined} step={field === "weekly_hours" ? "0.01" : field === "quantity" ? "any" : undefined} required={field === "name" || field === "quantity"} value={form[field] ?? (field === "quantity" ? "0" : "")} onChange={event => setForm(previous => ({ ...previous, [field]: event.target.value }))} className="rounded-xl" /></div>)}
          {kind === "staff" && <div className="space-y-2">
            <Label htmlFor="record-profile">Cleaner login</Label>
            <select id="record-profile" value={form["profile_id"] ?? ""} onChange={event => setForm(previous => ({ ...previous, profile_id: event.target.value }))} className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary">
              <option value="">Not linked</option>
              {cleanerProfiles.data?.map(profile => <option key={profile.id} value={profile.id}>{profile.full_name}</option>)}
            </select>
            {cleanerProfiles.isError && <p role="alert" className="text-sm text-danger">Couldn't load cleaner accounts: {(cleanerProfiles.error as Error).message}</p>}
          </div>}
          {save.isError && <p role="alert" className="text-sm text-danger">{save.error.message}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={save.isPending} onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button><Button disabled={save.isPending} className="rounded-xl">{save.isPending ? "Saving…" : editingId ? "Save changes" : `Save ${configItem.singular.toLowerCase()}`}</Button></div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={Boolean(deleteTarget)} onOpenChange={value => { if (!value && !remove.isPending) setDeleteTarget(null); }}>
      <DialogContent className="w-[calc(100%-2rem)] rounded-xl bg-card">
        <DialogHeader><DialogTitle>Delete {configItem.singular}?</DialogTitle><DialogDescription>Delete “{deleteName}” from this workspace? This action cannot be undone.</DialogDescription></DialogHeader>
        {kind !== "materials" && <p className="text-sm text-muted-foreground">Records linked to existing jobs cannot be deleted until those jobs are reassigned or removed.</p>}
        {remove.isError && <p role="alert" className="text-sm text-danger">{remove.error.message}</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={remove.isPending} onClick={() => setDeleteTarget(null)} className="rounded-xl">Cancel</Button><Button type="button" variant="destructive" disabled={remove.isPending} onClick={() => { if (deleteTarget) remove.mutate(deleteTarget.id); }} className="rounded-xl">{remove.isPending ? "Deleting…" : "Delete"}</Button></div>
      </DialogContent>
    </Dialog>
  </div>;
}
