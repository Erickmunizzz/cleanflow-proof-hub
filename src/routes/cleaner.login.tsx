import {createFileRoute} from '@tanstack/react-router';
import {AuthPage} from '@/components/auth/AuthPage';
export const Route=createFileRoute('/cleaner/login')({component:()=> <AuthPage role="cleaner"/>});
