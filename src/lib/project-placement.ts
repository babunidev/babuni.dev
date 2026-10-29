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
 * Optional decorative fillers are unique; project repeats fill unavoidable shortages.
 */
export class ProjectPlacement {
  private assigned=new Map<string,number>();
  private lastVisible=new Set<string>();
  private cursor=0;
  private fillerCursor=0;
  private pinnedKey:string|null=null;
  private staged=new Set<string>();
  readonly projectCount:number;
  readonly placeholderCount:number;
  constructor(projectCount:number,placeholderCount=0){
    if(!Number.isInteger(projectCount)||projectCount<1)throw new RangeError('No projects to place');
    if(!Number.isInteger(placeholderCount)||placeholderCount<0)throw new RangeError('Invalid filler count');
    this.projectCount=projectCount;this.placeholderCount=placeholderCount;
  }
  get(cell:CellCoordinate):number|undefined{return this.assigned.get(key(cell));}
  /** Direct navigation may reserve a currently offscreen recycled cell. */
  assign(cell:CellCoordinate,index:number):void {
    if(!Number.isInteger(index)||index<0||index>=this.projectCount)throw new RangeError('Unknown project');
    this.assigned.set(key(cell),index);
  }
  get size():number{return this.assigned.size;}
  get capacity():number{return this.projectCount+this.placeholderCount;}
  private choose(usedVisible:Set<number>,usedRetained:Set<number>):number {
    // Use real projects uniquely first; decorative fillers absorb shortages.
    for(let pass=0;pass<2;pass++)for(let n=0;n<this.projectCount;n++){
      const index=(this.cursor+n)%this.projectCount;
      if(usedVisible.has(index)||(pass===0&&usedRetained.has(index)))continue;
      this.cursor=(index+1)%this.projectCount;return index;
    }
    if(this.placeholderCount){
      for(let n=0;n<this.placeholderCount;n++){
        const offset=(this.fillerCursor+n)%this.placeholderCount,index=this.projectCount+offset;
        if(usedVisible.has(index))continue;
        this.fillerCursor=(offset+1)%this.placeholderCount;return index;
      }
    }
    // Once unique capacity is exhausted, repeat a real project, never a filler.
    const index=this.cursor;this.cursor=(index+1)%this.projectCount;return index;
  }
  /** Give each entering offscreen tile its FINAL project before a line begins moving.
   * An incoming buffer tile may currently duplicate a visible project; without
   * staging, sync() would rename it on the final animation frame.
   *
   * Protect all still-visible projects, including departures. Prefer an existing
   * unique project or a free project; use neutral filler capacity when necessary. Do not change any currently
   * visible source-cell assignment while a shift is in progress.
   */
  stageEntrances(pairs:readonly {incoming:CellCoordinate;departing:CellCoordinate}[]):void {
    if(pairs.length===0)return;
    this.staged.clear();
    const departures=new Set(pairs.map(pair=>key(pair.departing)));
    const continuing=new Set<number>();
    for(const id of this.lastVisible){
      if(departures.has(id))continue;
      const project=this.assigned.get(id);
      if(project!==undefined)continuing.add(project);
    }
    // Departing tiles remain on screen during the animation: protect them too.
    const reserved=new Set<number>();
    for(const id of this.lastVisible){const value=this.assigned.get(id);if(value!==undefined)reserved.add(value);}
    if(this.pinnedKey){const value=this.assigned.get(this.pinnedKey);if(value!==undefined)reserved.add(value);}
    const currentlyReserved=new Set(this.assigned.values());
    for(const pair of pairs){
      const incomingKey=key(pair.incoming);
      // An already visible tile must never be reassigned by staging.
      if(this.lastVisible.has(incomingKey))continue;
      this.staged.add(incomingKey);
      const current=this.assigned.get(incomingKey);
      if(current!==undefined&&current<this.projectCount&&!reserved.has(current)){
        reserved.add(current);
        continue;
      }
      const exiting=this.assigned.get(key(pair.departing));
      const project=!this.placeholderCount&&reserved.size>=this.projectCount&&exiting!==undefined&&!continuing.has(exiting)
        ?exiting:this.choose(reserved,currentlyReserved);
      this.assigned.set(incomingKey,project);
      currentlyReserved.add(project);
      reserved.add(project);
    }
  }

  /** Release entrance reservations only after the renderer commits its shift. */
  finishEntrances():void {this.staged.clear();}

  /** Coordinates refer to original source tiles after reversing completed line shifts.
   * Retained cells comprise the visible viewport and two offscreen tile bands.
   */
  sync(visible:readonly CellCoordinate[],retained:readonly CellCoordinate[],pinned?:CellCoordinate):void {
    const keep=new Set(retained.map(key));
    for(const id of this.staged)keep.add(id);
    // An open bloom can travel beyond the bounded DOM pool and return later.
    if(pinned)keep.add(key(pinned));
    for(const id of this.assigned.keys())if(!keep.has(id))this.assigned.delete(id);
    const visibleKeys=new Set(visible.map(key));
    const usedRetained=new Set(this.assigned.values());
    const seenVisible=new Set<number>();
    const pinnedKey=pinned?key(pinned):null;this.pinnedKey=pinnedKey;
    if(pinnedKey&&!visibleKeys.has(pinnedKey)){
      const selected=this.assigned.get(pinnedKey);if(selected!==undefined)seenVisible.add(selected);
    }
    for(const id of this.staged){
      const value=this.assigned.get(id);if(value!==undefined)seenVisible.add(value);
    }
    for(const cell of visible){
      const id=key(cell),value=this.assigned.get(id);
      if(value!==undefined&&(this.lastVisible.has(id)||this.staged.has(id)))seenVisible.add(value);
    }
    const ordered=[...visible].sort((a,b)=>{
      const pinA=key(a)===pinnedKey?0:1;
      const pinB=key(b)===pinnedKey?0:1;
      if(pinA!==pinB)return pinA-pinB;
      const wasA=this.lastVisible.has(key(a))?0:1;
      const wasB=this.lastVisible.has(key(b))?0:1;
      return wasA-wasB||spiralIndex(a.column,a.row)-spiralIndex(b.column,b.row);
    });
    for(const cell of ordered){
      const id=key(cell);
      const existing=this.assigned.get(id);
      if(existing!==undefined&&(id===pinnedKey||this.lastVisible.has(id)||this.staged.has(id)||(!seenVisible.has(existing)&&existing<this.projectCount))){
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
      // Buffer decoration must not accumulate into walls when panning.
      // Recheck these real-project candidates when they actually enter view.
      const project=spiralIndex(cell.column,cell.row)%this.projectCount;
      this.assigned.set(id,project);
      usedRetained.add(project);
    }
    this.lastVisible=visibleKeys;
    // Intermediate viewport syncs must not release a still-moving entrance.
  }
}
