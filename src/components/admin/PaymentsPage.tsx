import { useSubscription } from "./SubscriptionProvider";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link2, Users } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";
import { readAllRows } from "@/lib/supabase-pages";

const formatter = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const money = (pence: number) => formatter.format(pence / 100);
const card = "min-w-0 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card";
const select = "h-10 rounded-xl border border-input bg-background px-3 text-sm";
const lockedText = "Upgrade to Scale to unlock";
const stripePricing = "https://stripe.com/gb/pricing";
const goCardlessPricing = "https://gocardless.com/pricing/";
const fca = "https://www.fca.org.uk/firms/payment-services-regulations";

export function PaymentsPage() {
  const subscription = useSubscription();
  const { data: { companyId } } = useSuspenseQuery(ownerContextOptions);
  const plan = useQuery({
    queryKey: ["payments-plan", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("plan").eq("id", companyId).single();
      if (error) throw new Error(error.message);
      return data.plan;
    },
  });
  const enabled = subscription.canUse("payments");
  return <main className="space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="text-[28px] font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">Create demo collection links and record simulated team payouts.</p>
      </div>
      <div className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold capitalize">
        {plan.isPending ? "Checking plan…" : plan.error ? "Plan unavailable" : `${plan.data} · Demo mode`}
      </div>
    </header>
    {plan.error && <p role="alert" className="text-sm text-destructive">Could not verify your plan. <button className="underline" onClick={() => void plan.refetch()}>Try again</button></p>}
    <section className={card}>
      <h2 className="text-lg font-semibold">How the 1% fee works</h2>
      <ol className="grid list-inside list-decimal gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
        <li>Choose a client and enter the amount to collect.</li>
        <li>Generate a demo payment link and its QR code.</li>
        <li>Review the gateway estimate and the 1% CleanFlow platform fee.</li>
        <li>See the estimated amount you receive after both fees.</li>
      </ol>
    </section>
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <CollectFromClient key={`collect-${companyId}`} companyId={companyId} enabled={enabled} checking={plan.isPending} />
      <PayTeam key={`team-${companyId}`} companyId={companyId} enabled={enabled} />
    </div>
    <section className={card} aria-labelledby="payments-faq">
      <h2 id="payments-faq" className="text-lg font-semibold">Frequently asked questions</h2>
      <div className="divide-y divide-border">
        <details className="py-3"><summary className="cursor-pointer font-medium">Do I need FCA licence?</summary>
          <p className="mt-2 text-sm text-muted-foreground">The demo moves no money. For live payments, whether FCA authorisation or registration is required depends on the activities you carry out and how funds flow. Check the <a className="underline" href={fca}>FCA payment services guidance</a> before going live.</p>
        </details>
        <details className="py-3"><summary className="cursor-pointer font-medium">What if client doesn't pay?</summary>
          <p className="mt-2 text-sm text-muted-foreground">Follow up with the client and keep the invoice unpaid until receipt is confirmed. A demo link records a simulation and cannot settle an invoice.</p>
        </details>
        <details className="py-3"><summary className="cursor-pointer font-medium">Stripe vs GoCardless fees?</summary>
          <p className="mt-2 text-sm text-muted-foreground">This demo uses 1.5% + 20p, the Stripe standard UK card benchmark, plus the 1% CleanFlow fee. GoCardless uses bank payments and separate pricing. Check the published <a className="underline" href={stripePricing}>Stripe</a> and <a className="underline" href={goCardlessPricing}>GoCardless</a> rates for live payments.</p>
        </details>
      </div>
    </section>
  </main>;
}

