import {sourceCell,type ShiftEvent} from './grid-shifts.ts';
import {type Cell} from './bloom-geometry.ts';
/** Retain warm coordinates across settlements; evict oldest entries individually.
 * History remains authoritative for genuinely unseen cells in the infinite grid. */
export function createSourceLookup(history:readonly ShiftEvent[],resolve=sourceCell){
 let revision=0;let cache=new Map<string,Cell>();
 const key=(column:number,row:number)=>column+','+row;
 function advance(){
  if(revision===history.length)return;
  const previous=cache;cache=new Map();
  if(revision<history.length){
   const added=history.slice(revision);
   let prefix:readonly ShiftEvent[]|null=null;
   for(const id of previous.keys()){
    const [column,row]=id.split(',').map(Number);
    const prior=sourceCell(column,row,added);
    // Most destinations already have their previous resident cached.
    const value=previous.get(key(prior.column,prior.row))??resolve(prior.column,prior.row,prefix??(prefix=history.slice(0,revision)));
    cache.set(id,value);
   }
  }
  revision=history.length;
 }
 return (column:number,row:number):Cell=>{
  advance();
  const id=key(column,row);let value=cache.get(id);
  if(value)cache.delete(id); // LRU promotion, without flushing the whole viewport.
  else value=resolve(column,row,history);
  cache.set(id,value);
  if(cache.size>2048)cache.delete(cache.keys().next().value!);
  return value;
 };
}
/** Compile the same physical row mapping once per immutable vacancy footprint. */
export function compileVacancies(vacancies:readonly Cell[]){
 const rows=new Map<number,{holes:Cell[];left:number}>();
 for(const hole of vacancies){
  let row=rows.get(hole.row);if(!row){row={holes:[],left:0};rows.set(hole.row,row);}
  row.holes.push(hole);if(hole.column<(hole.originColumn??-Infinity))row.left++;
 }
 for(const row of rows.values())row.holes.sort((a,b)=>a.column-b.column);
 return (cell:Cell):Cell=>{
  const row=rows.get(cell.row);if(!row)return {column:cell.column,row:cell.row};
  let column=cell.column-row.left;for(const hole of row.holes)if(column>=hole.column)column++;
  return {column,row:cell.row};
 };
}
