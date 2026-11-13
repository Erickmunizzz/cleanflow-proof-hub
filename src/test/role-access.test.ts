import {createElement} from 'react';
import {render,screen,cleanup} from '@testing-library/react';
import {beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({getUser:vi.fn(),rpc:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{getUser:mocks.getUser,onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}})},rpc:mocks.rpc}}));
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
 it('shows sign-in at the protected route without redirecting to the legacy auth route',async()=>{
  mocks.getUser.mockResolvedValue({data:{user:null}});
  render(createElement(RoleGate,{role:'owner',children:'Private dashboard'}));
  expect(await screen.findByPlaceholderText('Email')).toBeTruthy();
  expect(screen.queryByText('Private dashboard')).toBeNull();
  cleanup();
 });
 it('does not grant access when the backend verification fails',async()=>{
  mocks.rpc.mockResolvedValue({error:new Error('Unavailable')});
  await expect(roleDestination()).rejects.toThrow('Unavailable');
 });
});