function CollectFromClient({ companyId, enabled, checking }: { companyId: string; enabled: boolean; checking: boolean }) {
  const subscription = useSubscription();
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("stripe");
  const [copyStatus, setCopyStatus] = useState("");
  const customers = useQuery({
    queryKey: ["payment-customers", companyId],
    queryFn: () => readAllRows((a, b) => supabase.from("clients").select("id,name")
      .eq("company_id", companyId).eq("is_archived", false).order("name").order("id").range(a, b)),
  });
  const gross = /^\d{1,7}(\.\d{1,2})?$/.test(amount) ? Math.round(Number(amount) * 100) : 0;
  const valid = gross >= 100 && gross <= 100_000_000;
  const gateway = valid ? Math.round(gross * 15 / 1000) + 20 : 0;
  const platform = valid ? Math.round(gross / 100) : 0;
  const create = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("create_demo_collection", {
        target_company: companyId, target_customer: customer, provider_name: provider, gross_pence: gross,
      });
      if (error) throw new Error(error.message);
      return new URL(`/payments/demo/${data.id}`, window.location.origin).href;
    },
  });
  function resetLink() { create.reset(); setCopyStatus(""); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enabled && customer && valid && !create.isPending) create.mutate();
  }
  return <section className={card}>
    <h2 className="flex items-center gap-2 text-lg font-semibold"><Link2 className="size-5 text-primary" />Collect from Client</h2>
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={create.isPending} className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold uppercase">Client
          <select className={select} required value={customer} onChange={event => { setCustomer(event.target.value); resetLink(); }}>
            <option value="">{customers.isPending ? "Loading clients…" : "Select client"}</option>
            {customers.data?.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase">Amount (GBP)
          <Input type="number" inputMode="decimal" min="1" max="1000000" step="0.01" required value={amount} placeholder="0.00"
            onChange={event => { setAmount(event.target.value); resetLink(); }} />
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase sm:col-span-2">Demo provider
          <select className={select} value={provider} onChange={event => { setProvider(event.target.value); resetLink(); }}>
            <option value="stripe">Stripe</option><option value="gocardless">GoCardless</option>
          </select>
        </label>
      </fieldset>
      {customers.error && <p role="alert" className="text-sm text-destructive">{customers.error.message}</p>}
      <dl className="space-y-2 rounded-xl border border-border bg-surface-2 p-4 text-sm">
        {[["Client pays", gross], ["Gateway estimate (1.5% + 20p)", gateway], ["Platform Fee 1%", platform],
          ["You receive", valid ? gross - gateway - platform : 0]].map(([label, value]) =>
          <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd className="shrink-0 font-semibold tabular-nums">{valid ? money(Number(value)) : "—"}</dd></div>)}
      </dl>
      <Button type={enabled ? "submit" : "button"} className="w-full whitespace-normal" disabled={checking || (enabled && (!valid || !customer || create.isPending))}
        onClick={() => { if (!enabled) subscription.requireFeature("payments"); }}>
        {checking ? "Checking plan…" : !enabled ? lockedText : create.isPending ? "Generating…" : "Generate Stripe or GoCardless Link + QR"}
      </Button>
      {create.error && <p role="alert" className="text-sm text-destructive">{create.error.message}</p>}
    </form>
    {create.data && <div className="space-y-3 rounded-xl border border-border p-4">
      <h3 className="font-semibold">Demo link ready</h3>
      <div className="w-fit rounded-lg bg-white p-3"><QRCodeSVG value={create.data} title="Demo collection link QR code" size={144} /></div>
      <a href={create.data} target="_blank" rel="noreferrer" className="block break-all text-sm text-primary underline">{create.data}</a>
      <Button type="button" variant="outline" size="sm" onClick={async () => {
        try { await navigator.clipboard.writeText(create.data); setCopyStatus("Link copied."); }
        catch { setCopyStatus("Select and copy the link above."); }
      }}>Copy link</Button>
      <p role="status" className="text-sm text-muted-foreground">{copyStatus}</p>
    </div>}
  </section>;
}

const londonMonth = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit" });
const londonDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "medium" });
function monthRange(month: string) {
  const [year, number] = month.split("-").map(Number);
  return { first_day: `${month}-01`, last_day: new Date(Date.UTC(year!, number!, 0)).toISOString().slice(0, 10) };
}

