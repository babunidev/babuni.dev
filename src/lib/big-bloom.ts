import {moduleHasContent,shuffled,type ProjectModule} from './project-modules.ts';
import {type Cell} from './bloom-geometry.ts';
/** Same top-first clockwise order as the site's first spiral ring. Additional
 * modules extend down in three columns instead of growing sideways/upward. */
const RING=[{column:0,row:0},{column:0,row:-1},{column:1,row:-1},
  {column:1,row:0},{column:1,row:1},{column:0,row:1},
  {column:-1,row:1},{column:-1,row:0},{column:-1,row:-1}];
export function bigBloomLayout(modules:readonly ProjectModule[],selectedId:string,random:()=>number=Math.random){
  const populated=modules.filter(moduleHasContent);
  const selected=populated.find(module=>module.id===selectedId)??populated[0];
  if(!selected)return [];
  const ordered=[selected,...shuffled(populated.filter(module=>module.id!==selected.id),random)];
  return ordered.map((module,index)=>({module,...(RING[index]??{column:(index-9)%3-1,row:2+Math.floor((index-9)/3)})}));
}
export type BigBloomEntry=ReturnType<typeof bigBloomLayout>[number];
/** The original tile is the selected module's lower-left quarter. */
export function bigModuleCell(anchor:Cell,entry:Pick<BigBloomEntry,'column'|'row'>):Cell {
  return {column:anchor.column+entry.column*2,row:anchor.row-1+entry.row*2};
}
export function bigBloomVacancies(anchor:Cell,layout:readonly BigBloomEntry[]):Cell[]{
  return layout.flatMap(entry=>{
    const start=bigModuleCell(anchor,entry);
    return [0,1].flatMap(y=>[0,1].map(x=>({column:start.column+x,row:start.row+y,originColumn:anchor.column})));
  }).filter(cell=>cell.column!==anchor.column||cell.row!==anchor.row);
}
/** Spatial reveal order is fixed; only content assignment and gaps are random. */
export function bigBloomRevealPlan<T>(items:readonly T[],random:()=>number=Math.random){
  let delay=0;return items.map((item,index)=>{if(index)delay+=260+Math.floor(random()*161);return {item,delay};});
}
/** The larger preview quotes actual body content, rather than reusing its teaser. */
export function moduleIntro(module:ProjectModule,limit=1600):string {
  const text=(module.intro??module.body??module.preview).replace(/```[\s\S]*?```/g,'')
    .replace(/^#{1,6}\s+.*$/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
    .replace(/[*`]/g,'').replace(/\s+/g,' ').trim()||module.preview;
  if(text.length<=limit)return text;
  const cut=text.lastIndexOf(' ',limit);return text.slice(0,cut>limit/2?cut:limit)+'…';
}
