import {RoleGate} from '@/lib/role-access';
export function EmployeeWorkspace(){return <RoleGate role="cleaner"><iframe title="CleanMa employee workspace" src="/cleaner.html" allow="geolocation; camera" style={{border:0,width:'100%',height:'100dvh',display:'block'}}/></RoleGate>}
