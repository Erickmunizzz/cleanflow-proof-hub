import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/payments/demo/$linkId")({
  head: () => ({ meta: [{ title: "Demo payment · Cleanma UK" }, { name: "robots", content: "noindex,nofollow" }, { name: "referrer", content: "no-referrer" }] }),
  component: DemoCheckout,
});

function DemoCheckout() {
  const { linkId } = Route.useParams();
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(linkId);
  const checkout = useQuery({
    queryKey: ["public-demo-checkout", linkId],
    enabled: valid,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_demo_checkout", { link_id: linkId }).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
  return <main className="grid min-h-dvh place-items-center bg-surface-2 p-4">
    <section className="w-full max-w-md space-y-3 rounded-2xl border border-border bg-card p-6 text-center shadow-card">
      <CreditCard className="mx-auto size-8 text-primary" />
      <p className="text-sm font-semibold text-primary">Cleanma UK</p>
      <h1 className="text-2xl font-bold">Demo payment</h1>
      {!valid ? <p>Demo link not found.</p> : checkout.isPending ? <p role="status">Loading demo…</p> :
        checkout.error ? <p role="alert">The demo could not be loaded.</p> : checkout.data ? <>
          <p className="text-3xl font-semibold">{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(checkout.data.amount_pence / 100)}</p>
          <p className="text-sm text-muted-foreground">{checkout.data.provider === "stripe" ? "Stripe" : "GoCardless"} simulation. No payment is collected.</p>
        </> : <p>Demo link not found.</p>}
    </section>
  </main>;
}
