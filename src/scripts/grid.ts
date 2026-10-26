import { gridWindow, logicalCell, positiveModulo, tileSizeForWidth } from '../lib/grid-math';
import { easeInOut, planShiftRound, sourceCell, type ShiftEvent } from '../lib/grid-shifts';
import { createManualPanState, panIsMoving, queuePointerTravel, stepManualPan } from '../lib/grid-controls';
import { ProjectPlacement, spiralIndex, visibleCellBounds, type CellCoordinate } from '../lib/project-placement';

interface ProjectPlaceholder { name: string; tint: string; }
const projects: ProjectPlaceholder[] = [
  {name:'PROJECT 02',tint:'#568cdb'}, {name:'PROJECT 03',tint:'#d3a457'},
  {name:'PROJECT 04',tint:'#6ac0a5'}, {name:'PROJECT 05',tint:'#c778b9'},
  {name:'PROJECT 06',tint:'#db7859'}, {name:'PROJECT 07',tint:'#8c8be3'},
  {name:'PROJECT 08',tint:'#7eb875'}, {name:'PROJECT 09',tint:'#c1b56d'},
  {name:'PROJECT 10',tint:'#61afb9'}, {name:'PROJECT 11',tint:'#ab88d1'},
  {name:'PROJECT 12',tint:'#d08e79'}, {name:'PROJECT 13',tint:'#70a3c2'}
];
interface TileSlot { element: HTMLDivElement; column: number; row: number; projectIndex?: number; }
const viewport = document.querySelector<HTMLElement>('#grid-viewport');
const world = document.querySelector<HTMLElement>('#grid-world');
const resetButton = document.querySelector<HTMLButtonElement>('#reset-view');
const status = document.querySelector<HTMLElement>('#grid-status');

