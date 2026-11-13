import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {roleDestination} from './role-destination';
export {roleDestination} from './role-destination';
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){
 const [allowed,setAllowed]=useState(false);
 const [error,setError]=useState('');
 const [retry,setRetry]=useState(0);
 useEffect(()=>{
  let alive=true,running=false;
  const login=role==='owner'?'/admin/login':'/cleaner/login';
  const leave=()=>{if(alive){alive=false;setAllowed(false);location.replace(login+location.search)}};
  const check=async()=>{
   if(!alive||running)return;running=true;
   const timeout=setTimeout(()=>{if(alive){alive=false;setAllowed(false);setError('Unable to verify your workspace. Your session has been kept. Please try again.')}},15000);
   try{const destination=await roleDestination();if(!alive)return;
    if(destination===(role==='owner'?'/admin':'/cleaner')){setError('');setAllowed(true);}
    else {alive=false;setAllowed(false);location.replace(destination==='/auth'?login+location.search:destination)}
   }catch{if(alive){setAllowed(false);setError('Unable to verify your workspace. Please try again.')}}finally{clearTimeout(timeout);running=false}
  };
  void check();const timer=setInterval(()=>void check(),15000);
  let authTimer:ReturnType<typeof setTimeout>|undefined;
  const {data}=supabase.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){leave();return;}if(event==='TOKEN_REFRESHED')return;clearTimeout(authTimer);authTimer=setTimeout(()=>void check(),0)});
  return()=>{alive=false;clearInterval(timer);clearTimeout(authTimer);data.subscription.unsubscribe()};
 },[role,retry]);
 if(error)return <div role="alert" className="p-6">{error}<button className="ml-3 underline" onClick={()=>{setError('');setRetry(n=>n+1)}}>Retry</button></div>;
 return allowed?<>{children}</>:<div role="status" className="flex min-h-screen items-center justify-center bg-background"><div><img src="/cleanma-logo.png" alt="CleanMa" className="h-12 w-20 object-contain"/><p>Restoring your session…</p></div></div>;
}
