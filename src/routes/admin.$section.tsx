import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findAdminNavItem } from "@/lib/admin-nav";

export const Route = createFileRoute("/admin/$section")({
  loader: ({ params }) => {
    const item = findAdminNavItem(params.section);
    if (!item) throw notFound();
    return { label: item.label };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.label ?? "Admin"} — CleanFlow UK` },
      { name: "description", content: "CleanFlow UK admin workspace for commercial cleaning operations." },
    ],
  }),
  component: SectionPlaceholder,
});

function SectionPlaceholder() {
  const { label } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <h1 className="text-[26px] font-bold tracking-tight">{label}</h1>
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
        <div className="text-[15px] font-semibold">This screen is being rebuilt</div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {label} will be brought over from the prototype in an upcoming step.
        </p>
        <Link
          to="/admin"
          className="mt-5 inline-flex h-9 items-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
