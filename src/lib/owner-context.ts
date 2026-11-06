import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OwnerContext = { ownerId: string; companyId: string };

export async function getOwnerContext(): Promise<OwnerContext> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  const user = userData.user;
  if (!user) throw new Error("Sign in to your owner account.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, company_id, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile || profile.role !== "owner" || !profile.is_active) {
    throw new Error("Active owner access is required.");
  }

  return { ownerId: profile.id, companyId: profile.company_id };
}

export const ownerContextOptions = queryOptions({
  queryKey: ["owner-context"],
  queryFn: getOwnerContext,
  staleTime: 30_000,
});
