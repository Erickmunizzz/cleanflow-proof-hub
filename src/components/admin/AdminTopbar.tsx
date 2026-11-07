import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, CircleHelp, LogOut, Menu, Search, Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const configItems = [
  "General settings",
  "Welcome messages",
  "Cleaning types",
  "Absence types",
  "Notification types",
  "Resource categories",
];

type Account = { name: string; email: string };

export function AdminTopbar({ onToggleMenu }: { onToggleMenu: () => void }) {
  const [query, setQuery] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    let active = true;
    const loadAccount = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error || !data.user) {
        setAccount(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, is_active")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!active) return;
      if (profile?.role === "owner" && profile.is_active) {
        setAccount({
          name: profile.full_name || data.user.email || "Owner",
          email: data.user.email || "",
        });
      } else {
        setAccount(null);
      }
    };

    void loadAccount();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void loadAccount(), 0);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    setProfileOpen(false);
    toast.success("Signed out");
  };

  const initials = account?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "O";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      <button onClick={onToggleMenu} className="-ml-2 rounded-xl p-2 hover:bg-secondary lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex max-w-[640px] flex-1 items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, tasks, inventory..."
            className="h-10 w-full rounded-xl border border-transparent bg-surface-2 pl-10 pr-4 text-[13.5px] outline-none transition focus:border-primary focus:bg-card"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <a
          href="mailto:support@cleanflow.uk?subject=Support%20CleanFlow%20UK"
          title="Support - support@cleanflow.uk"
          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary"
        >
          <CircleHelp className="h-5 w-5" />
        </a>

        <div className="relative">
          <button
            onClick={() => { setConfigOpen(!configOpen); setProfileOpen(false); }}
            aria-label="System configuration"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl transition",
              configOpen ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <Settings className="h-5 w-5" />
          </button>
          {configOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-2xl border border-border bg-popover p-2 shadow-xl">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                System Configuration
              </div>
              {configItems.map((c) => (
                <Link
                  key={c}
                  to="/admin/$section"
                  params={{ section: "settings" }}
                  onClick={() => setConfigOpen(false)}
                  className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-accent"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-6 w-px bg-border" />

        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setConfigOpen(false); }}
            className={cn(
              "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition",
              profileOpen ? "bg-ink text-ink-foreground" : "hover:bg-secondary",
            )}
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">{initials}</div>
            <span className="hidden max-w-32 truncate text-[13px] font-medium sm:block">{account?.name || "Owner"}</span>
            <ChevronDown className={cn("hidden h-4 w-4 transition sm:block", profileOpen && "rotate-180")} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[220px] rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
              <div className="px-3 py-2">
                <div className="truncate text-[13px] font-semibold">{account?.name || "Owner"}</div>
                <div className="truncate text-[11px] text-muted-foreground">{account?.email || "Signed out"}</div>
              </div>
              <div className="my-1 h-px bg-border" />
              <Link
                to="/admin/$section"
                params={{ section: "settings" }}
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-accent"
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] text-destructive hover:bg-accent"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
