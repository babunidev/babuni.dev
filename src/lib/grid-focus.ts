import {occupiedCell,bloomVacancies} from './bloom-geometry.ts';
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
/** Both reserved rows displace contiguous runs to the right. */
export function shiftsForBloom(cell:GridCell,selected:GridCell):boolean {
  return occupiedCell(cell,bloomVacancies(selected)).column!==cell.column;
}
export type GridLineMove={axis:'row'|'column';line:number;direction:number};
/** Expansion changes entire right-hand runs, not merely the adjacent cell. */
export function shiftTouchesSelection(move:GridLineMove,cell:GridCell):boolean {
  return move.axis==='row'
    ? move.line===cell.row||move.line===cell.row+1
    : move.line>=cell.column;
}
export function shiftAvoidsBloom(move:GridLineMove,cell:GridCell):boolean {
  return move.axis==='row'
    ? move.line!==cell.row&&move.line!==cell.row+1
    : move.line!==cell.column&&move.line!==cell.column+1;
}
export function permittedBloomShifts<T extends GridLineMove>(
  moves:readonly T[],cell:GridCell
):T[]{
  return moves.filter(move=>shiftAvoidsBloom(move,cell));
}
/** Babuni.dev requests every active shift finish calmly before opening,
 * including lines unrelated to the chosen tile. Gold selection is immediate. */
export type SelectionShiftAction='wait'|'pause';
export function selectionShiftAction(
  moves:readonly GridLineMove[],_cell:GridCell
):SelectionShiftAction{
  return moves.length?'wait':'pause';
}
export const CENTER_DURATION_MS=720;
export const BLOOM_SHIFT_DURATION_MS=520;
/** One deterministic, bounded camera movement; never touch logical identities. */
export function interpolateCenter(from:PanPosition,to:PanPosition,progress:number):PanPosition {
  const ease=easeInOut(progress);
  return {x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease};
}
/** A steady five-second cadence, with short retries instead of
 * restarting a full interval when a row shift or user action blocks a hint.
 */
export const AMBIENT_INTERVAL_MS=5000;
export const AMBIENT_RETRY_MS=600;
export const AMBIENT_VISIBLE_MS=1700;
export interface RectEdges {left:number;top:number;right:number;bottom:number}
export interface RectInsets {left:number;right:number;top:number;bottom:number}
/** Leave generous room for site controls and viewport edges; hints should
 * be comfortably readable rather than hidden by the header or in a corner.
 */
export function ambientInsets(tileSize:number,headerHeight:number,footerHeight:number):RectInsets{
  const gap=tileSize*.22;
  return {left:gap,right:gap,top:headerHeight+gap,bottom:footerHeight+gap};
}
export function ambientTileIsEligible(tile:RectEdges,viewport:RectEdges,insets:RectInsets):boolean{
  return tile.right>tile.left&&tile.bottom>tile.top
    &&tile.left>=viewport.left+insets.left
    &&tile.right<=viewport.right-insets.right
    &&tile.top>=viewport.top+insets.top
    &&tile.bottom<=viewport.bottom-insets.bottom;
}
/** The caller does not modify dueAt on blocked attempts, so retries preserve
 * the next hint's intended cadence even across a 4.4-second row shift.
 */
export function ambientPollDelay(now:number,dueAt:number,blocked:boolean):number{
  return blocked?AMBIENT_RETRY_MS:Math.max(0,dueAt-now);
}
