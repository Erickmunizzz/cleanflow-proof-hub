import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [
      { title: "CleanFlow UK — Cleaning Operations & Proof of Service" },
      { name: "description", content: "Operations and proof-of-service platform for UK commercial cleaning companies." },
      { property: "og:title", content: "CleanFlow UK — Cleaning Operations & Proof of Service" },
      { property: "og:description", content: "Operations and proof-of-service platform for UK commercial cleaning companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
