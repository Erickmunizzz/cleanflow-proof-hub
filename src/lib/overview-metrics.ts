import { supabase } from "@/integrations/supabase/client";

export const cancelledJobStatuses = ["cancelled", "canceled"];

const londonDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
});
const londonHour = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23",
});

export function londonDayBounds(now = new Date()) {
  const base = new Date(londonDate.format(now) + "T00:00:00Z");
  function midnight(days: number) {
    const utcMidnight = new Date(base);
    utcMidnight.setUTCDate(utcMidnight.getUTCDate() + days);
    // London's DST changes occur after midnight. At UTC midnight the local hour is 0 or 1.
    return new Date(utcMidnight.getTime() - Number(londonHour.format(utcMidnight)) * 3600000).toISOString();
  }
  return { today: midnight(0), tomorrow: midnight(1), afterNextSevenDays: midnight(8) };
}

type CountResult = { count: number | null; error: { message: string } | null };
async function count(query: PromiseLike<CountResult>) {
  const result = await query;
  if (result.error) throw new Error(result.error.message);
  if (result.count === null) throw new Error("The server did not return a count.");
  return result.count;
}

export async function loadOverviewMetrics(companyId: string) {
  const { today, tomorrow, afterNextSevenDays } = londonDayBounds();
  const jobs = () => supabase.from("jobs").select("id", { head: true, count: "exact" }).eq("company_id", companyId);
  const cancelled = () => jobs().in("status", cancelledJobStatuses);
  const active = () => jobs().in("status", ["scheduled", "in_progress"]);
  const returned = () => supabase.from("key_registers").select("id", { head: true, count: "exact" })
    .eq("company_id", companyId).not("returned_at", "is", null);
  const requests = () => supabase.from("material_requests").select("id", { head: true, count: "exact" }).eq("company_id", companyId);

  const [cancellations, work, returns, products] = await Promise.all([
    Promise.all([
      count(cancelled()),
      count(cancelled().gte("scheduled_date", tomorrow).lt("scheduled_date", afterNextSevenDays)),
      count(cancelled().gte("scheduled_date", afterNextSevenDays)),
    ]),
    Promise.all([
      count(active()),
      count(active().gte("scheduled_date", tomorrow).lt("scheduled_date", afterNextSevenDays)),
    ]),
    Promise.all([
      count(returned()),
      count(returned().gte("returned_at", today).lt("returned_at", tomorrow)),
      count(returned().lt("returned_at", today)),
    ]),
    Promise.all([
      count(requests().in("status", ["pending", "approved"])),
      count(requests().eq("status", "approved")),
      count(requests()),
    ]),
  ]);
  return { cancellations, work, returns, products };
}
