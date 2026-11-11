import { createFileRoute } from "@tanstack/react-router";
import { ExternalClientPortal } from "@/components/admin/PortalAndHistory";
export const Route=createFileRoute("/client-portal")({validateSearch:(s:Record<string,unknown>)=>({token:typeof s['token']==="string"?s['token']:""}),head:()=>({meta:[{title:"Client Portal — CleanMa"},{name:"robots",content:"noindex,nofollow"},{name:"referrer",content:"no-referrer"}]}),component:Page});
function Page(){const {token}=Route.useSearch();return <ExternalClientPortal token={token}/>;}