if (viewport && world && resetButton && status) {
  const surface=viewport, layer=world, reset=resetButton, liveStatus=status;
  const bufferCells=2;
  // Index zero is the real BABUNI.DEV tile. Demo project IDs then start at 02.
  const placement=new ProjectPlacement(projects.length+1);
  let panX=0, panY=0, tileSize=240, columns=0, rows=0;
  let firstColumn=0, firstRow=0, columnHead=0, rowHead=0;
  let slots:TileSlot[]=[];
  let visibleWindowSignature='';
  let activePointer:number|null=null, lastX=0, lastY=0;
  const heldArrows=new Set<string>();
  let manualPan=createManualPanState();
  let manualFrame:number|null=null;
  let previousManualTime:number|null=null;
  // Experimental movement values, not yet confirmed by the creator.
  const duration=4400, firstWait=6500, restWait=8000;
  const history:ShiftEvent[]=[];
  interface Moving {moves:ShiftEvent[]; started:number; pausedAt:number|null; fraction:number}
  let moving:Moving|null=null;
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
  const heading=document.querySelector<HTMLElement>('.header-note');
  let timer:ReturnType<typeof setTimeout>|null=null;

  function makeTile():HTMLDivElement {
    const element=document.createElement('div');
    element.className='grid-tile';
    element.setAttribute('aria-hidden','true');
    element.innerHTML='<div class="tile-face"><div class="tile-mark"></div><div class="tile-portal"></div><div class="tile-name"></div></div>';
    return element;
  }
  function populate(slot:TileSlot,column:number,row:number,force=false):void {
    if(slot.column!==column||slot.row!==row){
      slot.column=column;slot.row=row;
      slot.element.style.left=(column*tileSize)+'px';
      slot.element.style.top=(row*tileSize)+'px';
    }
    const source=sourceCell(column,row,history);
    // Unreserved outer buffer cells receive a temporary visual ID until they
    // approach the retention band; this never consumes a visible project.
    const projectIndex=placement.get(source)??spiralIndex(source.column,source.row)%placement.projectCount;
    if(!force&&slot.projectIndex===projectIndex)return;
    slot.projectIndex=projectIndex;
    const isOrigin=projectIndex===0;
    const project=isOrigin?{name:'BABUNI.DEV',tint:'#b78af9'}:projects[projectIndex-1];
    slot.element.style.setProperty('--portal-color',project.tint);
    slot.element.classList.toggle('grid-tile--origin',isOrigin);
    const label=slot.element.querySelector<HTMLElement>('.tile-name');
    if(label) label.textContent=project.name;
  }
  function rebuildPool():void {
    const rect=surface.getBoundingClientRect();
    if(!rect.width||!rect.height) return;
    tileSize=tileSizeForWidth(rect.width);
    surface.style.setProperty('--tile-size',tileSize+'px');
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells});
    columns=frame.columns; rows=frame.rows;
    firstColumn=frame.firstColumn; firstRow=frame.firstRow;
    columnHead=0; rowHead=0; slots=[];
    const fragment=document.createDocumentFragment();
    for(let y=0;y<rows;y++) for(let x=0;x<columns;x++){
      const element=makeTile();
      const slot:TileSlot={element,column:NaN,row:NaN};
      slots.push(slot); populate(slot,firstColumn+x,firstRow+y);
      fragment.appendChild(element);
    }
    layer.replaceChildren(fragment);
    updateField(true);
  }
  /** Update content reservations only when the set of visible tile cells changes.
   * This keeps manual camera dragging fast and prevents same-screen duplicates.
   */
  function syncProjects(frame:{originX:number;originY:number},rect:{width:number;height:number}):void {
    const visible:CellCoordinate[]=[];
    const retained:CellCoordinate[]=[];
    const margin=bufferCells*tileSize;
    for(const slot of slots){
      const x=frame.originX+slot.column*tileSize;
      const y=frame.originY+slot.row*tileSize;
      const source=sourceCell(slot.column,slot.row,history);
      if(x<rect.width&&x+tileSize>0&&y<rect.height&&y+tileSize>0)visible.push(source);
      if(x<rect.width+margin&&x+tileSize>-margin&&
         y<rect.height+margin&&y+tileSize>-margin)retained.push(source);
    }
    placement.sync(visible,retained);
    for(const slot of slots)populate(slot,slot.column,slot.row);
  }
  /** Move the whole layer for every drag event; repurpose only exiting pool slots. */
  function updateField(forceSync=false):void {
    const rect=surface.getBoundingClientRect();
    if(!rect.width||!rect.height||!columns||!rows) return;
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells});
    const dx=frame.firstColumn-firstColumn, dy=frame.firstRow-firstRow;
    if(Math.abs(dx)>=columns||Math.abs(dy)>=rows){
      columnHead=0; rowHead=0;
    } else {
      columnHead=positiveModulo(columnHead+dx,columns);
      rowHead=positiveModulo(rowHead+dy,rows);
    }
    firstColumn=frame.firstColumn; firstRow=frame.firstRow;
    if(dx||dy){
      for(let y=0;y<rows;y++){
        const row=logicalCell(firstRow,y,rowHead,rows);
        for(let x=0;x<columns;x++){
          const column=logicalCell(firstColumn,x,columnHead,columns);
          populate(slots[y*columns+x],column,row);
        }
      }
    }
    layer.style.transform='translate3d('+frame.originX+'px,'+frame.originY+'px,0)';
    const bounds=visibleCellBounds(rect.width,rect.height,tileSize,frame.originX,frame.originY);
    const signature=bounds.firstColumn+','+bounds.lastColumn+','+bounds.firstRow+','+bounds.lastRow;
    if(dx||dy||forceSync||signature!==visibleWindowSignature)syncProjects(frame,rect);
    visibleWindowSignature=signature;
    if(moving)paintMovement(moving.fraction);
  }
  function paintMovement(fraction:number):void {
    const movingRows=new Map<number,number>(), movingColumns=new Map<number,number>();
    for(const move of moving?.moves??[]){
      (move.axis==='row'?movingRows:movingColumns).set(move.line,move.direction);
    }
    const p=easeInOut(fraction);
    for(const slot of slots){
      const dx=(movingRows.get(slot.row)??0)*tileSize*p;
      const dy=(movingColumns.get(slot.column)??0)*tileSize*p;
      slot.element.style.transform=(dx||dy)?'translate3d('+dx+'px,'+dy+'px,0)':'';
    }
  }
  function nextRound(delay:number):void {
    if(timer!==null)clearTimeout(timer);
    timer=setTimeout(startRound,delay);
  }
  function startRound():void {
    timer=null;
    if(activePointer!==null||heldArrows.size>0||panIsMoving(manualPan)||document.hidden||prefersReduced.matches||moving){
      nextRound(1000);
      return;
    }
    const rect=surface.getBoundingClientRect();
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells});
    const top=Math.floor(-frame.originY/tileSize);
    const bottom=Math.ceil((rect.height-frame.originY)/tileSize)-1;
    const left=Math.floor(-frame.originX/tileSize);
    const right=Math.ceil((rect.width-frame.originX)/tileSize)-1;
    const visibleRows=Array.from({length:bottom-top+1},(_,i)=>top+i);
    const visibleColumns=Array.from({length:right-left+1},(_,i)=>left+i);
    const round=planShiftRound(visibleRows,visibleColumns);
    if(!round.moves.length){nextRound(restWait);return;}
    moving={moves:round.moves,started:performance.now(),pausedAt:null,fraction:0};
    if(heading)heading.textContent=round.axis==='row'?'Rows are shifting':'Columns are shifting';
    requestAnimationFrame(frameMovement);
  }
  function frameMovement(now:number):void {
    if(!moving||moving.pausedAt!==null)return;
    moving.fraction=Math.min(1,Math.max(0,(now-moving.started)/duration));
    paintMovement(moving.fraction);
    if(moving.fraction<1){requestAnimationFrame(frameMovement);return;}
    history.push(...moving.moves);
    moving=null;
    // The source identity is carried by the shifted tile, not by its old slot.
    updateField(true);
    for(const slot of slots)slot.element.style.transform='';
    if(heading)heading.textContent='Living grid prototype';
    nextRound(restWait);
  }
  function pauseMovement():void {
    if(moving&&moving.pausedAt===null)moving.pausedAt=performance.now();
  }
  function resumeMovement():void {
    if(!moving||moving.pausedAt===null||activePointer!==null||heldArrows.size>0||panIsMoving(manualPan)||document.hidden)return;
    moving.started+=performance.now()-moving.pausedAt;
    moving.pausedAt=null;
    requestAnimationFrame(frameMovement);
  }
  function arrowDirection():{x:number;y:number}{
    return {
      x:Number(heldArrows.has('ArrowLeft'))-Number(heldArrows.has('ArrowRight')),
      y:Number(heldArrows.has('ArrowUp'))-Number(heldArrows.has('ArrowDown'))
    };
  }
  function scheduleManualFrame():void {
    if(manualFrame===null) manualFrame=requestAnimationFrame(animateManual);
  }
  function animateManual(now:number):void {
    manualFrame=null;
    const elapsed=previousManualTime===null?1/60:(now-previousManualTime)/1000;
    previousManualTime=now;
    const step=stepManualPan(manualPan,elapsed,activePointer!==null,arrowDirection());
    manualPan=step.state;
    if(step.delta.x!==0||step.delta.y!==0){
      panX+=step.delta.x;panY+=step.delta.y;
      updateField();
    }
    if(activePointer!==null||heldArrows.size>0||panIsMoving(manualPan)){
      scheduleManualFrame();
    }else{
      previousManualTime=null;
      resumeMovement();
    }
  }
  function resetManualInput():void {
    heldArrows.clear();
    manualPan=createManualPanState();
    previousManualTime=null;
    resumeMovement();
  }

  surface.addEventListener('pointerdown',event=>{
    if(activePointer!==null||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0)) return;
    activePointer=event.pointerId; lastX=event.clientX; lastY=event.clientY;
    surface.setPointerCapture(event.pointerId);
    surface.classList.add('is-dragging');
    manualPan.pending={x:0,y:0};
    manualPan.pointerVelocity={x:0,y:0};
    pauseMovement();
    scheduleManualFrame();
  });
  surface.addEventListener('pointermove',event=>{
    if(event.pointerId!==activePointer)return;
    manualPan=queuePointerTravel(manualPan,event.clientX-lastX,event.clientY-lastY);
    lastX=event.clientX;lastY=event.clientY;
    scheduleManualFrame();
  });
  function release(event:PointerEvent):void {
    if(event.pointerId!==activePointer)return;
    activePointer=null; surface.classList.remove('is-dragging');
    // Discard remaining cursor lag on release: no delayed ghost-chase.
    manualPan.pending={x:0,y:0};
    manualPan.pointerVelocity={x:0,y:0};
    resumeMovement();
    if(surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
  }
  surface.addEventListener('pointerup',release);
  surface.addEventListener('pointercancel',release);
  surface.addEventListener('lostpointercapture',release);
  const arrowNames=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
  surface.addEventListener('keydown',event=>{
    if(event.key==='Home'){
      event.preventDefault();
      resetManualInput();
      panX=0;panY=0;updateField();
      return;
    }
    if(!arrowNames.has(event.key))return;
    event.preventDefault();
    if(!heldArrows.has(event.key)){
      heldArrows.add(event.key);
      pauseMovement();
      scheduleManualFrame();
    }
  });
  window.addEventListener('keyup',event=>{
    if(!arrowNames.has(event.key))return;
    if(heldArrows.delete(event.key)){
      event.preventDefault();
      scheduleManualFrame();
    }
  });
  window.addEventListener('blur',()=>{
    heldArrows.clear();
    manualPan.keyboardVelocity={x:0,y:0};
    if(activePointer!==null){
      activePointer=null;
      manualPan.pending={x:0,y:0};
      manualPan.pointerVelocity={x:0,y:0};
      surface.classList.remove('is-dragging');
    }
    resumeMovement();
  });
  reset.addEventListener('click',()=>{
    resetManualInput();
    panX=0;panY=0;updateField();
    liveStatus.textContent='Returned to the starting tile.';
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)pauseMovement();else resumeMovement();
  });
  prefersReduced.addEventListener('change',()=>{
    if(!prefersReduced.matches)nextRound(firstWait);
  });
  nextRound(firstWait);
  new ResizeObserver(rebuildPool).observe(surface);
  rebuildPool();
}
