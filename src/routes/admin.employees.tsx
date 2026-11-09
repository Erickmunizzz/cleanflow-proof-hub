import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDataBoundary } from "@/components/admin/AdminSession";
import { StaffAbsences } from "@/components/admin/StaffAbsences";
import { Button } from "@/components/ui/button";
import { RecordsPage } from "@/components/admin/RecordsPage";
import { AdminRecordsError } from "@/components/admin/AdminRecordsError";
export const Route = createFileRoute("/admin/employees")({
  validateSearch: (search: Record<string, unknown>): { q: string; tab?: "absences" | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    tab: search["tab"] === "absences" ? "absences" : undefined,
  }),
  head: () => ({ meta: [
    { title: "Staff — CleanFlow UK" },
    { name: "description", content: "Staff records in your CleanFlow UK workspace." },
    { property: "og:title", content: "Staff — CleanFlow UK" },
    { property: "og:description", content: "Staff records in your CleanFlow UK workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
  errorComponent: AdminRecordsError,
});
function Page() {
  const { q, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="space-y-5">
      <nav aria-label="Staff sections" className="flex flex-wrap gap-2 border-b border-border pb-3">
        <Button asChild variant={tab ? "ghost" : "secondary"}>
          <Link to="/admin/employees" search={{ q }} aria-current={!tab ? "page" : undefined}>Staff</Link>
        </Button>
        <Button asChild variant={tab ? "secondary" : "ghost"}>
          <Link to="/admin/employees" search={{ q, tab: "absences" }} aria-current={tab ? "page" : undefined}>Absences / Time Off</Link>
        </Button>
      </nav>
      {tab === "absences" ? (
        <AdminDataBoundary><StaffAbsences /></AdminDataBoundary>
      ) : (
        <RecordsPage kind="staff" search={q} onSearch={q => { void navigate({ search: { q }, replace: true }); }} />
      )}
    </div>
  );
}
