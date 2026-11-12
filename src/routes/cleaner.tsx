import {createFileRoute,redirect} from '@tanstack/react-router';
export const Route=createFileRoute('/cleaner')({beforeLoad:()=>{throw redirect({to:'/funcionario'})}});
