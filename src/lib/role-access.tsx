import {AuthPage} from '@/components/auth/AuthPage';
import {useEffect,useState,useRef} from 'react';
import {supabase} from '@/integrations/supabase/client';
export async function roleDestination(){
 const {data:{user},error}=await supabase.auth.getUser();if(error||!user)return '/auth';
 const {data,error:failure}=await supabase.rpc('current_subscription_access' as never);
 const access=data as unknown as {role:string;active:boolean}|null;
 if(failure)throw failure;
 if(!access)return '/planos';
 if(access.role!=='owner'&&access.role!=='cleaner')return '/auth';
 const owner=access.role==='owner';
 return access.active?(owner?'/admin':'/cleaner'):(owner?'/planos':'/suspended');
}
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){
 const [state,setState]=useState<'loading'|'allowed'|'error'|'signin'>('loading');
 const [retry,setRetry]=useState(0);
 const signingIn=useRef(false);
 useEffect(()=>{
  let active=true, running=false;
  const check=async()=>{
   if(!active||running||signingIn.current)return;
   running=true;
   try{const destination=await roleDestination();if(!active)return;
    if(destination==='/auth'){signingIn.current=true;setState('signin');return;}
    if(destination===(role==='owner'?'/admin':'/cleaner'))setState('allowed');
    else {setState('loading');location.replace(destination)}
   }catch{if(active)setState('error')}finally{running=false}
  };
  void check();
  const timer=setInterval(()=>void check(),15000);
  let authTimer:ReturnType<typeof setTimeout>|undefined;
  const {data}=supabase.auth.onAuthStateChange(()=>{clearTimeout(authTimer);authTimer=setTimeout(()=>void check(),0)});
  return()=>{active=false;clearInterval(timer);clearTimeout(authTimer);data.subscription.unsubscribe()};
 },[role,retry]);
 if(state==='signin')return <AuthPage/>;
 if(state==='allowed')return <>{children}</>;
 if(state==='error')return <div role="alert" className="p-6">Unable to verify workspace access. <button onClick={()=>{setState('loading');setRetry(value=>value+1)}}>Try again</button></div>;
 return <p role="status" className="p-6">Checking workspace access…</p>;
}
