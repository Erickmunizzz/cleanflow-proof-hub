import {supabase} from '@/integrations/supabase/client';
export async function roleDestination(){
 const {data:{user},error}=await supabase.auth.getUser();if(error){if(error.status===401||error.status===403||error.name==='AuthSessionMissingError')return '/auth';throw error;}if(!user)return '/auth';
 const {data,error:failure}=await supabase.rpc('current_subscription_access' as never);
 const access=data as unknown as {role:string;active:boolean}|null;
 if(failure)throw failure;
 if(!access)return '/planos';
 if(access.role!=='owner'&&access.role!=='cleaner')return '/auth';
 const owner=access.role==='owner';
 return access.active?(owner?'/admin':'/cleaner'):(owner?'/planos':'/suspended');
}
