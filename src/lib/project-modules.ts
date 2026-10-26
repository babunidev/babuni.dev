/** Shared content identity and preview data, independent of grid coordinates. */
export type ModuleType='text'|'gallery'|'video'|'resources';
export interface ModuleImage {src:string;alt:string;caption?:string}
export interface ModuleLink {label:string;href:string}
export interface ProjectModule {
  id:string;type:ModuleType;title:string;preview:string;
  body?:string;images?:ModuleImage[];
  video?:{src?:string;embed?:string;poster?:string;title:string};
  links?:ModuleLink[];
  source?:string;credit?:string;
}
export const MAX_BLOOM_MODULES=8;
export function safeEmbedUrl(value:string):string|null {
  try{
    const url=new URL(value);
    if(url.protocol!=='https:')return null;
    if((url.hostname==='www.youtube-nocookie.com'&&/^\/embed\/[\w-]+$/.test(url.pathname))
       ||(url.hostname==='player.vimeo.com'&&/^\/video\/\d+$/.test(url.pathname)))return url.href;
  }catch{}
  return null;
}
export function moduleHasContent(module:ProjectModule):boolean {
  switch(module.type){
    case 'text':return !!module.body?.trim();
    case 'gallery':return !!module.images?.some(image=>image.src.trim()&&image.alt.trim());
    case 'video':return !!module.video?.src?.trim()||!!(module.video?.embed&&safeEmbedUrl(module.video.embed));
    case 'resources':return !!module.links?.some(link=>link.label.trim()&&link.href.trim());
  }
}
export function shuffled<T>(items:readonly T[],random:()=>number=Math.random):T[]{
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
/** Select once per opening; empty definitions stay editable but never render. */
export function selectModules(modules:readonly ProjectModule[],random:()=>number=Math.random):ProjectModule[]{
  return shuffled(modules.filter(moduleHasContent),random).slice(0,MAX_BLOOM_MODULES);
}
/** Eight immediate neighbors form a 3×3 square with the project at (0,0). */
export const MODULE_OFFSETS=[{column:1,row:0},{column:0,row:1},
  {column:1,row:1},{column:-1,row:1},{column:0,row:-1},
  {column:1,row:-1},{column:-1,row:-1},{column:-1,row:0}] as const;
export function moduleRevealPlan<T>(items:readonly T[],random:()=>number=Math.random):{item:T;delay:number}[]{
  let delay=0;
  return shuffled(items,random).map((item,index)=>{
    if(index)delay+=260+Math.floor(random()*161);
    return {item,delay};
  });
}
