import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { readAllRows } from "@/lib/supabase-pages";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export function RecurringInvoiceCustomers({ companyId }: { companyId: string }) {
  const client = useQueryClient();
  const key = ["recurring-invoice-customers", companyId];
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("30");
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const [customers, charges] = await Promise.all([
        readAllRows((a, b) => supabase.from("clients").select("id,name,is_archived").eq("company_id", companyId).order("name").order("id").range(a, b)),
        readAllRows((a, b) => supabase.from("recurring_invoice_customers").select("*").eq("company_id", companyId).order("customer_id").range(a, b)),
      ]);
      return { customers, charges };
    },
  });
  const save = useMutation({
    mutationFn: async (remove: boolean) => {
      const result = remove
        ? await supabase.from("recurring_invoice_customers").delete().eq("company_id", companyId).eq("customer_id", customer)
        : await supabase.from("recurring_invoice_customers").upsert({ company_id: companyId, customer_id: customer,
            amount: Number(amount), payment_terms_days: Number(days) });
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: async () => {
      await Promise.all([client.invalidateQueries({ queryKey: key }), client.invalidateQueries({ queryKey: ["invoice-preview-amount", companyId] })]);
      setCustomer(""); setAmount(""); setDays("30");
    },
  });
  function select(id: string) {
    const charge = query.data?.charges.find(row => row.customer_id === id);
    setCustomer(id); setAmount(charge ? String(charge.amount) : ""); setDays(String(charge?.payment_terms_days ?? 30));
    save.reset();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (customer && !save.isPending) save.mutate(false);
  }
  return <section className="space-y-3 border-t border-border pt-4">
    <h3 className="font-semibold">Recurring invoice customers</h3>
    <p className="text-xs text-muted-foreground">Set a fixed amount per billing cycle. Active customers with a saved amount receive draft invoices on the configured dates.</p>
    {query.isPending ? <p role="status">Loading recurring charges…</p> : query.error ? <p role="alert">{query.error.message}</p> :
      <form onSubmit={submit} className="space-y-3">
        <fieldset disabled={save.isPending} className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm sm:col-span-2">Customer
            <select className="h-10 rounded-xl border border-input bg-background px-3" required value={customer} onChange={e => select(e.target.value)}>
              <option value="">Select customer</option>
              {query.data.customers.filter(row => !row.is_archived || query.data.charges.some(charge => charge.customer_id === row.id))
                .map(row => {
                  const charge = query.data.charges.find(item => item.customer_id === row.id);
                  return <option key={row.id} value={row.id}>{row.name}{row.is_archived ? " (archived)" : ""}{charge ? ` · ${money.format(charge.amount)}` : ""}</option>;
                })}
            </select>
          </label>
          <label className="grid gap-1 text-sm">Amount per cycle (GBP)
            <Input type="number" required min="0.01" max="9999999999.99" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">Payment terms (days)
            <Input type="number" required min={0} max={365} step={1} value={days} onChange={e => setDays(e.target.value)} />
          </label>
        </fieldset>
        {save.error && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" disabled={save.isPending || !customer}>Save customer charge</Button>
          {query.data.charges.some(row => row.customer_id === customer) &&
            <Button type="button" size="sm" variant="outline" disabled={save.isPending} onClick={() => save.mutate(true)}>Remove charge</Button>}
        </div>
      </form>}
  </section>;
}
