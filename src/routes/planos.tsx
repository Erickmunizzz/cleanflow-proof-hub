import {createFileRoute} from '@tanstack/react-router';
import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
export const Route=createFileRoute('/planos')({component:Plans});
function Plans(){const [ready,S]=useState(false);useEffect(()=>{void supabase.auth.getUser().then(({data})=>{if(!data.user)location.replace('/auth');else S(true)})},[]);return ready?<main className="mx-auto max-w-xl p-8 space-y-6"><h1 className="text-3xl font-bold">Subscription required</h1><p>Your workspace requires an active subscription. Contact support to activate Starter (£89.99), Growth (£179.99) or Scale (£299.99).</p><a href="mailto:support@cleanmaapp.com">Contact billing support</a><button onClick={()=>location.reload()}>Check access again</button><button onClick={()=>void supabase.auth.signOut().then(()=>location.replace('/auth'))}>Log out</button></main>:null}
