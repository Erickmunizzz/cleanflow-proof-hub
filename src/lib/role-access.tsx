import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {roleDestination} from './role-destination';
export {roleDestination} from './role-destination';
export function RoleGate({role,children}:{role:'owner'|'cleaner';children:React.ReactNode}){
 const [allowed,setAllowed]=useState(false);
 useEffect(()=>{
  let alive=true,running=false;
  const login=role==='owner'?'/admin/login':'/cleaner/login';
  const leave=()=>{if(alive){alive=false;setAllowed(false);location.replace(login+location.search)}};
  const check=async()=>{
   if(!alive||running)return;running=true;
   const timeout=setTimeout(leave,1000);
   try{const destination=await roleDestination();if(!alive)return;
    if(destination===(role==='owner'?'/admin':'/cleaner'))setAllowed(true);
    else {alive=false;setAllowed(false);location.replace(destination==='/auth'?login+location.search:destination)}
   }catch{leave()}finally{clearTimeout(timeout);running=false}
  };
  void check();const timer=setInterval(()=>void check(),15000);
  let authTimer:ReturnType<typeof setTimeout>|undefined;
  const {data}=supabase.auth.onAuthStateChange(()=>{setAllowed(false);authTimer=setTimeout(()=>void check(),0)});
  return()=>{alive=false;clearInterval(timer);clearTimeout(authTimer);data.subscription.unsubscribe()};
 },[role]);
 return allowed?<>{children}</>:<div role="status" className="flex min-h-screen items-center justify-center bg-background"><img src="/cleanma-logo.png" alt="CleanMa" className="h-12 w-20 object-contain"/></div>;
}
