/** Projects are stable identities; DOM tile slots are disposable visual instances. */
export interface CellCoordinate { column:number; row:number }
const key=({column,row}:CellCoordinate):string=>`${column},${row}`;

/** Zero-based clockwise square spiral: center, up, upper-right, right ... */
export function spiralIndex(column:number,row:number):number {
  if(!Number.isInteger(column)||!Number.isInteger(row))throw new RangeError('Spiral requires integer cell coordinates');
  const ring=Math.max(Math.abs(column),Math.abs(row));
  if(ring===0)return 0;
  const first=(2*ring-1)**2;
  if(row===-ring&&column>=0)return first+column;
  if(column===ring)return first+ring+(row+ring);
  if(row===ring)return first+3*ring+(ring-column);
  if(column===-ring)return first+5*ring+(ring-row);
  return first+7*ring+(column+ring);
}

/** Detect entrances at BOTH viewport edges, including partly visible tiles. */
export function visibleCellBounds(width:number,height:number,tileSize:number,originX:number,originY:number):{
  firstColumn:number;lastColumn:number;firstRow:number;lastRow:number;
}{
  return {
    firstColumn:Math.floor(-originX/tileSize)||0,
    lastColumn:Math.ceil((width-originX)/tileSize)-1,
    firstRow:Math.floor(-originY/tileSize)||0,
    lastRow:Math.ceil((height-originY)/tileSize)-1
  };
}

/** Content remains resident until beyond the two-cell retention band.
 * Offscreen duplicates are allowed; visible cells first claim unused projects.
 * When there are fewer distinct projects than visible cells, repeats are required.
 */
export class ProjectPlacement {
  private assigned=new Map<string,number>();
  private lastVisible=new Set<string>();
  private cursor=0;
  readonly projectCount:number;
  constructor(projectCount:number){
    if(!Number.isInteger(projectCount)||projectCount<1)throw new RangeError('No projects to place');
    this.projectCount=projectCount;
  }
  get(cell:CellCoordinate):number|undefined{return this.assigned.get(key(cell));}
  get size():number{return this.assigned.size;}
  private choose(usedVisible:Set<number>,usedRetained:Set<number>):number {
    // Prefer entirely free IDs, then IDs only offscreen, then unavoidable repeats.
    for(let pass=0;pass<3;pass++){
      for(let n=0;n<this.projectCount;n++){
        const index=(this.cursor+n)%this.projectCount;
        if(pass===0&&(usedVisible.has(index)||usedRetained.has(index)))continue;
        if(pass===1&&usedVisible.has(index))continue;
        this.cursor=(index+1)%this.projectCount;
        return index;
      }
    }
    throw new Error('Unreachable project selection');
  }
  /** Coordinates refer to original source tiles after reversing completed line shifts.
   * Retained cells comprise the visible viewport and two offscreen tile bands.
   */
  sync(visible:readonly CellCoordinate[],retained:readonly CellCoordinate[]):void {
    const keep=new Set(retained.map(key));
    for(const id of this.assigned.keys())if(!keep.has(id))this.assigned.delete(id);
    const visibleKeys=new Set(visible.map(key));
    const usedRetained=new Set(this.assigned.values());
    const seenVisible=new Set<number>();
    const ordered=[...visible].sort((a,b)=>{
      const wasA=this.lastVisible.has(key(a))?0:1;
      const wasB=this.lastVisible.has(key(b))?0:1;
      return wasA-wasB||spiralIndex(a.column,a.row)-spiralIndex(b.column,b.row);
    });
    for(const cell of ordered){
      const id=key(cell);
      const existing=this.assigned.get(id);
      if(existing!==undefined&&(!seenVisible.has(existing)||seenVisible.size===this.projectCount)){
        seenVisible.add(existing);
        continue;
      }
      const project=this.choose(seenVisible,usedRetained);
      this.assigned.set(id,project);
      seenVisible.add(project);
      usedRetained.add(project);
    }
    // Prefetch the offscreen two-cell band after establishing on-screen identities.
    const bufferOnly=retained.filter(cell=>!visibleKeys.has(key(cell)))
      .sort((a,b)=>spiralIndex(a.column,a.row)-spiralIndex(b.column,b.row));
    for(const cell of bufferOnly){
      const id=key(cell);
      if(this.assigned.has(id))continue;
      const project=this.choose(seenVisible,usedRetained);
      this.assigned.set(id,project);
      usedRetained.add(project);
    }
    this.lastVisible=visibleKeys;
  }
}
