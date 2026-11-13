import {createFileRoute} from '@tanstack/react-router';
import {AuthPage} from '@/components/auth/AuthPage';
export const Route=createFileRoute('/admin/login')({component:()=> <AuthPage role="owner"/>});
