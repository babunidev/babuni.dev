import { gridWindow, logicalCell, positiveModulo, tileSizeForWidth } from '../lib/grid-math';
import { easeInOut, planShiftRound, sourceCell, type ShiftEvent } from '../lib/grid-shifts';
import { createManualPanState, panIsMoving, queuePointerTravel, stepManualPan } from '../lib/grid-controls';
import { ProjectPlacement, spiralIndex, visibleCellBounds, type CellCoordinate } from '../lib/project-placement';
import { demoProjects } from '../lib/demo-projects';
import { topicForProject } from '../lib/project-topics';
import { introSequence, INTRO_SPAWN_STAGGER_MS } from '../lib/grid-intro';

interface TileSlot { element: HTMLDivElement; column: number; row: number; projectIndex?: number; }
const viewport = document.querySelector<HTMLElement>('#grid-viewport');
const world = document.querySelector<HTMLElement>('#grid-world');
const resetButton = document.querySelector<HTMLButtonElement>('#reset-view');
const status = document.querySelector<HTMLElement>('#grid-status');

if (viewport && world && resetButton && status) {
  const surface=viewport, layer=world, reset=resetButton, liveStatus=status;
  const bufferCells=2;
  // First inventory entry is BABUNI.DEV; all 53 candidates remain provisional.
  const placement=new ProjectPlacement(demoProjects.length);
  let panX=0, panY=0, tileSize=240, columns=0, rows=0;
  let firstColumn=0, firstRow=0, columnHead=0, rowHead=0;
  let slots:TileSlot[]=[];
  let visibleWindowSignature='';
  let viewportWidth=0, viewportHeight=0;
  let introPlayed=false, introPending=0;
  let activePointer:number|null=null, lastX=0, lastY=0;
  let pointerDownX=0, pointerDownY=0, pointerDragged=false;
  let pinnedBeforeDown:HTMLDivElement|null=null;
  let activeTopic:HTMLDivElement|null=null;
  let pinnedTopic:HTMLDivElement|null=null;
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

  /** At most one topic can be open at a time. The portal is the only trigger. */
  function hideTopic():void {
    activeTopic?.classList.remove('grid-tile--topic-open');
    activeTopic=null;
    pinnedTopic=null;
  }
  function showTopic(tile:HTMLDivElement):void {
    if(tile.getAttribute('aria-hidden')==='true')return;
    if(activeTopic!==tile)hideTopic();
    activeTopic=tile;
    tile.classList.add('grid-tile--topic-open');
  }
  function portalFrom(target:EventTarget|null):HTMLButtonElement|null {
    return target instanceof Element
      ? target.closest<HTMLButtonElement>('.tile-portal'):null;
  }
  function makeTile():HTMLDivElement {
    const element=document.createElement('div');
    element.className='grid-tile';
    element.setAttribute('aria-hidden','true');
    element.innerHTML='<div class="tile-face"><div class="tile-mark" aria-hidden="true"></div><button type="button" class="tile-portal" tabindex="-1" aria-label="Project topic"></button><div class="tile-topic" aria-hidden="true"></div><div class="tile-name"></div></div>';
    return element;
  }
  function populate(slot:TileSlot,column:number,row:number,force=false):void {
    if(slot.column!==column||slot.row!==row){
      if(activeTopic===slot.element)hideTopic();
      slot.column=column;slot.row=row;
      slot.element.style.left=(column*tileSize)+'px';
      slot.element.style.top=(row*tileSize)+'px';
    }
    const source=sourceCell(column,row,history);
    // Unreserved outer buffer cells receive a temporary visual ID until they
    // approach the retention band; this never consumes a visible project.
    const projectIndex=placement.get(source)??spiralIndex(source.column,source.row)%placement.projectCount;
    if(!force&&slot.projectIndex===projectIndex)return;
    if(activeTopic===slot.element)hideTopic();
    slot.projectIndex=projectIndex;
    const isOrigin=projectIndex===0;
    const project=demoProjects[projectIndex];
    slot.element.dataset.projectId=project.id;
    slot.element.dataset.projectSummary=project.shortSummary;
    slot.element.style.setProperty('--portal-color',project.tint);
    slot.element.classList.toggle('grid-tile--origin',isOrigin);
    slot.element.classList.toggle('grid-tile--long-title',project.name.length>18);
    const label=slot.element.querySelector<HTMLElement>('.tile-name');
    if(label) label.textContent=project.name;
    const topic=topicForProject(project.id);
    const bubble=slot.element.querySelector<HTMLElement>('.tile-topic');
    if(bubble)bubble.textContent=topic;
    const portal=slot.element.querySelector<HTMLButtonElement>('.tile-portal');
    if(portal)portal.setAttribute('aria-label',project.name+': '+topic);
  }
  /** The introduction only affects the first visible tiles, once on page load. */
  function cancelIntro():void {
    if(introPending===0)return;
    for(const slot of slots){
      slot.element.classList.remove('grid-tile--spawning');
      slot.element.style.removeProperty('--tile-spawn-delay');
    }
    introPending=0;
  }
  function startIntro(frame:{originX:number;originY:number},rect:{width:number;height:number}):void {
    if(prefersReduced.matches)return;
    const visible=slots.filter(slot=>{
      const x=frame.originX+slot.column*tileSize;
      const y=frame.originY+slot.row*tileSize;
      return x<rect.width&&x+tileSize>0&&y<rect.height&&y+tileSize>0;
    });
    const ordered=introSequence(visible,slot=>sourceCell(slot.column,slot.row,history));
    introPending=ordered.length;
    for(const [index,slot] of ordered.entries()){
      slot.element.style.setProperty('--tile-spawn-delay',(index*INTRO_SPAWN_STAGGER_MS)+'ms');
      slot.element.classList.add('grid-tile--spawning');
      slot.element.addEventListener('animationend',event=>{
        if(event.animationName!=='tile-spawn'||!slot.element.classList.contains('grid-tile--spawning'))return;
        slot.element.classList.remove('grid-tile--spawning');
        slot.element.style.removeProperty('--tile-spawn-delay');
        introPending=Math.max(0,introPending-1);
      },{once:true});
    }
  }
  function rebuildPool():void {
    const rect=surface.getBoundingClientRect();
    if(!rect.width||!rect.height) return;
    // ResizeObserver repeats the initial size; never rebuild/replay for that.
    if(rect.width===viewportWidth&&rect.height===viewportHeight&&slots.length)return;
    cancelIntro();
    hideTopic();
    viewportWidth=rect.width;viewportHeight=rect.height;
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
    if(!introPlayed){
      introPlayed=true;
      startIntro(frame,rect);
    }
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
      const isVisible=x<rect.width&&x+tileSize>0&&y<rect.height&&y+tileSize>0;
      if(isVisible)visible.push(source);
      // Accessible only while the actual tile is inside the viewport.
      slot.element.setAttribute('aria-hidden',String(!isVisible));
      const button=slot.element.querySelector<HTMLButtonElement>('.tile-portal');
      if(button){
        button.tabIndex=isVisible?0:-1;
        if(!isVisible&&document.activeElement===button)button.blur();
      }
      if(!isVisible&&activeTopic===slot.element)hideTopic();
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
      if(activeTopic)hideTopic();
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
    hideTopic();
    cancelIntro();
    // All incoming tiles already exist just outside the viewport. Give them
    // their final project identity NOW, before their shift reveals them.
    // Otherwise the completed sync could visibly replace their name and tint.
    const entrances=round.moves.map(move=>{
      if(move.axis==='row'){
        const enteringColumn=move.direction===1?left-1:right+1;
        const departingColumn=move.direction===1?right:left;
        return {
          incoming:sourceCell(enteringColumn,move.line,history),
          departing:sourceCell(departingColumn,move.line,history)
        };
      }
      const enteringRow=move.direction===1?top-1:bottom+1;
      const departingRow=move.direction===1?bottom:top;
      return {
        incoming:sourceCell(move.line,enteringRow,history),
        departing:sourceCell(move.line,departingRow,history)
      };
    });
    placement.stageEntrances(entrances);
    // Only offscreen entrances should receive a new project at this point.
    for(const slot of slots)populate(slot,slot.column,slot.row);
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

  surface.addEventListener('pointerover',event=>{
    if(event.pointerType==='touch'||activePointer!==null)return;
    const portal=portalFrom(event.target);
    if(!portal)return;
    const tile=portal.closest<HTMLDivElement>('.grid-tile');
    if(tile){
      pinnedTopic=null;
      showTopic(tile);
    }
  });
  surface.addEventListener('pointerout',event=>{
    if(event.pointerType==='touch')return;
    const portal=portalFrom(event.target);
    // Mouse hover ends when leaving the portal; keyboard focus remains open.
    if(portal&&!portal.matches(':focus-visible')
       &&activeTopic===portal.closest('.grid-tile'))hideTopic();
  });
  surface.addEventListener('focusin',event=>{
    const portal=portalFrom(event.target);
    const tile=portal?.closest<HTMLDivElement>('.grid-tile');
    if(tile)showTopic(tile);
  });
  surface.addEventListener('focusout',event=>{
    const portal=portalFrom(event.target);
    if(portal&&activeTopic===portal.closest('.grid-tile')&&!pinnedTopic)hideTopic();
  });
  // Keyboard Enter/Space can reveal the focused topic as well. Touch taps
  // are handled at pointerup because pointer capture retargets pointer events.
  surface.addEventListener('click',event=>{
    if(event.detail!==0)return;
    const portal=portalFrom(event.target);
    const tile=portal?.closest<HTMLDivElement>('.grid-tile');
    if(tile)showTopic(tile);
  });
  surface.addEventListener('pointerdown',event=>{
    if(activePointer!==null||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
    cancelIntro();
    pinnedBeforeDown=pinnedTopic;
    pointerDownX=event.clientX;pointerDownY=event.clientY;pointerDragged=false;
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
    if(Math.hypot(event.clientX-pointerDownX,event.clientY-pointerDownY)>9){
      pointerDragged=true;
      hideTopic();
    }
    manualPan=queuePointerTravel(manualPan,event.clientX-lastX,event.clientY-lastY);
    lastX=event.clientX;lastY=event.clientY;
    scheduleManualFrame();
  });
  function release(event:PointerEvent):void {
    if(event.pointerId!==activePointer)return;
    const isTap=event.type==='pointerup'&&!pointerDragged
      &&Math.hypot(event.clientX-pointerDownX,event.clientY-pointerDownY)<=9;
    activePointer=null;surface.classList.remove('is-dragging');
    if(isTap){
      // Pointer capture retargets pointerup to the viewport, so hit-test the
      // actual portal location. Everywhere else simply dismisses the bubble.
      const portal=portalFrom(document.elementFromPoint(event.clientX,event.clientY));
      const tile=portal?.closest<HTMLDivElement>('.grid-tile');
      if(tile&&surface.contains(tile)){
        if(pinnedBeforeDown===tile){
          hideTopic();
          portal?.blur();
        }else{
          showTopic(tile);
          pinnedTopic=tile;
        }
      }else hideTopic();
    }
    pinnedBeforeDown=null;
    if(event.type==='pointercancel')hideTopic();
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
      hideTopic();
      cancelIntro();
      event.preventDefault();
      resetManualInput();
      panX=0;panY=0;updateField();
      return;
    }
    if(!arrowNames.has(event.key))return;
    hideTopic();
    cancelIntro();
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
    hideTopic();
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
    hideTopic();
    cancelIntro();
    resetManualInput();
    panX=0;panY=0;updateField();
    liveStatus.textContent='Returned to the starting tile.';
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){hideTopic();pauseMovement();}
    else resumeMovement();
  });
  prefersReduced.addEventListener('change',()=>{
    if(prefersReduced.matches)cancelIntro();
    else nextRound(firstWait);
  });
  nextRound(firstWait);
  new ResizeObserver(rebuildPool).observe(surface);
  rebuildPool();
}
