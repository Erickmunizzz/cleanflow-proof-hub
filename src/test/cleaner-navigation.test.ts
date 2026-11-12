import {describe,it,expect,vi} from 'vitest';
import {fireEvent,waitFor,within} from '@testing-library/react';
vi.mock('../../cleaner/src/supabase.js',()=>({db:{},dayKey:(value:unknown)=>{const d=new Date(value as string);return Number.isFinite(d.getTime())?d.toISOString().slice(0,10):''}}));
vi.mock('../../cleaner/src/use-cleaner.js',()=>({useCleaner:()=>({
 workspace:{profile:{id:'employee',company_id:'company'},staff:{role:'Cleaner',weekly_hours:20},managers:[]},
 session:{user:{id:'employee',email:'employee@example.invalid'}},name:'Employee',jobs:[{id:'completed',scheduled_date:'2026-11-12T08:00:00Z',check_in_at:'2026-11-12T08:00:00Z',check_out_at:'2026-11-12T09:00:00Z',site:'Assigned site',logo:'A',address:'Site address',time:'08:00',duration:'1h',status:'COMPLETED',distance:'Distance unavailable',tasks:[]}],messages:[],notifications:[],photos:[],absences:[],
 hoursToday:'0.0',hoursWeek:'0.0',hoursMonth:'0.0',visitsWeek:0,today:'2026-11-12',greeting:'Good morning',pending:0,
 loading:false,error:'',notice:'',signOut:vi.fn(),refresh:vi.fn()
})}));
describe('Cleaner navigation regression',()=>{
 it('keeps all four tabs mounted successfully through repeated transitions',async()=>{
  document.body.innerHTML='<div id="root"></div>';
  const errors:unknown[]=[];
  const listener=(event:ErrorEvent)=>errors.push(event.error);
  window.addEventListener('error',listener);
  // @ts-expect-error The standalone employee bundle is JavaScript with its own React runtime.
  await import('../../cleaner/src/app.js');
  const root=within(document.getElementById('root')!);
  await waitFor(()=>expect(root.getByRole('button',{name:'Hours'})).toBeTruthy());
  for(let i=0;i<5;i++){
   for(const name of ['Hours','Today','Chat','Profile','Today']){
    fireEvent.click(root.getByRole('button',{name:new RegExp(name+'$')}));
    await waitFor(()=>expect(name==='Hours'?root.getByText('Hours Worked'):name==='Chat'?root.getByText('Chat with Manager'):name==='Profile'?root.getByText('Absences / Time Off'):root.getByText(/Good morning/)).toBeTruthy());
    expect(root.queryByRole('alert')).toBeNull();
   }
  }
  window.removeEventListener('error',listener);
  expect(errors).toEqual([]);
 });
});
