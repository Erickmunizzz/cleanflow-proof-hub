import {createFileRoute} from '@tanstack/react-router';
import {RoleGate} from '@/lib/role-access';
export const Route=createFileRoute('/cleaner')({component:Cleaner});
function Cleaner(){return <RoleGate role="cleaner"><iframe src="/cleaner.html" title="CleanMa employee workspace" allow="geolocation; camera" style={{border:0,width:'100%',height:'100dvh',display:'block'}} /></RoleGate>}
