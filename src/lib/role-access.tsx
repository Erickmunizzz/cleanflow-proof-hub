import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
export async function roleDestination(){
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)return '/auth';
 const {data,error:failure}=await supabase.from('profiles').select('role,is_active').eq('id',user.id).maybeSingle();
 if(failure||!data?.is_active)return '/auth';
 return data.role==='owner'?'/admin':data.role==='cleaner'?'/cleaner':'/auth';
}
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){
 const [allowed,S]=useState(false);
 useEffect(()=>{let active=true;const check=async()=>{const destination=await roleDestination();if(!active)return;if(destination===(role==='owner'?'/admin':'/cleaner'))S(true);else window.location.replace(destination)};void check();const {data}=supabase.auth.onAuthStateChange(()=>{S(false);setTimeout(()=>void check(),0)});return()=>{active=false;data.subscription.unsubscribe()}},[role]);
 return allowed?<>{children}</>:<p role="status" className="p-6">Checking workspace access…</p>;
}
