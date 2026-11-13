import {createFileRoute,Outlet,useRouterState} from '@tanstack/react-router';
import {EmployeeWorkspace} from '@/funcionario/Workspace';
export const Route=createFileRoute('/cleaner')({component:()=>useRouterState({select:s=>s.location.pathname})==='/cleaner/login'?<Outlet/>:<EmployeeWorkspace/>});
