import {createFileRoute,redirect} from '@tanstack/react-router';
export const Route=createFileRoute('/auth')({beforeLoad:({location})=>{throw redirect({href:'/admin/login'+location.searchStr+(location.hash?'#'+location.hash.replace(/^#/,''):'')})}});
