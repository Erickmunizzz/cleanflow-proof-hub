import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { getSettingsBankHolidays, slackWebhookPattern, testSettingsSlack } from "@/lib/settings-external.functions";

export const financeSections = [
  { id: "invoice-intervals", title: "Invoice Intervals", description: "Invoice cadence and upcoming issue estimate" },
  { id: "wage-rates", title: "Wage and Supplement Rates", description: "Hourly rates, premiums and UK bank holidays" },
  { id: "integrations", title: "Integrations", description: "Xero, Faster Payments / Stripe and Slack" },
] as const;
type Section = (typeof financeSections)[number]["id"];
type Invoice = Tables<"company_invoice_preferences">;
type Wage = Tables<"company_wage_preferences">;
type Integrations = Tables<"company_integration_preferences">;

const dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" });
const dateLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", dateStyle: "long" });
const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const selectClass = "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayMs = 86_400_000;
const londonToday = () => dateKey.format(new Date());

function nextInvoiceDate(rule: Invoice, today: string) {
  const current = new Date(today + "T00:00:00Z");
  if (rule.custom_cycle && rule.custom_cycle > 0) {
    const anchor = Date.parse(rule.cycle_anchor + "T00:00:00Z");
    const cycles = Math.max(1, Math.ceil((current.getTime() - anchor) / (rule.custom_cycle * dayMs)));
    return new Date(anchor + cycles * rule.custom_cycle * dayMs);
  }
  if (rule.default_interval === "monthly") {
    const dateInMonth = (offset: number) => {
      const month = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1));
      const last = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
      month.setUTCDate(Math.min(rule.invoice_month_day, last));
      return month;
    };
    const thisMonth = dateInMonth(0);
    return thisMonth >= current ? thisMonth : dateInMonth(1);
  }
  const days = (rule.invoice_weekday - current.getUTCDay() + 7) % 7;
  const candidate = current.getTime() + days * dayMs;
  if (rule.default_interval !== "biweekly") return new Date(candidate);
  const firstWeekday = Date.parse(rule.cycle_anchor + "T00:00:00Z");
  const anchorDay = new Date(firstWeekday).getUTCDay();
  const anchor = firstWeekday + ((rule.invoice_weekday - anchorDay + 7) % 7) * dayMs;
  return new Date(anchor + Math.max(0, Math.ceil((candidate - anchor) / (14 * dayMs))) * 14 * dayMs);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium">{label}{children}</label>;
}
function Toggle({ label, value, change }: { label: string; value: boolean; change: (value: boolean) => void }) {
  return <label className="flex items-center justify-between gap-3 text-sm"><span>{label}</span>
    <Switch aria-label={label} checked={value} onCheckedChange={change} />
  </label>;
}
function SaveFooter({ pending, error }: { pending: boolean; error: Error | null }) {
  return <>
    {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
    <div className="flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button></div>
  </>;
}

function InvoiceEditor({ initial, close }: { initial: Invoice; close: () => void }) {
  const [draft, setDraft] = useState(initial);
  const client = useQueryClient();
  const amount = useQuery({
    queryKey: ["invoice-preview-amount", initial.company_id],
    queryFn: async () => {
      const result = await supabase.rpc("preview_invoice_amount", { target_company: initial.company_id });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      const result = await supabase.from("company_invoice_preferences").upsert(draft);
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => { client.setQueryData(["scoped-settings", "invoice-intervals", initial.company_id], { section: "invoice-intervals", row: draft }); close(); },
  });
  function update<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  return <form className="space-y-4" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
    <fieldset disabled={save.isPending} className="grid gap-4 sm:grid-cols-2">
      <Field label="Default interval"><select className={selectClass} value={draft.default_interval} onChange={e => update("default_interval", e.target.value)}>
        <option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option><option value="monthly">Monthly</option>
      </select></Field>
      <Field label="Custom cycle (days)"><Input type="number" min={1} max={365} step={1} placeholder="Use default interval"
        value={draft.custom_cycle ?? ""} onChange={e => update("custom_cycle", e.target.value === "" ? null : Number(e.target.value))} /></Field>
      {draft.default_interval === "monthly"
        ? <Field label="Invoice day"><select className={selectClass} value={draft.invoice_month_day} onChange={e => update("invoice_month_day", Number(e.target.value))}>
          {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>Day {i + 1}</option>)}
        </select></Field>
        : <Field label="Invoice day"><select className={selectClass} value={draft.invoice_weekday} onChange={e => update("invoice_weekday", Number(e.target.value))}>
          {weekdays.map((day, i) => <option key={day} value={i}>{day}</option>)}
        </select></Field>}
      <Field label="Cycle start"><Input type="date" required value={draft.cycle_anchor} onChange={e => update("cycle_anchor", e.target.value)} /></Field>
    </fieldset>
    <Toggle label="Auto-generate invoice" value={draft.auto_generate} change={value => update("auto_generate", value)} />
    <p className="text-xs text-muted-foreground">A custom cycle overrides the invoice day. Cycle start anchors custom and bi-weekly intervals. Automatic generation requires a billing scheduler.</p>
    <div className="rounded-xl border border-border bg-surface-2 p-4" aria-live="polite">
      <p className="font-semibold">Next invoice: {draft.cycle_anchor ? dateLabel.format(nextInvoiceDate(draft, londonToday())) : "Select cycle start"} + {amount.isError ? "Estimate unavailable" : amount.data === undefined ? "Calculating…" : gbp.format(Number(amount.data))}</p>
      <p className="mt-1 text-xs text-muted-foreground">Estimate based on the total of current draft invoices.</p>
    </div>
    <SaveFooter pending={save.isPending} error={save.error} />
  </form>;
}

const rateFields = [
  ["night_multiplier", "Night multiplier (22:00–06:00)"],
  ["weekend_multiplier", "Weekend multiplier"],
  ["holiday_multiplier", "Bank Holiday multiplier"],
  ["overtime_40_multiplier", "Overtime 40h+"],
  ["overtime_48_multiplier", "Overtime 48h+"],
] as const;
const regions = { "england-and-wales": "England and Wales", scotland: "Scotland", "northern-ireland": "Northern Ireland" } as const;

function WageEditor({ initial, close }: { initial: Wage; close: () => void }) {
  const [draft, setDraft] = useState(initial);
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: async () => {
      if (draft.overtime_48_multiplier < draft.overtime_40_multiplier) throw new Error("The 48h+ multiplier must be at least the 40h+ multiplier.");
      const result = await supabase.from("company_wage_preferences").upsert(draft);
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => { client.setQueryData(["scoped-settings", "wage-rates", initial.company_id], { section: "wage-rates", row: draft }); close(); },
  });
  const calendar = useQuery({
    queryKey: ["uk-bank-holidays", draft.holiday_region],
    queryFn: () => getSettingsBankHolidays({ data: draft.holiday_region as keyof typeof regions }),
    staleTime: 3_600_000,
  });
  const nextHolidays = calendar.data?.filter(event => event.date >= londonToday()).slice(0, 3);
  const base = draft.base_hourly_rate;
  return <form className="space-y-4" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
    <fieldset disabled={save.isPending} className="grid gap-4 sm:grid-cols-2">
      <Field label="Base hourly rate (GBP)"><Input type="number" min={0} max={99999999.99} step="0.01" value={base ?? ""}
        onChange={e => setDraft({ ...draft, base_hourly_rate: e.target.value === "" ? null : Number(e.target.value) })} /></Field>
      {rateFields.map(([key, label]) => <Field key={key} label={label}><Input type="number" min={1} max={10} step="0.01" required
        value={draft[key]} onChange={e => setDraft({ ...draft, [key]: Number(e.target.value) })} /></Field>)}
      <Field label="UK Bank Holidays region"><select className={selectClass} value={draft.holiday_region} onChange={e => setDraft({ ...draft, holiday_region: e.target.value })}>
        {Object.entries(regions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></Field>
    </fieldset>
    <div className="rounded-xl border border-border p-3 text-sm">
      <a href="https://www.gov.uk/bank-holidays" target="_blank" rel="noreferrer" className="font-semibold underline">Official GOV.UK bank holidays</a>
      {calendar.isPending ? <p>Loading calendar…</p> : calendar.error ? <p role="alert">Calendar unavailable. <button type="button" className="underline" onClick={() => void calendar.refetch()}>Try again</button></p> :
        <ul>{nextHolidays?.length ? nextHolidays.map(day => <li key={day.date}>{dateLabel.format(new Date(day.date + "T00:00:00Z"))} · {day.title}</li>) : <li>No upcoming dates published.</li>}</ul>}
    </div>
    <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm">
      <h3 className="font-semibold">Calculation examples</h3>
      {base === null ? <p>Enter a base hourly rate to calculate these examples.</p> : <ol className="mt-2 list-inside list-decimal space-y-1">
        <li>2 night hours × {gbp.format(base)} × {draft.night_multiplier} = {gbp.format(2 * base * draft.night_multiplier)}</li>
        <li>4 weekend hours × {gbp.format(base)} × {draft.weekend_multiplier} = {gbp.format(4 * base * draft.weekend_multiplier)}</li>
        <li>50h week with no other premiums: 40h at base, 8h at {draft.overtime_40_multiplier}× and 2h at {draft.overtime_48_multiplier}× = {gbp.format(base * (40 + 8 * draft.overtime_40_multiplier + 2 * draft.overtime_48_multiplier))}</li>
      </ol>}
      <p className="mt-2 text-xs text-muted-foreground">Examples reflect this draft. Saved rules are available for payroll integration.</p>
    </div>
    <SaveFooter pending={save.isPending} error={save.error} />
  </form>;
}

function IntegrationEditor({ initial, close }: { initial: Integrations; close: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [setup, setSetup] = useState<"xero" | "stripe" | null>(null);
  const client = useQueryClient();
  const webhook = draft.slack_webhook_url?.trim() ?? "";
  const test = useMutation({
    mutationFn: () => testSettingsSlack({ data: { companyId: initial.company_id, webhook } }),
  });
  const save = useMutation({
    mutationFn: async () => {
      if (webhook && !slackWebhookPattern.test(webhook)) throw new Error("Enter a valid Slack incoming webhook URL.");
      const result = await supabase.from("company_integration_preferences").upsert({ ...draft, slack_webhook_url: webhook || null });
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => {
      client.setQueryData(["scoped-settings", "integrations", initial.company_id], { section: "integrations", row: { ...draft, slack_webhook_url: webhook || null } });
      close();
    },
  });
  function toggle(key: "xero_sync_invoices" | "stripe_payment_links" | "slack_invoice_events" | "slack_checkin_events" | "slack_cancellation_events", value: boolean) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  const card = "space-y-3 rounded-xl border border-border bg-card p-4";
  return <form className="space-y-3" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
    <section className={card}>
      <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Xero</h3><span className="text-xs text-muted-foreground">Not connected</span></div>
      <Button type="button" variant="outline" onClick={() => setSetup("xero")}>Connect</Button>
      {setup === "xero" && <p role="status" className="text-xs text-muted-foreground">Connection requires a configured Xero OAuth app.</p>}
      <Toggle label="Sync invoices" value={draft.xero_sync_invoices} change={value => toggle("xero_sync_invoices", value)} />
    </section>
    <section className={card}>
      <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Faster Payments / Stripe</h3><span className="text-xs text-muted-foreground">Not connected</span></div>
      <p className="text-sm">1% platform fee</p>
      <Button type="button" variant="outline" onClick={() => setSetup("stripe")}>Connect</Button>
      {setup === "stripe" && <p role="status" className="text-xs text-muted-foreground">Connection requires Stripe Connect onboarding configuration.</p>}
      <Toggle label="Enable payment links + QR" value={draft.stripe_payment_links} change={value => toggle("stripe_payment_links", value)} />
    </section>
    <section className={card}>
      <h3 className="font-semibold">Slack</h3>
      <Field label="Webhook URL"><Input type="password" autoComplete="off" maxLength={512} value={draft.slack_webhook_url ?? ""}
        onChange={e => { test.reset(); setDraft({ ...draft, slack_webhook_url: e.target.value }); }} /></Field>
      <Button type="button" variant="outline" disabled={test.isPending || !slackWebhookPattern.test(webhook)} onClick={() => test.mutate()}>
        {test.isPending ? "Sending…" : "Test notification"}
      </Button>
      {test.isSuccess && <p role="status" className="text-sm text-success-strong">Test notification delivered.</p>}
      {test.error && <p role="alert" className="text-sm text-destructive">{test.error.message}</p>}
      <Toggle label="Invoice events" value={draft.slack_invoice_events} change={value => toggle("slack_invoice_events", value)} />
      <Toggle label="Check-in events" value={draft.slack_checkin_events} change={value => toggle("slack_checkin_events", value)} />
      <Toggle label="Cancellation events" value={draft.slack_cancellation_events} change={value => toggle("slack_cancellation_events", value)} />
    </section>
    <p className="text-xs text-muted-foreground">Preferences are saved independently of provider connections and event delivery.</p>
    <SaveFooter pending={save.isPending} error={save.error} />
  </form>;
}

export function ScopedFinanceSettings({ section, companyId, close }: { section: Section; companyId: string; close: () => void }) {
  const descriptor = financeSections.find(item => item.id === section)!;
  const query = useQuery({
    queryKey: ["scoped-settings", section, companyId],
    queryFn: async () => {
      if (section === "invoice-intervals") {
        const { data, error } = await supabase.from("company_invoice_preferences").select("*").eq("company_id", companyId).maybeSingle();
        if (error) throw new Error(error.message);
        return { section, row: data ?? { company_id: companyId, default_interval: "monthly", custom_cycle: null, invoice_weekday: 1, invoice_month_day: 1, cycle_anchor: londonToday(), auto_generate: false } } as const;
      }
      if (section === "wage-rates") {
        const { data, error } = await supabase.from("company_wage_preferences").select("*").eq("company_id", companyId).maybeSingle();
        if (error) throw new Error(error.message);
        return { section, row: data ?? { company_id: companyId, base_hourly_rate: null, night_multiplier: 1.5, weekend_multiplier: 1.5, holiday_multiplier: 2, overtime_40_multiplier: 1.5, overtime_48_multiplier: 2, holiday_region: "england-and-wales" } } as const;
      }
      const { data, error } = await supabase.from("company_integration_preferences").select("*").eq("company_id", companyId).maybeSingle();
      if (error) throw new Error(error.message);
      return { section, row: data ?? { company_id: companyId, xero_sync_invoices: false, stripe_payment_links: false, slack_webhook_url: null, slack_invoice_events: false, slack_checkin_events: false, slack_cancellation_events: false } } as const;
    },
  });
  return <Dialog open onOpenChange={value => { if (!value) close(); }}>
    <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-[640px]">
      <DialogHeader><DialogTitle>{descriptor.title}</DialogTitle><DialogDescription>{descriptor.description}</DialogDescription></DialogHeader>
      {query.isPending ? <p role="status">Loading preferences…</p> : query.error ? <div role="alert"><p>{query.error.message}</p>
        <Button variant="outline" onClick={() => void query.refetch()}>Try again</Button></div> :
        query.data.section === "invoice-intervals" ? <InvoiceEditor initial={query.data.row} close={close} /> :
        query.data.section === "wage-rates" ? <WageEditor initial={query.data.row} close={close} /> :
        <IntegrationEditor initial={query.data.row} close={close} />}
    </DialogContent>
  </Dialog>;
}
