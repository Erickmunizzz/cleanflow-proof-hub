import { useState } from "react";
import { CircleHelp, LogOut, Menu, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "./NotificationBell";
import { useAdminAccount } from "./AdminSession";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ onToggleMenu }: { onToggleMenu: () => void }) {
  const [query, setQuery] = useState("");
  const account = useAdminAccount();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
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
      <Button variant="ghost" size="icon" onClick={onToggleMenu} className="-ml-2 shrink-0 rounded-xl p-2 hover:bg-secondary lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex min-w-0 max-w-[640px] flex-1 items-center gap-3">
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

      <div className="flex shrink-0 items-center gap-1">
        <a
          href="mailto:support@cleanmaapp.com?subject=Suporte%20CleanMa%20UK"
          title="Email support — support@cleanmaapp.com"
          aria-label="Email CleanMa UK support"
          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary"
        >
          <CircleHelp className="h-5 w-5" />
        </a>

        <NotificationBell />
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">{initials}</div>
          <span className="hidden max-w-32 truncate text-[13px] font-medium sm:block">{account?.name || "Signed out"}</span>
        </div>
        {account && <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}><LogOut className="h-4 w-4" /></Button>}
      </div>
    </header>
  );
}
