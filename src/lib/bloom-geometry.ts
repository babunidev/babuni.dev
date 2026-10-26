export interface Cell {column:number;row:number}
/** Vacancies are visual cells. Insert them left-to-right in each row. This
 * mapping also supports a future rectangular bloom without diagonal travel. */
export function occupiedCell(cell:Cell,vacancies:readonly Cell[]):Cell {
  let column=cell.column;
  for(const hole of vacancies.filter(h=>h.row===cell.row).sort((a,b)=>a.column-b.column)){
    if(column>=hole.column)column++;
  }
  return {column,row:cell.row};
}
export function restingCell(cell:Cell,vacancies:readonly Cell[]):Cell {
  return {column:cell.column-vacancies.filter(h=>h.row===cell.row&&h.column<cell.column).length,row:cell.row};
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
