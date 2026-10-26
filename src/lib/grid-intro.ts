import {spiralIndex,type CellCoordinate} from './project-placement.ts';

/** Visual-only entrance sequence: never block real content loading. */
export const INTRO_SPAWN_DURATION_MS=373;
export const INTRO_SPAWN_STAGGER_MS=68;
/** Sort initial visible cell slots by the creator's center-first clockwise spiral. */
export function introSequence<T>(
  items:readonly T[],
  coordinate:(item:T)=>CellCoordinate
):T[]{
  return [...items].sort((a,b)=>{
    const left=coordinate(a),right=coordinate(b);
    return spiralIndex(left.column,left.row)-spiralIndex(right.column,right.row);
  });
}
