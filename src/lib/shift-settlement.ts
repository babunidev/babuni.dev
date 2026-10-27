import {occupiedCell,type Cell} from './bloom-geometry.ts';
import {type ShiftEvent} from './grid-shifts.ts';

/** Commit the *resident DOM tile* to the cell it visually reached.
 * A renderer that only updates content in fixed cells would detach and
 * recreate portal <img> nodes after every shift, causing decoded logos to
 * briefly disappear.  Keep the loaded resident and its identity together.
 *
 * Moves in one round occupy distinct lines of a single axis. A bounded DOM
 * pool wraps its outermost resident to the opposite buffered edge, which
 * is offscreen; the ordinary placement sync can reassign that buffer slot.
 * The mapping uses occupied (bloom-aware) cells just like shift painting.
 */
export function settledResidents<T extends Cell>(
  slots:readonly T[],moves:readonly ShiftEvent[],vacancies:readonly Cell[]=[]
):{destination:T;source:T}[]{
  const changed:{destination:T;source:T}[]=[];
  for(const move of moves){
    const inLine=slots.filter(slot=>{
      const p=occupiedCell(slot,vacancies);
      return move.axis==='row'?p.row===move.line:p.column===move.line;
    });
    const ordered=inLine.sort((a,b)=>{
      const pa=occupiedCell(a,vacancies),pb=occupiedCell(b,vacancies);
      return move.axis==='row'?pa.column-pb.column:pa.row-pb.row;
    });
    for(let i=0;i<ordered.length;i++){
      const from=(i-move.direction+ordered.length)%ordered.length;
      changed.push({destination:ordered[i],source:ordered[from]});
    }
  }
  return changed;
}
