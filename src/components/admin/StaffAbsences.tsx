import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { readAllRows } from "@/lib/supabase-pages";
import { absenceDate, absenceTypeLabel, absenceTypes } from "@/lib/staff-absences";
import type { TablesInsert } from "@/integrations/supabase/types";

const pageSize = 25;
const field = "rounded-lg border border-input bg-background px-3 py-2";
type AbsenceInput = Omit<TablesInsert<"staff_absences">, "company_id">;

export function StaffAbsences() {
  const { data: { companyId } } = useSuspenseQuery(ownerContextOptions);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [validation, setValidation] = useState("");
  const key = ["staff-absences", companyId];
  const staff = useQuery({
    queryKey: ["absence-staff-options", companyId],
    enabled: open,
    queryFn: () => readAllRows((from, to) => supabase.from("staff").select("id,name")
      .eq("company_id", companyId).eq("is_active", true).order("name").order("id").range(from, to)),
  });
  const absences = useQuery({
    queryKey: [...key, page],
    queryFn: async () => {
      const result = await supabase.from("staff_absences")
        .select("id,absence_type,start_date,end_date,status,staff!staff_absences_staff_company_fkey(name)", { count: "exact" })
        .eq("company_id", companyId).order("created_at", { ascending: false }).order("id", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (result.error) throw new Error(result.error.message);
      return { rows: result.data, count: result.count ?? 0 };
    },
  });

  const save = useMutation({
    mutationFn: async (operation: { absence: AbsenceInput } | { approve: string }) => {
      const result = "approve" in operation
        ? await supabase.from("staff_absences").update({ status: "approved" })
            .eq("company_id", companyId).eq("id", operation.approve).eq("status", "pending").select("id").single()
        : await supabase.from("staff_absences").insert({ ...operation.absence, company_id: companyId });
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: async (_, operation) => {
      if ("absence" in operation) {
        setPage(0);
        setOpen(false);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: key }),
        queryClient.invalidateQueries({ queryKey: ["finance", companyId] }),
      ]);
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (save.isPending) return;
    const form = new FormData(event.currentTarget);
    const start_date = String(form.get("start_date"));
    const end_date = String(form.get("end_date"));
    const reason = String(form.get("reason") ?? "").trim();
    if (!start_date || !end_date || end_date < start_date || !reason) {
      setValidation("Enter a valid date range and a reason.");
      return;
    }
    setValidation("");
    save.mutate({
      absence: { staff_id: String(form.get("staff_id")), absence_type: String(form.get("absence_type")), start_date, end_date, reason },
    });
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Absences / Time Off</h2>
        <Button onClick={() => { save.reset(); setValidation(""); setOpen(true); }} disabled={save.isPending}>
          <Plus /> Add Absence
        </Button>
      </header>
      <p className="text-sm text-muted-foreground">Approved absences block new assignments for the selected dates in Europe/London.</p>
      {!open && save.error && <p role="alert" className="text-sm text-danger">{save.error.message}</p>}
      {absences.isPending && <p role="status">Loading absences…</p>}
      {absences.isError && <p role="alert" className="text-danger">{absences.error.message}</p>}
      {absences.data && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[660px] text-left text-sm">
            <thead className="bg-surface-2"><tr>{["Employee", "Type", "Date range", "Status", "Action"].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead>
            <tbody>
              {absences.data.rows.map(row => (
                <tr key={row.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{row.staff?.name ?? "Employee unavailable"}</td>
                  <td className="p-4">{absenceTypeLabel(row.absence_type)}</td>
                  <td className="p-4">{absenceDate(row.start_date)} – {absenceDate(row.end_date)}</td>
                  <td className="p-4">{row.status === "approved" ? "Approved" : "Pending"}</td>
                  <td className="p-4">{row.status === "pending" && (
                    <Button size="sm" variant="outline" disabled={save.isPending}
                      onClick={() => save.mutate({ approve: row.id })}>Approve</Button>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!absences.data.rows.length && <p className="p-8 text-center text-sm text-muted-foreground">No absences recorded.</p>}
          <footer className="flex justify-end gap-2 p-3">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" disabled={(page + 1) * pageSize >= absences.data.count} onClick={() => setPage(page + 1)}>Next</Button>
          </footer>
        </div>
      )}
      <Dialog open={open} onOpenChange={value => { if (!save.isPending) setOpen(value); }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Absence</DialogTitle>
            <DialogDescription>Save a pending request. Approve it from the list when ready.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1 text-sm">Employee
              <select className={field} name="staff_id" required defaultValue="">
                <option value="" disabled>Select employee</option>
                {staff.data?.map(employee => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
              </select>
            </label>
            {staff.isPending && <p role="status" className="text-sm">Loading employees…</p>}
            {staff.isError && <p role="alert" className="text-sm text-danger">{staff.error.message}</p>}
            {staff.isSuccess && !staff.data.length && <p className="text-sm">No active employees found.</p>}
            <label className="grid gap-1 text-sm">Type
              <select className={field} name="absence_type" required>
                {Object.entries(absenceTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">Start date<input type="date" name="start_date" className={field} required /></label>
              <label className="grid gap-1 text-sm">End date<input type="date" name="end_date" className={field} required /></label>
            </div>
            <label className="grid gap-1 text-sm">Reason<textarea name="reason" className={field} maxLength={2000} required /></label>
            {(validation || save.error) && <p role="alert" className="text-sm text-danger">{validation || save.error?.message}</p>}
            <Button type="submit" disabled={save.isPending || !staff.data?.length}>{save.isPending ? "Saving…" : "Save Absence"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
