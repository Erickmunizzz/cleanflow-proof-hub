import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Download, ClipboardCheck, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDataBoundary } from "./AdminSession";
import { adminRecordsOptions } from "@/lib/admin-records.query";
import { checklistSummary, recordedHours, csvCell } from "@/lib/job-summary";
import { OwnerMessages } from "@/components/admin/OwnerMessages";
import { SchedulingCalendar } from "@/components/admin/SchedulingCalendar";
import { KeyRegisterPage } from "@/components/admin/KeyRegisterPage";
import { IncidentsPage } from "@/components/admin/IncidentsPage";
import { CheckinPage } from "@/components/admin/CheckinPage";

export function OperationsSection({ section, label }: { section: string; label: string }) {
  return <AdminDataBoundary>{section === "messages" ? <div className="space-y-6"><h1 className="text-[28px] font-bold">{label}</h1><OwnerMessages /></div> : section === "scheduling" ? <SchedulingCalendar /> : section === "keys" ? <KeyRegisterPage /> : section === "safety" ? <IncidentsPage /> : section === "checkin" ? <CheckinPage /> : <SectionContent section={section} label={label} />}</AdminDataBoundary>;
}
const fmt = (value: string | null) => value ? new Date(value).toLocaleString("en-GB") : "—";
function SectionContent({ section, label }: { section: string; label: string }) {
  const { data } = useSuspenseQuery(adminRecordsOptions);
  const jobs = section === "reports" ? data.jobs.filter(job => job.status === "completed") : section === "checkin" ? data.jobs.filter(job => job.check_in_at || job.status !== "completed") : data.jobs;
  function exportJobs() {
    const contents = [["Job", "Customer", "Staff", "Status", "Scheduled", "Check-in", "Check-out", "Notes"], ...jobs.map(j => [j.title, j.clients?.name, j.staff?.name, j.status, j.scheduled_date, j.check_in_at, j.check_out_at, j.notes])].map(row => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cleanflow-${section}.csv`; anchor.click(); URL.revokeObjectURL(url);
  }
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-[28px] font-bold">{label}</h1><div className="flex gap-2"><Button asChild variant="outline" className="rounded-xl"><Link to="/admin/jobs"><CalendarDays />Jobs</Link></Button>{!["keys", "messages", "settings"].includes(section) && <Button onClick={exportJobs} variant="outline" className="rounded-xl"><Download />Export jobs</Button>}</div></div>
    {section === "structure" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.staff.map(person => <div key={person.id} className="rounded-xl border border-border bg-card p-5 shadow-card"><Users className="mb-4 size-6 text-primary" /><h2 className="font-semibold">{person.name}</h2><p className="mt-1 text-sm text-muted-foreground">{person.role ?? "No role recorded"}</p><p className="mt-3 break-all text-sm">{person.email ?? "—"}</p></div>)}{!data.staff.length && <p className="text-sm text-muted-foreground">No staff records.</p>}</div>
    : section === "messages" ? <OwnerMessages />
    : section === "client-portal" ? <div className="space-y-4"><p className="text-sm text-muted-foreground">Internal customer job records. Customer access is not enabled.</p>{data.clients.map(client => <div key={client.id} className="border-b border-border py-4"><h2 className="font-semibold">{client.name}</h2><p className="mt-2 text-sm text-muted-foreground">{data.jobs.filter(job => job.client_id === client.id).length} jobs</p>{data.jobs.filter(job => job.client_id === client.id).map(job => <div key={job.id} className="mt-2 flex justify-between gap-3 text-sm"><span>{job.title}</span><span className="text-muted-foreground">{job.status.replaceAll("_", " ")}</span></div>)}</div>)}</div>
    : <>
      {section === "reports" && <div className="grid grid-cols-3 gap-4 border-y border-border py-5">{["scheduled", "in_progress", "completed"].map(status => <div key={status}><div className="text-sm capitalize text-muted-foreground">{status.replaceAll("_", " ")}</div><div className="mt-2 text-2xl font-bold">{data.jobs.filter(job => job.status === status).length}</div></div>)}</div>}
      {section === "plans" && <p className="text-sm text-muted-foreground">Task checklists for scheduled jobs.</p>}
      {section === "eventlog" && <p className="text-sm text-muted-foreground">Job creation and recorded attendance times. Historical changes are not tracked.</p>}
      {section === "workhours" && <p className="text-sm text-muted-foreground">Elapsed time between check-in and check-out; breaks are not deducted.</p>}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-surface-2 text-muted-foreground"><tr>{["Job", "Customer / Staff", "Status", section === "eventlog" ? "Created" : "Scheduled", "Check-in / Out", section === "workhours" ? "Recorded hours" : "Tasks"].map(name => <th key={name} className="px-4 py-3 font-medium">{name}</th>)}</tr></thead><tbody>{jobs.map(job => {
        const checklist = checklistSummary(job.checklist);
        const hours = recordedHours(job.check_in_at, job.check_out_at);
        return <tr key={job.id} className="border-t border-border"><td className="max-w-[250px] break-words px-4 py-4"><div className="font-semibold">{job.title}</div>{(section === "safety" || section === "plans") && <><p className="mt-2 text-xs text-muted-foreground">{job.notes ?? "No notes recorded"}</p>{checklist.items.map((item, i) => <div key={i} className="mt-1 flex gap-2 text-xs"><ClipboardCheck className="size-3 shrink-0 text-primary" />{item.label} — {item.done ? "Done" : "Pending"}</div>)}</>}</td><td className="px-4 py-4">{job.clients?.name ?? "No customer"}<div className="text-xs text-muted-foreground">{job.staff?.name ?? "Unassigned"}</div></td><td className="px-4 py-4"><span className="rounded-full bg-primary-soft px-2 py-1 text-xs capitalize text-primary">{job.status.replaceAll("_", " ")}</span></td><td className="px-4 py-4">{fmt(section === "eventlog" ? job.created_at : job.scheduled_date)}</td><td className="px-4 py-4">{fmt(job.check_in_at)}<div className="text-xs text-muted-foreground">{fmt(job.check_out_at)}</div></td><td className="px-4 py-4">{section === "workhours" ? hours === null ? "—" : hours.toFixed(2) : `${checklist.completed}/${checklist.total}`}</td></tr>;
      })}</tbody></table>{!jobs.length && <p className="py-12 text-center text-sm text-muted-foreground">{section === "reports" ? "No completed jobs yet." : "No jobs recorded."}</p>}</div>
    </>}
  </div>;
}