import {type ProjectModule} from './project-modules.ts';
/** Small client cache: fetch only the selected project's prepared public modules. */
export function createProjectModuleLoader(fetcher:typeof fetch=fetch){
 const cache=new Map<string,ProjectModule[]>(),pending=new Map<string,Promise<ProjectModule[]>>();
 const valid=(id:string)=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
 function load(id:string):Promise<ProjectModule[]>{
  if(!valid(id))return Promise.reject(new Error('Invalid project ID'));
  if(cache.has(id))return Promise.resolve(cache.get(id)!);
  const existing=pending.get(id);if(existing)return existing;
  const request=(async()=>{
   const response=await fetcher('/_project-modules/'+id+'.json');
   if(!response.ok)throw new Error('Project content unavailable');
   const modules=await response.json();
   if(!Array.isArray(modules)||!modules.every(m=>m&&typeof m.id==='string'&&['text','gallery','video','resources'].includes(m.type)))throw new Error('Invalid project content');
   cache.set(id,modules);return modules;
  })().finally(()=>pending.delete(id));
  pending.set(id,request);return request;
 }
 return {load,get:(id:string)=>cache.get(id)};
}
export const projectModuleLoader=createProjectModuleLoader();