function PayTeam({ companyId, enabled }: { companyId: string; enabled: boolean }) {
  const subscription = useSubscription();
  const client = useQueryClient();
  const [month, setMonth] = useState(() => londonMonth.format(new Date()));
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<number | null>(null);
  const bounds = monthRange(month);
  const queryKey = ["demo-payable-jobs", companyId, month, page];
  const jobs = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("demo_payable_jobs", { target_company: companyId, ...bounds })
        .order("completed_at", { ascending: false }).order("job_id").range(page * 20, page * 20 + 20);
      if (error) throw new Error(error.message);
      return data;
    },
  });
  const selectedJobs = Object.keys(selected);
  const total = Object.values(selected).reduce((sum, value) => sum + value, 0);
  const payout = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("create_demo_payout", {
        target_company: companyId, ...bounds, selected_jobs: selectedJobs, expected_pence: total,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async data => {
      setSelected({}); setReceipt(data.amount_pence); setPage(0);
      await client.invalidateQueries({ queryKey: ["demo-payable-jobs", companyId] });
    },
    onError: () => { setSelected({}); void client.invalidateQueries({ queryKey: ["demo-payable-jobs", companyId] }); },
  });
  return <section className={card}>
    <h2 className="flex items-center gap-2 text-lg font-semibold"><Users className="size-5 text-primary" />Pay Team</h2>
    <label className="grid max-w-56 gap-1 text-xs font-semibold uppercase">Completed jobs month
      <Input type="month" min="1900-01" max="9999-12" value={month} disabled={payout.isPending} onChange={event => {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value)) return;
        setMonth(event.target.value); setPage(0); setSelected({}); setReceipt(null); payout.reset();
      }} />
    </label>
    <p className="text-xs text-muted-foreground">Amounts use saved rates, worked hours and supplements. Select up to 50 jobs for a demo payout.</p>
    {jobs.isPending ? <p role="status" className="text-sm">Loading completed jobs…</p> : jobs.error ? <p role="alert" className="text-sm text-destructive">{jobs.error.message}</p> :
      <div className="space-y-2">
        {!jobs.data.length && <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No completed jobs awaiting demo payout in this month.</p>}
        {jobs.data.slice(0, 20).map(job => {
          const amount = job.amount_pence ?? 0;
          const checked = Object.hasOwn(selected, job.job_id);
          return <label key={job.job_id} className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
            <input type="checkbox" className="mt-1 size-4 accent-primary" checked={checked}
              disabled={!enabled || amount <= 0 || payout.isPending || (!checked && selectedJobs.length >= 50)}
              onChange={event => {
                const next = { ...selected };
                if (event.target.checked) next[job.job_id] = amount; else delete next[job.job_id];
                setSelected(next); setReceipt(null);
              }} />
            <span className="min-w-0 flex-1"><strong className="break-words">{job.title}</strong>
              <span className="block text-xs text-muted-foreground">{job.employee ?? "Unassigned"} · {londonDate.format(new Date(job.completed_at))}</span>
            </span>
            <span className="text-right font-medium">{amount > 0 ? money(amount) : "No payable amount"}</span>
          </label>;
        })}
        {(page > 0 || jobs.data.length > 20) && <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page === 0 || payout.isPending} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={jobs.data.length <= 20 || payout.isPending} onClick={() => setPage(page + 1)}>Next</Button>
        </div>}
      </div>}
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
      <span>Total payout · {selectedJobs.length} selected</span><strong>{money(total)}</strong>
    </div>
    <Button type="button" className="w-full" disabled={enabled && (!total || payout.isPending)} onClick={() => { if (subscription.requireFeature("payments")) payout.mutate(); }}>
      {!enabled ? lockedText : payout.isPending ? "Recording demo payout…" : `Pay ${money(total)}`}
    </Button>
    {!enabled && <p className="text-xs text-muted-foreground">{lockedText}</p>}
    {payout.error && <p role="alert" className="text-sm text-destructive">{payout.error.message}</p>}
    {receipt !== null && <p role="status" className="text-sm text-success-strong">Demo payout recorded for {money(receipt)}. No funds were moved.</p>}
  </section>;
}
