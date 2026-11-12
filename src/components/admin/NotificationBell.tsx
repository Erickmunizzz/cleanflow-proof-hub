import {toast} from "sonner";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "./AdminSession";

export function NotificationBell() {
  const session = useAdminSession();
  // Remount on account changes so another account never inherits the open inbox.
  return session ? <Inbox key={session.user.id} userId={session.user.id} /> : null;
}

function Inbox({ userId }: { userId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const size = 20;
  const profile = useQuery({
    queryKey: ["notification-profile", userId],
    queryFn: async () => {
      const result = await supabase.from("profiles").select("company_id").eq("id", userId).eq("is_active", true).single();
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
  });
  const companyId = profile.data?.company_id;
  const key = ["notifications", userId, companyId];
  const count = useQuery({
    queryKey: [...key, "unread"], enabled: Boolean(companyId),
    queryFn: async () => {
      const result = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("company_id", companyId!).eq("is_read", false);
      if (result.error) throw new Error(result.error.message);
      return result.count ?? 0;
    },
  });
  const list = useQuery({
    queryKey: [...key, "list", page], enabled: Boolean(companyId) && open,
    queryFn: async () => {
      const result = await supabase.from("notifications").select("*", { count: "exact" }).eq("user_id", userId).eq("company_id", companyId!)
        .order("created_at", { ascending: false }).order("id", { ascending: false }).range(page * size, (page + 1) * size - 1);
      if (result.error) throw new Error(result.error.message);
      return { rows: result.data, total: result.count ?? 0 };
    },
  });
  useEffect(() => {
    if (!companyId) return;
    const refresh = () => { void client.invalidateQueries({ queryKey: ["notifications", userId, companyId] }); };
    const channel = supabase.channel(`notifications-${userId}-${companyId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, payload => { refresh(); if (String(payload.new['title']).startsWith("Employee alert:")) toast.warning(String(payload.new['title']), { description: String(payload.new['message']) }); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, refresh)
      .subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
    return () => { void supabase.removeChannel(channel); };
  }, [client, userId, companyId]);
  async function markRead(id: string) {
    if (pending || !companyId) return;
    setPending(id); setError("");
    try {
      const result = await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", userId).eq("company_id", companyId).select("id").single();
      if (result.error) throw new Error(result.error.message);
      await client.invalidateQueries({ queryKey: key });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not mark notification as read."); }
    finally { setPending(null); }
  }
  const failure = profile.error || count.error || list.error;
  return <Popover open={open} onOpenChange={value => { setOpen(value); if (value) { setPage(0); void client.invalidateQueries({ queryKey: key }); } }}>
    <PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative rounded-xl" aria-label={count.data === undefined ? "Notifications" : `Notifications, ${count.data} unread`}>
      <Bell className="size-5" />
      {(count.data ?? 0) > 0 && <span aria-live="polite" className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count.data}</span>}
      {failure && <span className="absolute right-0 top-0 text-xs text-destructive" aria-label="Notification loading error">!</span>}
    </Button></PopoverTrigger>
    <PopoverContent align="end" className="w-[min(380px,calc(100vw-24px))] rounded-xl p-0">
      <h2 className="border-b border-border px-4 py-3 font-semibold">Notifications</h2>
      {error && <p role="alert" className="px-4 py-2 text-sm text-destructive">{error}</p>}
      {failure ? <p role="alert" className="p-4 text-sm text-destructive">{failure.message}</p> : profile.isPending || list.isPending ? <p className="p-4 text-sm">Loading notifications…</p> : <>
        <div className="max-h-[55dvh] overflow-y-auto">{list.data?.rows.map(item => <button key={item.id} type="button" disabled={pending !== null} onClick={() => { if (!item.is_read) void markRead(item.id); }} className={`block w-full border-b border-border px-4 py-3 text-left hover:bg-accent disabled:opacity-60 ${item.is_read ? "" : "bg-primary-soft"}`}>
          <div className="text-sm font-semibold">{!item.is_read && <span className="mr-2 text-primary" aria-label="Unread">●</span>}{item.title}</div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">{item.message}</p>
          <time dateTime={item.created_at} className="mt-2 block text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("en-GB")}</time>
        </button>)}{!list.data?.rows.length && <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</p>}</div>
        <footer className="flex justify-between p-3"><Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</Button><Button variant="ghost" size="sm" disabled={(page + 1) * size >= (list.data?.total ?? 0)} onClick={() => setPage(value => value + 1)}>Next</Button></footer>
      </>}
    </PopoverContent>
  </Popover>;
}
