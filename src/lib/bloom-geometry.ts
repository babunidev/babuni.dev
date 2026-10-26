export interface Cell {column:number;row:number;originColumn?:number}
/** Vacancies are visual cells. Insert them left-to-right in each row. This
 * mapping also supports a future rectangular bloom without diagonal travel. */
export function occupiedCell(cell:Cell,vacancies:readonly Cell[]):Cell {
  const holes=vacancies.filter(h=>h.row===cell.row);
  let column=cell.column-holes.filter(h=>h.column<(h.originColumn??-Infinity)).length;
  for(const hole of holes.sort((a,b)=>a.column-b.column)){
    if(column>=hole.column)column++;
  }
  return {column,row:cell.row};
}
export function restingCell(cell:Cell,vacancies:readonly Cell[]):Cell {
  const holes=vacancies.filter(h=>h.row===cell.row);
  return {column:cell.column-holes.filter(h=>h.column<cell.column).length
    +holes.filter(h=>h.column<(h.originColumn??-Infinity)).length,row:cell.row};
}
export function bloomVacancies(selected:Cell):Cell[]{
  return [{column:selected.column+1,row:selected.row},{column:selected.column,row:selected.row+1}];
}

/** Match the cell physically covering the viewport center, including displaced
 * and mid-shift cells. Half-open edges choose one tile at shared boundaries. */
export function tileAtCenter<T>(tiles:readonly T[],position:(tile:T)=>Cell,center:Cell):T|undefined {
  return tiles.find(tile=>{
    const cell=position(tile);
    return center.column>=cell.column&&center.column<cell.column+1
      &&center.row>=cell.row&&center.row<cell.row+1;
  });
}

/** Inserting cells on both sides preserves the project anchor. Every row moves
 * horizontally away from its vacancies, with no crossing or diagonal paths. */
export function moduleVacancies(anchor:Cell,offsets:readonly Cell[]):Cell[]{
  return offsets.map(offset=>({column:anchor.column+offset.column,
    row:anchor.row+offset.row,originColumn:anchor.column}));
}
