export async function authTimeout<T>(request:PromiseLike<T>):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([Promise.resolve(request),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Connection timed out. Please try again.')),15000)})]);}
 finally{clearTimeout(timer)}
}
