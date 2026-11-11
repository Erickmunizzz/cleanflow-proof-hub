import {test} from 'node:test';
import assert from 'node:assert/strict';
import {offlineStore,applyQueue} from '../src/offline.js';
test('cache isolates users and clears on logout',()=>{const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};const a=offlineStore('a',storage),b=offlineStore('b',storage);a.write({jobs:[]},[]);assert.equal(b.read(),null);assert.deepEqual(a.read().workspace,{jobs:[]});a.clear();assert.equal(a.read(),null)});
test('replaying desired task state is idempotent and preserves labels',()=>{const w={jobs:[{id:'a',checklist:[{label:'Clean',done:false}]}]},q=[{job:'a',index:0,done:true}];const once=applyQueue(w,q);assert.deepEqual(applyQueue(once,q),once);assert.equal(once.jobs[0].checklist[0].label,'Clean');assert.equal(w.jobs[0].checklist[0].done,false)});
