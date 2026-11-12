import {createFileRoute,redirect} from '@tanstack/react-router';
export const Route=createFileRoute('/funcionario')({beforeLoad:()=>{throw redirect({to:'/cleaner',replace:true})}});
