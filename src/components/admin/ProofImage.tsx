import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export function ProofImage({url,caption}:{url:string;caption:string|null}){
 const signed=useQuery({queryKey:['proof-image',url],enabled:url.startsWith('cleaner-proofs/'),queryFn:async()=>{const r=await supabase.storage.from('cleaner-proofs').createSignedUrl(url.slice('cleaner-proofs/'.length),300);if(r.error)throw r.error;return r.data.signedUrl;},refetchInterval:240000});
 const src=url.startsWith('cleaner-proofs/')?signed.data:/^https?:\/\//.test(url)?url:undefined;
 return src?<img src={src} alt={caption||'Job documentation'} className="h-48 w-full object-cover"/>:<div className="grid h-48 place-items-center text-muted-foreground">{signed.isError?'Photo unavailable':'Loading photo…'}</div>;
}
