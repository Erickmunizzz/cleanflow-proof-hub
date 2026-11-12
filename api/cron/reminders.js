import {timingSafeEqual} from 'node:crypto';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).end();
 const secret=process.env.CRON_SECRET,header=req.headers.authorization||'',expected='Bearer '+secret;
 if(!secret||Buffer.byteLength(header)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(header),Buffer.from(expected)))return res.status(401).json({error:'Unauthorized'});
 if(process.env.VERCEL_ENV!=='production')return res.status(200).json({skipped:'Production only'});
 const url=process.env.VITE_SUPABASE_URL,key=process.env.VITE_SUPABASE_ANON_KEY;
 if(!url||!key)return res.status(503).json({error:'Scheduler not configured'});
 try{
  const response=await fetch(url+'/rest/v1/rpc/dispatch_daily_cleaner_reminders',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({secret}),signal:AbortSignal.timeout(15000)});
  if(!response.ok){console.error('Reminder dispatch failed',response.status);return res.status(502).json({error:'Reminder dispatch failed'});}
  return res.status(200).json({notificationsCreated:await response.json()});
 }catch{console.error('Reminder dispatch unavailable');return res.status(502).json({error:'Reminder dispatch unavailable'});}
}
