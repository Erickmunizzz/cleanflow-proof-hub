import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin/SettingsPage";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [
    { title: "System Settings — CleanFlow UK" },
    { name: "description", content: "Company details, system preferences and policy settings for your CleanFlow UK workspace." },
    { property: "og:title", content: "System Settings — CleanFlow UK" },
    { property: "og:description", content: "Company details, system preferences and policy settings for your CleanFlow UK workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: SettingsPage,
});