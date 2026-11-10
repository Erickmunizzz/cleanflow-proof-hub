import { SubscriptionProvider } from "@/components/admin/SubscriptionProvider";
import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen overflow-x-clip bg-background text-foreground">
      <AdminSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}
      <div className="min-w-0 flex-1 lg:pl-[260px]">
        <AdminTopbar onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="mx-auto max-w-[1400px] p-4 lg:p-8">
          <SubscriptionProvider><Outlet /></SubscriptionProvider>
        </main>
      </div>
    </div>
  );
}
