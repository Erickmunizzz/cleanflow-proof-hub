import {createElement} from 'react';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({getUser:vi.fn(),rpc:vi.fn(),signIn:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{getUser:mocks.getUser,signInWithPassword:mocks.signIn,onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}})},rpc:mocks.rpc}}));
import {AuthPage} from '@/components/auth/AuthPage';
import {roleDestination,RoleGate} from '@/lib/role-access';
describe('Role and subscription routing',()=>{
 beforeEach(()=>{mocks.getUser.mockResolvedValue({data:{user:{id:'user'}}});});
 it.each([
  ['owner',true,'/admin'],['cleaner',true,'/cleaner'],
  ['owner',false,'/planos'],['cleaner',false,'/suspended'],
  ['unexpected',true,'/auth'],
 ])('routes %s with active=%s to %s',async(role,active,path)=>{
  mocks.rpc.mockResolvedValue({data:{role,active}});
  expect(await roleDestination()).toBe(path);
 });
 it('rejects unauthenticated access',async()=>{
  mocks.getUser.mockResolvedValue({data:{user:null}});
  expect(await roleDestination()).toBe('/auth');
 });
 it('keeps invalid credentials on the dedicated cleaner login',async()=>{
  mocks.signIn.mockResolvedValue({error:{message:'Invalid login credentials'}});
  render(createElement(AuthPage,{role:'cleaner'}));
  fireEvent.change(screen.getByPlaceholderText('Email'),{target:{value:'invalid@example.invalid'}});
  fireEvent.change(screen.getByPlaceholderText('Password'),{target:{value:'invalid-password'}});
  fireEvent.click(screen.getByRole('button',{name:'Sign in'}));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid login credentials');
  expect(screen.queryByText('Private dashboard')).toBeNull();cleanup();
 });
 it('does not grant access when the backend verification fails',async()=>{
  mocks.rpc.mockResolvedValue({error:new Error('Unavailable')});
  await expect(roleDestination()).rejects.toThrow('Unavailable');
 });
});
