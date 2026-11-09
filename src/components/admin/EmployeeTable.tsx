import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, KeyRound, Lock, MessageCircle, Pencil, QrCode, Trash2, Unlock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { readAllRows } from "@/lib/supabase-pages";
import { toast } from "sonner";

type Employee = Tables<"staff">;
type Detail = { employee: Employee; kind: "keys" | "schedule" | "qr" | "archive" };
type Props = {
  companyId: string;
  rows: Employee[];
  jobs: Pick<Tables<"jobs">, "id" | "staff_id" | "title" | "scheduled_date" | "status">[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  refresh: () => Promise<unknown>;
};

const formatDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" });
const londonDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" });
const iconClass = "grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 hover:bg-accent disabled:opacity-40";

export function EmployeeTable({ companyId, rows, jobs, onEdit, onDelete, refresh }: Props) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(rows.length / 25);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const day = londonDay.format(new Date());
  const leave = useQuery({
    queryKey: ["employee-leave", companyId, day],
    queryFn: () => readAllRows((a, b) => supabase.from("staff_absences").select("id,staff_id")
      .eq("company_id", companyId).eq("status", "approved").lte("start_date", day).gte("end_date", day)
      .order("id").range(a, b)),
  });
  const keys = useQuery({
    queryKey: ["employee-keys", companyId, detail?.employee.id],
    enabled: detail?.kind === "keys",
    queryFn: () => readAllRows((a, b) => supabase.from("key_registers").select("id,key_code,status")
      .eq("company_id", companyId).eq("staff_id", detail!.employee.id).order("id").range(a, b)),
  });
  const archive = useMutation({
    mutationFn: async (employee: Employee) => {
      const { error } = await supabase.from("staff").update({ is_active: !employee.is_active })
        .eq("id", employee.id).eq("company_id", companyId).select("id").single();
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => { await refresh(); setDetail(null); },
    onError: (error: Error) => toast.error(error.message),
  });
  const onLeave = new Set(leave.data?.map(row => row.staff_id));
  const schedule = detail?.kind === "schedule" ? jobs.filter(job => job.staff_id === detail.employee.id) : [];
  const qrUrl = detail?.kind === "qr" ? new URL("/admin/employees", window.location.origin) : null;
  if (qrUrl && detail) {
    qrUrl.searchParams.set("q", detail.employee.employee_no);
    if (!detail.employee.is_active) qrUrl.searchParams.set("tab", "archive");
  }
  return <>
    {leave.isError && <p role="alert" className="text-sm text-danger">Could not load leave status.</p>}
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[710px] text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground"><tr>
          {["Employee no", "Employee name", "Info", "Functions"].map(label => <th scope="col" key={label} className="p-4">{label}</th>)}
        </tr></thead>
        <tbody>{rows.slice(currentPage * 25, (currentPage + 1) * 25).map(employee => {
          const initials = employee.name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
          const status = !employee.is_active ? "Archived" : leave.isPending ? "Checking status…" : leave.isError ? "Status unavailable" : onLeave.has(employee.id) ? "On Leave" : "Working Employee";
          return <tr key={employee.id} className="border-t border-border hover:bg-accent/40">
            <td className="p-4 font-mono">{employee.employee_no}</td>
            <td className="p-4"><div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-ink-foreground" aria-hidden>{initials}</span>
              <div><p className="font-semibold">{employee.name}</p><p className="text-xs text-muted-foreground">{[employee.role, employee.weekly_hours === null ? null : `${employee.weekly_hours}h / week`].filter(Boolean).join(" • ") || "—"}</p></div>
            </div></td>
            <td className="p-4"><span className={status === "Working Employee" ? "rounded-full bg-success-soft px-2.5 py-1 text-xs text-success-strong" : "rounded-full bg-warning-soft px-2.5 py-1 text-xs text-warning-strong"}>{status}</span></td>
            <td className="p-4"><div className="flex gap-1">
              <button type="button" className={iconClass} title="Edit" aria-label={`Edit ${employee.name}`} onClick={() => onEdit(employee)}><Pencil className="size-4" /></button>
              <button type="button" className={iconClass} title="Delete" aria-label={`Delete ${employee.name}`} onClick={() => onDelete(employee)}><Trash2 className="size-4" /></button>
              <button type="button" className={iconClass} title="Keys" aria-label={`Keys for ${employee.name}`} onClick={() => setDetail({ employee, kind: "keys" })}><KeyRound className="size-4" /></button>
              {employee.is_active && employee.profile_id
                ? <Link to="/admin/employees" search={{ q: "", tab: "notifications", employee: employee.id }} className={iconClass} title="Message" aria-label={`Message ${employee.name}`}><MessageCircle className="size-4" /></Link>
                : <button type="button" className={iconClass} disabled title="An active linked cleaner account is required" aria-label="Message unavailable"><MessageCircle className="size-4" /></button>}
              <button type="button" className={iconClass} title="Schedule" aria-label={`Schedule for ${employee.name}`} onClick={() => setDetail({ employee, kind: "schedule" })}><CalendarDays className="size-4" /></button>
              <button type="button" className={iconClass} title="Employee QR code" aria-label={`QR code for ${employee.name}`} onClick={() => setDetail({ employee, kind: "qr" })}><QrCode className="size-4" /></button>
              <button type="button" className={iconClass} title={employee.is_active ? "Archive" : "Restore"} aria-label={`${employee.is_active ? "Archive" : "Restore"} ${employee.name}`} onClick={() => setDetail({ employee, kind: "archive" })}>{employee.is_active ? <Lock className="size-4" /> : <Unlock className="size-4" />}</button>
            </div></td>
          </tr>;
        })}</tbody>
      </table>
      {!rows.length && <p className="p-8 text-center text-sm text-muted-foreground">No employees found.</p>}
      {pageCount > 1 && <footer className="flex items-center justify-end gap-3 border-t border-border p-3">
        <span className="text-xs text-muted-foreground">Page {currentPage + 1} of {pageCount}</span>
        <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</Button>
        <Button variant="outline" size="sm" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>Next</Button>
      </footer>}
    </div>
    <Dialog open={Boolean(detail)} onOpenChange={open => { if (!open && !archive.isPending) setDetail(null); }}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>{detail?.employee.name}</DialogTitle><DialogDescription>
          {detail?.kind === "keys" ? "Assigned keys" : detail?.kind === "schedule" ? "Assigned jobs" : detail?.kind === "qr" ? "Scan to open this employee in the protected directory." : "Confirm employee status change."}
        </DialogDescription></DialogHeader>
        {detail?.kind === "keys" && (keys.isPending ? <p>Loading keys…</p> : keys.error ? <p role="alert">{keys.error.message}</p> : keys.data.length ? <ul className="space-y-2">{keys.data.map(key => <li key={key.id}>{key.key_code} · {key.status.replaceAll("_", " ")}</li>)}</ul> : <p>No assigned keys.</p>)}
        {detail?.kind === "schedule" && (schedule.length ? <ul className="space-y-2">{schedule.map(job => <li key={job.id} className="rounded-lg border p-3"><strong>{job.title}</strong><p className="text-sm">{formatDate.format(new Date(job.scheduled_date))} · {job.status.replaceAll("_", " ")}</p></li>)}</ul> : <p>No assigned jobs.</p>)}
        {qrUrl && <div className="mx-auto rounded-lg bg-white p-4"><QRCodeSVG value={qrUrl.toString()} title={`Directory link for ${detail?.employee.name}`} /></div>}
        {detail?.kind === "archive" && <Button disabled={archive.isPending} onClick={() => archive.mutate(detail.employee)}>{detail.employee.is_active ? "Archive employee" : "Restore employee"}</Button>}
      </DialogContent>
    </Dialog>
  </>;
}
