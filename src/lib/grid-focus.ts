import {easeInOut} from './grid-shifts.ts';
export interface GridCell {column:number;row:number}
export interface PanPosition {x:number;y:number}
/** Center the selected logical tile within the full viewport. */
export function centeredPan(cell:GridCell,tileSize:number):PanPosition {
  if(!(tileSize>0))throw new RangeError('Invalid tile size');
  return {x:-cell.column*tileSize,y:-cell.row*tileSize};
}
/** The right-hand neighboring square is reserved for the first small bloom. */
export function bloomModuleCell(selected:GridCell):GridCell {
  return {column:selected.column+1,row:selected.row};
}
/** Move the entire contiguous right-hand run one tile over, never just one
 * neighbor overlapping another. The first adjacent cell becomes genuinely free.
 */
export function shiftsForBloom(cell:GridCell,selected:GridCell):boolean {
  return cell.row===selected.row&&cell.column>selected.column;
}
export const CENTER_DURATION_MS=720;
export const BLOOM_SHIFT_DURATION_MS=520;
/** One deterministic, bounded camera movement; never touch logical identities. */
export function interpolateCenter(from:PanPosition,to:PanPosition,progress:number):PanPosition {
  const ease=easeInOut(progress);
  return {x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease};
}
export const AMBIENT_MIN_WAIT_MS=6500;
export const AMBIENT_MAX_WAIT_MS=10500;
export const AMBIENT_VISIBLE_MS=1700;
export function ambientWait(random:number):number {
  return AMBIENT_MIN_WAIT_MS+Math.round(
    Math.max(0,Math.min(1,random))*(AMBIENT_MAX_WAIT_MS-AMBIENT_MIN_WAIT_MS)
  );
}
