import {beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({getUser:vi.fn(),rpc:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth:{getUser:mocks.getUser},rpc:mocks.rpc}}));
import {roleDestination} from '@/lib/role-access';
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
 it('does not grant access when the backend verification fails',async()=>{
  mocks.rpc.mockResolvedValue({error:new Error('Unavailable')});
  await expect(roleDestination()).rejects.toThrow('Unavailable');
 });
});
