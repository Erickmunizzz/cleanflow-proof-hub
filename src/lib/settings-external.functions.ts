import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const slackWebhookPattern = /^https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;

export const testSettingsSlack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ companyId: z.string().uuid(), webhook: z.string().max(512).regex(slackWebhookPattern) }))
  .handler(async ({ data, context }) => {
    const { data: owner, error } = await context.supabase.from("profiles").select("id")
      .eq("id", context.userId).eq("company_id", data.companyId)
      .eq("role", "owner").eq("is_active", true).maybeSingle();
    if (error || !owner) throw new Error("Only the company owner can test this integration.");
    const subscription = await context.supabase.rpc("subscription_status", { target_company: data.companyId });
    if (subscription.error || !subscription.data || typeof subscription.data !== "object" || Array.isArray(subscription.data) || subscription.data["plan"] !== "scale") {
      throw new Error("PLAN_FEATURE: Upgrade to Scale to use integrations.");
    }
    let response: Response;
    try {
      response = await fetch(data.webhook, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "CleanMa · Slack integration test" }),
      });
    } catch {
      throw new Error("Slack could not be reached. Check the webhook and try again.");
    }
    if (!response.ok || (await response.text()).trim() !== "ok") {
      throw new Error("Slack rejected the test. Check that the incoming webhook is active.");
    }
    return { delivered: true };
  });

export const getSettingsBankHolidays = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.enum(["england-and-wales", "scotland", "northern-ireland"]))
  .handler(async ({ data }) => {
    const response = await fetch("https://www.gov.uk/bank-holidays.json", {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("GOV.UK holiday calendar is unavailable.");
    const schema = z.record(z.string(), z.object({
      events: z.array(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), title: z.string() })),
    }));
    const calendar = schema.parse(await response.json());
    const region = calendar[data];
    if (!region) throw new Error("GOV.UK did not return this holiday region.");
    return region.events;
  });
