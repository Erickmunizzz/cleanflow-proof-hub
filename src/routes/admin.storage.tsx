import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage, inventoryTabs } from "@/components/admin/InventoryPage";
import { AdminRecordsError } from "@/components/admin/AdminRecordsError";
export const Route = createFileRoute("/admin/storage")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    tab: inventoryTabs.find(tab => tab === search["tab"]),
  }),
  head: () => ({ meta: [
    { title: "CleanMa" },
    { name: "description", content: "Materials & Replenishment records in your CleanMa workspace." },
    { property: "og:title", content: "Materials & Replenishment — CleanMa" },
    { property: "og:description", content: "Materials & Replenishment records in your CleanMa workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
  errorComponent: AdminRecordsError,
});
function Page() {
  const { q, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  return <InventoryPage
    search={q}
    tab={tab ?? "Inventory"}
    onSearch={q => { void navigate({ search: { q, tab }, replace: true }); }}
    onTabChange={tab => { void navigate({ search: { q, tab: tab === "Inventory" ? undefined : tab } }); }}
  />;
}
