import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdminAccount, useAdminSession } from "./AdminSession";

export function AdminSidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const account = useAdminAccount();
  const session = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initials = account?.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "—";
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) { toast.error(error.message); return; }
    onNavigate();
    await navigate({ to: "/auth", replace: true });
  }
  const activeId = pathname === "/admin" || pathname === "/admin/" ? "overview" : pathname.split("/")[2];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <img src="/cleanma-logo.png" alt="CleanMa logo" className="h-8 w-12 shrink-0 rounded object-contain" />
        <div>
          <div className="text-[15px] font-bold leading-none tracking-tight">CleanMa</div>
          <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">Modern Cleaning Ops</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {adminNav.map((g) => (
          <div key={g.group}>
            <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {g.group}
            </div>
            <div className="space-y-1">
              {g.items.map((item) => {
                const active = activeId === item.id;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    {...(item.id === "overview"
                      ? { to: "/admin" as const }
                      : { to: "/admin/$section" as const, params: { section: item.id } })}
                    onClick={onNavigate}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-all",
                      active
                        ? "bg-primary-soft text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px]", active ? "text-primary" : "text-muted-foreground/70")} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-success px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="relative overflow-hidden rounded-xl bg-ink p-4 text-ink-foreground">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ink-foreground/10 blur-xl" />
          <div className="text-[12px] font-semibold opacity-90">Upgrade to Scale</div>
          <div className="mt-1 text-[11px] leading-snug opacity-60">
            Up to 20 active staff and 1,000 jobs per month.
          </div>
          <Link
            to="/admin/$section"
            params={{ section: "settings" }}
            onClick={onNavigate}
            className="mt-3 block w-full rounded-lg bg-card py-2 text-center text-[12px] font-semibold text-foreground transition hover:bg-secondary"
          >
            View Plans
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-2 px-2 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium leading-none" title={account?.name}>{account?.name || (session === undefined ? "Loading…" : "Signed out")}</div>
            <div className="text-[11px] text-muted-foreground">{account ? "Workspace account" : "CleanMa"}</div>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary">
            <div className={cn("h-2 w-2 rounded-full", account ? "bg-success" : "bg-muted-foreground")} />
          </div>
        </div>
        <Button variant="ghost"
          disabled={!session}
          onClick={() => void signOut()}
          className="group mt-2 flex w-full items-center gap-2 rounded-xl border border-transparent px-2 py-2.5 text-[13px] font-medium text-muted-foreground transition hover:border-danger-border hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
}
