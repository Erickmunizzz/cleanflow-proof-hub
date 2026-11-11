import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDataBoundary } from "@/components/admin/AdminSession";
import { OwnerMessages } from "@/components/admin/OwnerMessages";
import { StaffAbsences } from "@/components/admin/StaffAbsences";
import { Button } from "@/components/ui/button";
import { RecordsPage } from "@/components/admin/RecordsPage";
import { AdminRecordsError } from "@/components/admin/AdminRecordsError";
const sections = [
  { tab: undefined, label: "Employee list" },
  { tab: "notifications", label: "Notifications" },
  { tab: "archive", label: "Archive" },
  { tab: "absences", label: "Absences / Time Off" },
] as const;
type Tab = (typeof sections)[number]["tab"];

export const Route = createFileRoute("/admin/employees")({
  validateSearch: (search: Record<string, unknown>): { q: string; tab?: Tab; employee?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    tab: sections.find(section => section.tab === search["tab"])?.tab,
    employee: typeof search["employee"] === "string" ? search["employee"] : undefined,
  }),
  head: () => ({ meta: [
    { title: "Staff — Cleanma UK" },
    { name: "description", content: "Staff records in your Cleanma UK workspace." },
    { property: "og:title", content: "Staff — Cleanma UK" },
    { property: "og:description", content: "Staff records in your Cleanma UK workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
  errorComponent: AdminRecordsError,
});
function Page() {
  const { q, tab, employee } = Route.useSearch();
  const navigate = Route.useNavigate();
  const navigation = (
    <nav aria-label="Employee sections" className="flex flex-wrap gap-2">
      {sections.map(section => <Button key={section.label} asChild className="rounded-full"
        variant={tab === section.tab ? "default" : "outline"}>
        <Link to="/admin/employees" search={{ q, tab: section.tab }}
          aria-current={tab === section.tab ? "page" : undefined}>{section.label}</Link>
      </Button>)}
    </nav>
  );
  if (tab === "notifications" || tab === "absences") {
    return <div className="space-y-5">
      <h1 className="text-[28px] font-bold">Employees</h1>
      {navigation}
      <AdminDataBoundary>{tab === "absences" ? <StaffAbsences /> : <OwnerMessages key={employee ?? ""} initialStaffId={employee ?? ""} />}</AdminDataBoundary>
    </div>;
  }
  return <RecordsPage kind="staff" search={q} navigation={navigation} archived={tab === "archive"}
    onSearch={q => { void navigate({ search: { q, tab }, replace: true }); }} />;
}
