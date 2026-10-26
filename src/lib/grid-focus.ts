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
/** Existing shift directly moves the chosen tile or the cell needed by its
 * first right-side bloom. Such a selection must wait for that motion to settle.
 */
export type GridLineMove={axis:'row'|'column';line:number;direction:number};
export function shiftTouchesSelection(move:GridLineMove,cell:GridCell):boolean {
  return move.axis==='row'
    ? move.line===cell.row
    : move.line===cell.column||move.line===cell.column+1;
}
/** The selected row and two protected columns must stay fixed. All other
 * rows and columns can still move. Far-right column shifts crossing the
 * displaced row are interpolated sideways with bloomShiftFraction().
 */
export function shiftAvoidsBloom(move:GridLineMove,cell:GridCell):boolean {
  return move.axis==='row'
    ? move.line!==cell.row
    : move.line!==cell.column&&move.line!==cell.column+1;
}
/** The horizontal bloom displacement is 1 tile for tiles in the selected
 * row to its right. During vertical movement through that row, the incoming
 * tile gradually acquires this offset and the departing tile releases it.
 * At both endpoints the positions match the renderer's resting geometry.
 */
export function bloomShiftFraction(
  tile:GridCell,selected:GridCell,columnDirection:number|undefined,progress:number
):number {
  if(tile.column<=selected.column)return 0;
  const p=easeInOut(progress);
  if(columnDirection!==undefined&&tile.column>selected.column+1){
    if(tile.row===selected.row)return 1-p;
    if(tile.row+columnDirection===selected.row)return p;
  }
  return tile.row===selected.row?1:0;
}
export function permittedBloomShifts<T extends GridLineMove>(
  moves:readonly T[],cell:GridCell
):T[]{
  return moves.filter(move=>shiftAvoidsBloom(move,cell));
}
/** Distinguish an actual moving selected tile / bloom neighbor from an
 * independent moving line: only the former waits, and both show gold now.
 */
export type SelectionShiftAction='wait'|'pause';
export function selectionShiftAction(
  moves:readonly GridLineMove[],cell:GridCell
):SelectionShiftAction{
  return moves.some(move=>shiftTouchesSelection(move,cell))?'wait':'pause';
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
