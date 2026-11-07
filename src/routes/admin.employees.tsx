import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/admin/RecordsPage";
import { AdminRecordsError } from "@/components/admin/AdminRecordsError";
export const Route = createFileRoute("/admin/employees")({
  validateSearch: (search: Record<string, unknown>) => ({ q: typeof search['q'] === "string" ? search['q'] : "" }),
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
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  return <RecordsPage kind="staff" search={q} onSearch={q => { void navigate({ search: { q }, replace: true }); } } />;
}
