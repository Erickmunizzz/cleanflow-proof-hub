const prefix='cleanma-cleaner-v1:';
export function offlineStore(user,storage=localStorage){
 const key=prefix+user;
 return {
  read(){try{const v=JSON.parse(storage.getItem(key));return v&&Date.now()-v.savedAt<86400000?v:null}catch{return null}},
  write(workspace,queue=[]){storage.setItem(key,JSON.stringify({workspace,queue,savedAt:Date.now()}));},
  clear(){storage.removeItem(key)}
 };
}
export function applyQueue(workspace,queue){if(!workspace)return workspace;return {...workspace,jobs:workspace.jobs.map(job=>({...job,checklist:(job.checklist||[]).map((item,index)=>{const change=queue.filter(q=>q.job===job.id&&q.index===index).at(-1);return change?{...item,done:change.done}:item})}))};}
