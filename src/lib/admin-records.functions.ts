import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerSchema, staffSchema, materialSchema } from "./admin-records.schema";

export const getAdminRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase;
    // Page through every table: PostgREST otherwise truncates lists at 1,000 rows.
    async function all<T>(read: (start: number, end: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
      const rows: T[] = [];
      for (let start = 0; ; start += 1000) {
        const result = await read(start, start + 999);
        if (result.error) throw new Error(result.error.message);
        const page = result.data ?? [];
        rows.push(...page);
        if (page.length < 1000) return rows;
      }
    }
    const [clients, staff, materials, jobs] = await Promise.all([
      all((a, b) => db.from("clients").select("*").order("name").order("id").range(a, b)),
      all((a, b) => db.from("staff").select("*").order("name").order("id").range(a, b)),
      all((a, b) => db.from("materials").select("*").order("name").order("id").range(a, b)),
      all((a, b) => db.from("jobs").select("*, clients(name), staff(name)").order("scheduled_date").order("id").range(a, b)),
    ]);
    return { clients, staff, materials, jobs };
  });

export const addCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(customerSchema).handler(async ({ data, context }) => {
    const result = await context.supabase.from("clients").insert(data).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
export const addStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(staffSchema).handler(async ({ data, context }) => {
    const result = await context.supabase.from("staff").insert(data).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
export const addMaterial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(materialSchema).handler(async ({ data, context }) => {
    const result = await context.supabase.from("materials").insert(data).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });