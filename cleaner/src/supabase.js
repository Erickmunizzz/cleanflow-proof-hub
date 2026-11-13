import { createClient } from '@supabase/supabase-js';
// Public project credentials only. Owner and Cleaner use the same Auth and database.
export const db=createClient(CLEANER_SUPABASE_URL,CLEANER_SUPABASE_KEY,{auth:{storage:window.localStorage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export const dayKey=d=>{const date=new Date(d);return d!=null&&Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London'}).format(date):'';};
export function gps(){return new Promise((resolve,reject)=>{
 if(!window.isSecureContext)return reject(Error('Location requires HTTPS. Open the secure app URL.'));
 if(!navigator.geolocation)return reject(Error('GPS is unavailable on this device.'));
 navigator.geolocation.getCurrentPosition(p=>resolve(p.coords),e=>reject(Error(({1:'Location permission denied. Enable location in browser settings and try again.',2:'Location unavailable. Enable GPS and move to an open area.',3:'Location timed out. Please try again.'})[e.code]||'Unable to get location.')),{enableHighAccuracy:true,timeout:20000,maximumAge:0});
});}
export async function withTimeout(request){let timer;try{return await Promise.race([request,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Connection timed out. Please try again.')),15000)})])}finally{clearTimeout(timer)}}
export function loginError(e){if(e?.code==='invalid_credentials'||/invalid login credentials/i.test(e?.message||''))return 'Email ou senha incorretos';if(e?.code==='42501'&&!/subscription/i.test(e.message||''))return 'Sem empresa vinculada, fale com seu patrão';return e?.message||'Unable to load your workspace. Please try again.';}
export async function checked(request){const r=await withTimeout(request);if(r.error)throw r.error;return r.data;}
