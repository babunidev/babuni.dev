import {sourceCell,type ShiftEvent} from './grid-shifts.ts';
import {type Cell} from './bloom-geometry.ts';
/** Coordinates only change when a line settles; avoid replaying history every frame. */
export function createSourceLookup(history:readonly ShiftEvent[]){
 let revision=-1;const cache=new Map<string,Cell>();
 return (column:number,row:number):Cell=>{
  if(revision!==history.length||cache.size>2048){cache.clear();revision=history.length;}
  const key=column+','+row;let value=cache.get(key);
  if(!value){value=sourceCell(column,row,history);cache.set(key,value);}return value;
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
