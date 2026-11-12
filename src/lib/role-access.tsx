import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
export async function roleDestination(){
 const {data:{user},error}=await supabase.auth.getUser();if(error||!user)return '/auth';
 const {data:p,error:e}=await supabase.from('profiles').select('role,is_active,company_id').eq('id',user.id).maybeSingle();
 if(e||!p?.is_active)return '/planos';
 const owner=p.role==='owner',email=user.email?.toLowerCase();
 if(owner&&email==='royyallstore@gmail.com')return '/admin';
 if(!owner&&email==='friend.cleaner@teste.com')return '/funcionario';
 const {data:s}=await supabase.from('subscriptions' as never).select('*').eq('company_id',p.company_id).maybeSingle();
 const sub=s as unknown as {status:string;current_period_end:string|null;trial_ends_at:string|null}|null;
 const active=sub&&(sub.status==='active'&&(!sub.current_period_end||Date.parse(sub.current_period_end)>Date.now())||sub.status==='trialing'&&sub.trial_ends_at&&Date.parse(sub.trial_ends_at)>Date.now());
 return active?(owner?'/admin':'/funcionario'):(owner?'/planos':'/suspended');
}
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){const [allowed,S]=useState(false);useEffect(()=>{let active=true;const check=async()=>{const d=await roleDestination();if(!active)return;if(d===(role==='owner'?'/admin':'/funcionario'))S(true);else{S(false);location.replace(d)}};void check();const timer=setInterval(()=>void check(),15000);const {data}=supabase.auth.onAuthStateChange(()=>setTimeout(()=>void check(),0));return()=>{active=false;clearInterval(timer);data.subscription.unsubscribe()}},[role]);return allowed?<>{children}</>:<p role="status" className="p-6">Checking workspace access…</p>}
