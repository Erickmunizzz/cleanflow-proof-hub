import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Zap } from "lucide-react";
import { toast } from "sonner";
import { adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const activeId = pathname === "/admin" || pathname === "/admin/" ? "overview" : pathname.split("/")[2];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-[15px] font-bold leading-none tracking-tight">CleanFlow UK</div>
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
                    to={item.id === "overview" ? "/admin" : "/admin/$section"}
                    params={item.id === "overview" ? undefined : { section: item.id }}
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
            Get 50 staff seats, API access & priority support.
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
            E
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium leading-none">elorwen</div>
            <div className="text-[11px] text-muted-foreground">Admin • London</div>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
          </div>
        </div>
        <button
          onClick={() => toast("Sign-in will be added in a later step")}
          className="group mt-2 flex w-full items-center gap-2 rounded-xl border border-transparent px-2 py-2.5 text-[13px] font-medium text-muted-foreground transition hover:border-danger-border hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
