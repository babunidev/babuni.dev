import {moduleHasContent,shuffled,type ProjectModule} from './project-modules.ts';
/** Selected preview becomes the center; remaining populated modules occupy
 * distinct surrounding cells. This layout is sampled once per entry. */
export function bigBloomLayout(modules:readonly ProjectModule[],selectedId:string,random:()=>number=Math.random){
  const populated=modules.filter(moduleHasContent);
  const selected=populated.find(module=>module.id===selectedId)??populated[0];
  if(!selected)return [];
  const ordered=[selected,...shuffled(populated.filter(module=>module.id!==selected.id),random)];
  const cells=[{column:0,row:0}];
  for(let radius=1;cells.length<ordered.length;radius++){
    for(let row=-radius;row<=radius;row++)for(let column=-radius;column<=radius;column++)
      if(Math.max(Math.abs(column),Math.abs(row))===radius)cells.push({column,row});
  }
  return ordered.map((module,index)=>({module,...cells[index]}));
}
