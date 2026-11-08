import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ownerContextOptions } from "@/lib/owner-context";
import { readAllRows } from "@/lib/supabase-pages";

type CleanerRecipient = Pick<Tables<"staff">, "id" | "name" | "email" | "profile_id">;
type Message = Pick<Tables<"messages">, "id" | "sender_id" | "recipient_id" | "body" | "created_at">;

const card = "rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]";

export function OwnerMessages() {
  const queryClient = useQueryClient();
  const ownerQuery = useQuery(ownerContextOptions);
  const owner = ownerQuery.data;
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [draft, setDraft] = useState("");

  const staffQuery = useQuery({
    queryKey: ["message-staff", owner?.companyId],
    enabled: Boolean(owner?.companyId),
    queryFn: async () => {
      if (!owner?.companyId) return [];
      const data = await readAllRows((a, b) => supabase
        .from("staff")
        .select("id, name, email, profile_id")
        .eq("company_id", owner.companyId)
        .eq("is_active", true)
        .not("profile_id", "is", null)
        .order("name").order("id").range(a, b));
      return data as CleanerRecipient[];
    },
  });

  const staff = staffQuery.data ?? [];
  useEffect(() => {
    if (!staff.some((person) => person.id === selectedStaffId)) {
      setSelectedStaffId(staff[0]?.id ?? "");
    }
  }, [selectedStaffId, staff]);

  const recipient = staff.find((person) => person.id === selectedStaffId);
  const recipientProfileId = recipient?.profile_id ?? null;

  const conversationQuery = useQuery({
    queryKey: ["messages", owner?.companyId, owner?.ownerId, recipientProfileId],
    enabled: Boolean(owner && recipientProfileId),
    queryFn: async () => {
      if (!owner || !recipientProfileId) return [];
      const data = await readAllRows((a, b) => supabase
        .from("messages")
        .select("id, sender_id, recipient_id, body, created_at")
        .eq("company_id", owner.companyId)
        .or(
          `and(sender_id.eq.${owner.ownerId},recipient_id.eq.${recipientProfileId}),and(sender_id.eq.${recipientProfileId},recipient_id.eq.${owner.ownerId})`,
        )
        .order("created_at", { ascending: true }).order("id").range(a, b));
      return data as Message[];
    },
  });

  useEffect(() => {
    if (!owner?.companyId) return;
    const channel = supabase
      .channel(`owner-messages-${owner.companyId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `company_id=eq.${owner.companyId}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["messages", owner.companyId] });
        },
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [owner?.companyId, recipientProfileId, queryClient]);

  const send = useMutation({
    mutationFn: async ({ recipientId, body }: { recipientId: string; body: string }) => {
      if (!owner) throw new Error("Owner session is unavailable.");
      const { error } = await supabase.from("messages").insert({
        company_id: owner.companyId,
        sender_id: owner.ownerId,
        recipient_id: recipientId,
        body,
      });
      if (error) throw error;
    },
    onSuccess: async (_result, variables) => {
      setDraft("");
      await queryClient.invalidateQueries({
        queryKey: ["messages", owner?.companyId, owner?.ownerId, variables.recipientId],
      });
      toast.success("Message sent");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const messages = conversationQuery.data ?? [];

  if (ownerQuery.isLoading) return <p className="text-sm text-muted-foreground">Loading messages…</p>;
  if (ownerQuery.isError) return <div role="alert" className={`${card} p-6 text-sm text-danger`}>Couldn't load owner workspace: {ownerQuery.error.message}</div>;

  return (
    <section className={`${card} space-y-4 p-5`} aria-label="Staff messages">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold">Messages</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Messages are delivered in the cleaner app.</p>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
          Cleaner
          <select
            className="h-10 w-full min-w-0 max-w-xs rounded-xl border border-border bg-card px-3 text-foreground outline-none focus:border-primary"
            value={selectedStaffId}
            onChange={(event) => setSelectedStaffId(event.target.value)}
            disabled={staffQuery.isLoading || staff.length === 0}
          >
            {staff.length === 0 && <option value="">{staffQuery.isLoading ? "Loading staff…" : staffQuery.isError ? "Staff unavailable" : "No linked cleaner accounts"}</option>}
            {staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </label>
      </div>

      {staffQuery.isLoading && <p className="text-sm text-muted-foreground">Loading staff…</p>}
      {staffQuery.isError && <div role="alert" className="space-y-2 text-sm text-danger"><p>Couldn't load staff: {staffQuery.error.message}</p><Button variant="outline" onClick={() => void staffQuery.refetch()}>Try again</Button></div>}
      {!staffQuery.isLoading && !staffQuery.isError && staff.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No active staff account is linked to a cleaner profile yet.
        </p>
      )}

      <>
          <div
            className="flex h-[min(55vh,560px)] min-h-[280px] flex-col gap-3 overflow-y-auto rounded-xl bg-surface-2 p-4"
            aria-live="polite"
            aria-label={`Conversation with ${recipient?.name ?? "cleaner"}`}
          >
            {!recipientProfileId && <p className="m-auto text-center text-sm text-muted-foreground">{staff.length ? "Select a cleaner to view messages." : "No conversation selected."}</p>}
            {conversationQuery.isLoading && <p className="text-sm text-muted-foreground">Loading conversation…</p>}
            {conversationQuery.isError && <p role="alert" className="text-sm text-danger">Couldn't load messages: {(conversationQuery.error as Error).message}</p>}
            {recipientProfileId && !conversationQuery.isLoading && !conversationQuery.isError && messages.length === 0 && (
              <p className="m-auto text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
            )}
            {messages.map((message) => {
              const sentByOwner = message.sender_id === owner?.ownerId;
              return (
                <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${sentByOwner ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-card text-foreground"}`}>
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <time className={`mt-1 block text-[10px] ${sentByOwner ? "text-primary-foreground/75" : "text-muted-foreground"}`} dateTime={message.created_at}>
                    {new Date(message.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </time>
                </div>
              );
            })}
          </div>

          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const body = draft.trim();
              if (!body || !recipientProfileId) return;
              send.mutate({ recipientId: recipientProfileId, body });
            }}
          >
            <textarea
              aria-label="Message"
              className="min-h-10 max-h-32 flex-1 resize-y rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder={`Message ${recipient?.name ?? "cleaner"}…`}
              value={draft}
              maxLength={5000}
              disabled={!recipientProfileId || send.isPending}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button type="submit" className="h-10 rounded-xl" disabled={send.isPending || !draft.trim() || !recipientProfileId}>
              <Send className="mr-2 size-4" /> Send
            </Button>
          </form>
      </>
    </section>
  );
}
