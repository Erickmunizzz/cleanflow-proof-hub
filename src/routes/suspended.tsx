import {createFileRoute} from '@tanstack/react-router';
export const Route=createFileRoute('/suspended')({component:()=> <main className="p-8"><h1>Workspace access suspended</h1><p>Contact your manager to renew the company subscription.</p><a href="/auth">Sign in</a></main>});
