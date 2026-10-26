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
  /** Give each entering offscreen tile its FINAL project before a line begins moving.
   * An incoming buffer tile may currently duplicate a visible project; without
   * staging, sync() would rename it on the final animation frame.
   *
   * Prefer its existing identity when it will be unique at rest; otherwise reuse
   * the project leaving at the opposite side. Do not change any currently
   * visible source-cell assignment while a shift is in progress.
   */
  stageEntrances(pairs:readonly {incoming:CellCoordinate;departing:CellCoordinate}[]):void {
    if(pairs.length===0)return;
    const departures=new Set(pairs.map(pair=>key(pair.departing)));
    const continuing=new Set<number>();
    for(const id of this.lastVisible){
      if(departures.has(id))continue;
      const project=this.assigned.get(id);
      if(project!==undefined)continuing.add(project);
    }
    const reserved=new Set(continuing);
    const currentlyReserved=new Set(this.assigned.values());
    for(const pair of pairs){
      const incomingKey=key(pair.incoming);
      // An already visible tile must never be reassigned by staging.
      if(this.lastVisible.has(incomingKey))continue;
      const current=this.assigned.get(incomingKey);
      if(current!==undefined&&!reserved.has(current)){
        reserved.add(current);
        continue;
      }
      const exiting=this.assigned.get(key(pair.departing));
      const project=exiting!==undefined&&!reserved.has(exiting)
        ?exiting:this.choose(reserved,currentlyReserved);
      this.assigned.set(incomingKey,project);
      currentlyReserved.add(project);
      reserved.add(project);
    }
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
