import {occupiedCell,restingCell,type Cell} from './bloom-geometry.ts';
/** A complete infinite row or column moves by one logical cell. */
export type ShiftAxis='row'|'column';
export type ShiftDirection=-1|1;
export interface ShiftEvent {axis:ShiftAxis; line:number; direction:ShiftDirection; vacancies?:readonly Cell[]}
export interface ShiftRoll extends ShiftEvent {d20:number; bonus:number; total:number; initiative:number}
export interface ShiftRound {axis:ShiftAxis; rolls:ShiftRoll[]; moves:ShiftEvent[]}
export type RandomSource=()=>number;
export function seededRandom(seed:number):RandomSource{
 let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/0x100000000;};
}
/** Provisional dice mechanic; an injected RNG makes rounds reproducible. */
export function planShiftRound(rows:number[],columns:number[],random:RandomSource=Math.random):ShiftRound{
 const axis:ShiftAxis=random()<.5?'row':'column';
 const lines=[...(axis==='row'?rows:columns)];
 for(let i=lines.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[lines[i],lines[j]]=[lines[j],lines[i]];}
 const rolls:ShiftRoll[]=lines.map((line,initiative)=>{
  const d20=Math.floor(random()*20)+1;
  const bonus=Math.max(0,4-initiative);
  const direction:ShiftDirection=random()<.5?-1:1;
  return {axis,line,direction,d20,bonus,total:d20+bonus,initiative};
 });
 // Winning initiatives claim their direction, so two rows (or columns)
 // cannot form a simultaneous same-direction block.
 const directionsTaken=new Set<ShiftDirection>();
 const moves:ShiftEvent[]=[];
 for(const roll of rolls){
  if(roll.total<=10||directionsTaken.has(roll.direction))continue;
  directionsTaken.add(roll.direction);
  moves.push({axis,line:roll.line,direction:roll.direction});
 }
 return {axis,rolls,moves};
}
/** Run the chronological shift events backwards to recover a tile's original source coordinate. */
export function sourceCell(column:number,row:number,history:readonly ShiftEvent[]):{column:number;row:number}{
 for(let i=history.length-1;i>=0;i--){
  const shift=history[i];
  const visual=occupiedCell({column,row},shift.vacancies??[]);
  column=visual.column;row=visual.row;
  if(shift.axis==='row'&&shift.line===row)column-=shift.direction;
  if(shift.axis==='column'&&shift.line===column)row-=shift.direction;
  const resting=restingCell({column,row},shift.vacancies??[]);
  column=resting.column;row=resting.row;
 }
 return {column,row};
}
export function easeInOut(t:number):number{const n=Math.min(1,Math.max(0,t));return n*n*(3-2*n);}
