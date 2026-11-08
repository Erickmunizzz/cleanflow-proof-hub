import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerSchema, staffSchema, materialSchema } from "./admin-records.schema";

type AuthenticatedDb = SupabaseClient<Database>;

async function getOwnerCompanyId(db: AuthenticatedDb, userId: string) {
  const { data: profile, error } = await db
    .from("profiles")
    .select("company_id, role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile || profile.role !== "owner" || !profile.is_active) {
    throw new Error("Your account does not have an active owner profile. Sign in with the owner account for this workspace.");
  }
  return profile.company_id;
}

export const getAdminRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase;
    const companyId = await getOwnerCompanyId(db, context.userId);

    // Page through every table: PostgREST otherwise truncates lists at 1,000 rows.
    async function all<T>(
      read: (start: number, end: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
    ) {
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
      all((a, b) => db.from("clients").select("*").eq("company_id", companyId).order("name").order("id").range(a, b)),
      all((a, b) => db.from("staff").select("*").eq("company_id", companyId).order("name").order("id").range(a, b)),
      all((a, b) => db.from("materials").select("*").eq("company_id", companyId).order("name").order("id").range(a, b)),
      all((a, b) => db.from("jobs")
        .select("*, clients!jobs_customer_same_company_fkey(name), staff!jobs_staff_same_company_fkey(name)")
        .eq("company_id", companyId).order("scheduled_date").order("id").range(a, b)),
    ]);
    return { clients, staff, materials, jobs };
  });

export const addCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(customerSchema).handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("clients").insert({ ...data, company_id: companyId }).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

export const addStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(staffSchema).handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("staff").insert({ ...data, company_id: companyId }).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

export const addMaterial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(materialSchema).handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("materials").insert({ ...data, company_id: companyId }).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

const recordIdSchema = z.string().uuid();

function throwDeleteError(error: { code?: string; message: string }, recordLabel: string): never {
  if (error.code === "23503") {
    throw new Error(`This ${recordLabel} is linked to existing jobs. Reassign those jobs before deleting this record.`);
  }
  throw new Error(error.message);
}

export const updateCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema, data: customerSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("clients").update(data.data)
      .eq("id", data.id).eq("company_id", companyId).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

export const deleteCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("clients").delete()
      .eq("id", data.id).eq("company_id", companyId).select("id").maybeSingle();
    if (result.error) throwDeleteError(result.error, "customer");
    if (!result.data) throw new Error("Customer not found in this workspace.");
    return result.data;
  });

export const updateStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema, data: staffSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("staff").update(data.data)
      .eq("id", data.id).eq("company_id", companyId).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

export const deleteStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("staff").delete()
      .eq("id", data.id).eq("company_id", companyId).select("id").maybeSingle();
    if (result.error) throwDeleteError(result.error, "staff member");
    if (!result.data) throw new Error("Staff member not found in this workspace.");
    return result.data;
  });

export const updateMaterial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema, data: materialSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("materials").update(data.data)
      .eq("id", data.id).eq("company_id", companyId).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });

export const deleteMaterial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: recordIdSchema }))
  .handler(async ({ data, context }) => {
    const companyId = await getOwnerCompanyId(context.supabase, context.userId);
    const result = await context.supabase.from("materials").delete()
      .eq("id", data.id).eq("company_id", companyId).select("id").maybeSingle();
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error("Material not found in this workspace.");
    return result.data;
  });
