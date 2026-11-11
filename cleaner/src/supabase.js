import { createClient } from '@supabase/supabase-js';
// Public project credentials only. Owner and Cleaner use the same Auth and database.
export const db=createClient('https://eymkowczlmbrfxlxcwdm.supabase.co','sb_publishable_MQz1s2hIcpM-w83-akFCPA_TJDDgYjG',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export const dayKey=d=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London'}).format(new Date(d));
export function gps(){return new Promise((resolve,reject)=>{
 if(!window.isSecureContext)return reject(Error('Location requires HTTPS. Open the secure app URL.'));
 if(!navigator.geolocation)return reject(Error('GPS is unavailable on this device.'));
 navigator.geolocation.getCurrentPosition(p=>resolve(p.coords),e=>reject(Error(({1:'Location permission denied. Enable location in browser settings and try again.',2:'Location unavailable. Enable GPS and move to an open area.',3:'Location timed out. Please try again.'})[e.code]||'Unable to get location.')),{enableHighAccuracy:true,timeout:20000,maximumAge:0});
});}
export async function checked(request){const r=await request;if(r.error)throw r.error;return r.data;}
