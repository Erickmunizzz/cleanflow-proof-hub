import { createFileRoute } from "@tanstack/react-router";
import { findAdminNavItem } from "@/lib/admin-nav";
import { OperationsSection } from "@/components/admin/OperationsSection";
import { AdminRecordsError } from "@/components/admin/AdminRecordsError";

export const Route = createFileRoute("/admin/$section")({
  head: ({ params }) => ({
    meta: [
      { title: "CleanMa" },
      { name: "description", content: "CleanMa admin workspace for commercial cleaning operations." },
      { property: "og:title", content: `${findAdminNavItem(params.section)?.label ?? "Unavailable"} — CleanMa` },
      { property: "og:description", content: `Cleaning operations: ${findAdminNavItem(params.section)?.label ?? "Unavailable"}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SectionPage,
  errorComponent: AdminRecordsError,
});

function SectionPage() {
  const { section } = Route.useParams();
  const item = findAdminNavItem(section);
  if (!item) return <h1 className="text-xl font-semibold">Page not found</h1>;
  return <OperationsSection section={section} label={item.label} />;
}
