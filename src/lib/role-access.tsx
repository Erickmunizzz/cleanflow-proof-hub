import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
export async function roleDestination(){
 const {data:{user},error}=await supabase.auth.getUser();if(error||!user)return '/auth';
 const {data,error:failure}=await supabase.rpc('current_subscription_access' as never);
 const access=data as unknown as {role:string;active:boolean}|null;
 if(failure)throw failure;
 if(!access)return '/planos';
 const owner=access.role==='owner';
 return access.active?(owner?'/admin':'/funcionario'):(owner?'/planos':'/suspended');
}
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){const [allowed,S]=useState(false);useEffect(()=>{let active=true;const check=async()=>{const d=await roleDestination();if(!active)return;if(d===(role==='owner'?'/admin':'/funcionario'))S(true);else{S(false);location.replace(d)}};void check().catch(()=>S(false));const timer=setInterval(()=>void check().catch(()=>S(false)),15000);const {data}=supabase.auth.onAuthStateChange(()=>setTimeout(()=>void check(),0));return()=>{active=false;clearInterval(timer);data.subscription.unsubscribe()}},[role]);return allowed?<>{children}</>:<p role="status" className="p-6">Checking workspace access…</p>}
