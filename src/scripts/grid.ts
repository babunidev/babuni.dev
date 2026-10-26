import {occupiedCell,restingCell,bloomVacancies,tileAtCenter} from '../lib/bloom-geometry';
import { gridWindow, logicalCell, positiveModulo, tileSizeForWidth } from '../lib/grid-math';
import { easeInOut, SHIFT_DURATION_MS, planShiftRound, sourceCell, type ShiftEvent } from '../lib/grid-shifts';
import { createManualPanState, panIsMoving, queuePointerTravel, stepManualPan } from '../lib/grid-controls';
import { ProjectPlacement, spiralIndex, visibleCellBounds, type CellCoordinate } from '../lib/project-placement';
import { demoProjects } from '../lib/demo-projects';
import { topicLabelsForProject, TOPIC_POINTS, chooseAmbientPoint, topicRevealPlan, type TopicPoint } from '../lib/project-topics';
import { introSequence, INTRO_SPAWN_STAGGER_MS } from '../lib/grid-intro';
import { centeredPan, interpolateCenter, bloomModuleCell, shiftsForBloom,
  CENTER_DURATION_MS, BLOOM_SHIFT_DURATION_MS, AMBIENT_INTERVAL_MS,
  AMBIENT_VISIBLE_MS, AMBIENT_RETRY_MS, ambientInsets,
  ambientTileIsEligible, ambientPollDelay,
  shiftAvoidsBloom, selectionShiftAction
} from '../lib/grid-focus';

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
  interface ProjectChoice {source:CellCoordinate; projectId:string}
  let selectedChoice:ProjectChoice|null=null;
  let pendingChoice:ProjectChoice|null=null;
  let centering:{fromX:number;fromY:number;toX:number;toY:number;started:number|null}|null=null;
  let centerFrame:number|null=null;
  let bloomModule:HTMLElement|null=null;
  let bloomAnchor:CellCoordinate|null=null;
  let metadataModule:HTMLElement|null=null;
  let bloomOpeningTimer:ReturnType<typeof setTimeout>|null=null;
  let bloomClosingTimer:ReturnType<typeof setTimeout>|null=null;
  let teaserTile:HTMLDivElement|null=null;
  let teaserTimer:ReturnType<typeof setTimeout>|null=null;
  let ambientTimer:ReturnType<typeof setTimeout>|null=null;
  let nextAmbientAt=performance.now()+AMBIENT_INTERVAL_MS;
  let lastAmbientProjectId:string|null=null;
  let lastAmbientPoint:TopicPoint|null=null;
  let pointerDownSelect:HTMLButtonElement|null=null;
  let activeTopic:HTMLDivElement|null=null;
  const heldArrows=new Set<string>();
  let manualPan=createManualPanState();
  let manualFrame:number|null=null;
  let previousManualTime:number|null=null;
  // Experimental movement values, not yet confirmed by the creator.
  const firstWait=6500, restWait=8000;
  const history:ShiftEvent[]=[];
  interface Moving {moves:ShiftEvent[]; started:number; pausedAt:number|null; fraction:number}
  let moving:Moving|null=null;
  let closeAfterShift:{next:ProjectChoice|null}|null=null;
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobileTopics=matchMedia('(hover: none) and (pointer: coarse)');
  const heading=document.querySelector<HTMLElement>('.header-note');
  let timer:ReturnType<typeof setTimeout>|null=null;

  /** Direct exploration reveals all three snippets; an ambient hint lights
   * only one of the three diamonds. Never show multiple projects together.
   */
  let topicRevealTimers:ReturnType<typeof setTimeout>[]=[];
  function hideTopic():void {
    for(const timer of topicRevealTimers)clearTimeout(timer);
    topicRevealTimers=[];
    if(teaserTimer!==null){clearTimeout(teaserTimer);teaserTimer=null;}
    teaserTile=null;
    activeTopic?.classList.remove('grid-tile--topic-open');
    activeTopic?.removeAttribute('data-topic-mode');
    activeTopic?.removeAttribute('data-topic-sequence');
    activeTopic=null;
  }
  function showTopic(tile:HTMLDivElement,point:TopicPoint|'all'='all'):void {
    if(tile.getAttribute('aria-hidden')==='true')return;
    // Focus, pointer entry and touch can all target the same exploration.
    // Preserve an existing sequence rather than restarting its random order.
    if(activeTopic===tile&&point==='all'&&tile.dataset.topicSequence==='true')return;
    hideTopic();
    activeTopic=tile;
    tile.classList.add('grid-tile--topic-open');
    if(point!=='all'){
      tile.dataset.topicMode=point;
      return;
    }
    tile.dataset.topicSequence='true';
    for(const reveal of topicRevealPlan()){
      const show=()=>{
        if(activeTopic!==tile)return;
        tile.dataset.topicMode=[tile.dataset.topicMode,reveal.point].filter(Boolean).join(' ');
      };
      if(reveal.delay===0)show();
      else topicRevealTimers.push(setTimeout(show,reveal.delay));
    }
  }

  function selectFrom(target:EventTarget|null):HTMLButtonElement|null {
    return target instanceof Element
      ? target.closest<HTMLButtonElement>('.tile-select')
        ??target.closest('.grid-tile')?.querySelector<HTMLButtonElement>('.tile-select')??null:null;
  }
  function sameChoice(a:ProjectChoice,b:ProjectChoice):boolean {
    return a.source.column===b.source.column&&a.source.row===b.source.row
      &&a.projectId===b.projectId;
  }
  function choiceFor(tile:HTMLDivElement):ProjectChoice|null {
    const slot=slots.find(slot=>slot.element===tile);
    if(!slot||slot.projectIndex===undefined)return null;
    // A shifting tile can already be visibly entering from the buffer while
    // its resting-position aria-hidden flag still says it is offscreen.
    const box=tile.getBoundingClientRect(),view=surface.getBoundingClientRect();
    if(box.right<=view.left||box.left>=view.right
      ||box.bottom<=view.top||box.top>=view.bottom)return null;
    return {
      source:sourceCell(slot.column,slot.row,history),
      projectId:demoProjects[slot.projectIndex].id
    };
  }
  function locate(choice:ProjectChoice):TileSlot|undefined {
    return slots.find(slot=>{
      const source=sourceCell(slot.column,slot.row,history);
      return source.column===choice.source.column&&source.row===choice.source.row
        &&demoProjects[slot.projectIndex??-1]?.id===choice.projectId;
    });
  }
  function highlightSelection():void {
    const choice=pendingChoice??selectedChoice;
    const waiting=!!moving&&(pendingChoice!==null||closeAfterShift!==null);
    for(const slot of slots){
      const source=sourceCell(slot.column,slot.row,history);
      const selected=!!choice&&source.column===choice.source.column
        &&source.row===choice.source.row
        &&demoProjects[slot.projectIndex??-1]?.id===choice.projectId;
      slot.element.classList.toggle('grid-tile--selected',selected);
      slot.element.classList.toggle('grid-tile--waiting',selected&&waiting);
      slot.element.querySelector('.tile-select')?.setAttribute('aria-busy',String(selected&&waiting));
    }
  }
  function makeTile():HTMLDivElement {
    const element=document.createElement('div');
    element.className='grid-tile';
    element.setAttribute('aria-hidden','true');
    element.innerHTML='<div class="tile-face"><button type="button" class="tile-select" tabindex="-1" aria-label="Explore project"></button><div class="tile-portal-cluster"><div class="tile-mark tile-mark--top" aria-hidden="true"></div><div class="tile-mark tile-mark--left" aria-hidden="true"></div><div class="tile-mark tile-mark--right" aria-hidden="true"></div><div class="tile-portal" aria-hidden="true"></div><div class="tile-topic tile-topic--top" data-topic-point="top" aria-hidden="true"></div><div class="tile-topic tile-topic--left" data-topic-point="left" aria-hidden="true"></div><div class="tile-topic tile-topic--right" data-topic-point="right" aria-hidden="true"></div></div><div class="tile-name"></div></div>';
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
    const topics=topicLabelsForProject(project.id);
    for(const point of TOPIC_POINTS){
      const bubble=slot.element.querySelector<HTMLElement>('.tile-topic--'+point);
      if(bubble)bubble.textContent=topics[point];
    }
    const portal=slot.element.querySelector<HTMLDivElement>('.tile-portal');
    if(portal){
      // Artwork follows semantic project identity, never a recycled tile index.
      // Clear children on reassignment so the logo cannot leak to another project.
      portal.replaceChildren();
      const hasArtwork=project.id==='babuni-dev';
      portal.classList.toggle('tile-portal--artwork',hasArtwork);
      if(hasArtwork){
        const image=document.createElement('img');
        image.className='tile-portal-image';image.alt='';
        image.loading='lazy';image.decoding='async';image.draggable=false;
        image.width=1254;image.height=1254;
        image.src='/portal-content/PortalContentBabuniDev.png';
        portal.appendChild(image);
      }
    }
    const select=slot.element.querySelector<HTMLButtonElement>('.tile-select');
    if(select)select.setAttribute('aria-label','Explore '+project.name+': '+TOPIC_POINTS.map(point=>topics[point]).join(', '));
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
    stopSelection(false);
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
    const anchor=bloomModule?bloomAnchor:null;
    const vacancies=anchor?bloomVacancies(anchor):[];
    for(const slot of slots){
      const visual=occupiedCell(slot,vacancies);
      const x=frame.originX+visual.column*tileSize;
      const y=frame.originY+visual.row*tileSize;
      const source=sourceCell(slot.column,slot.row,history);
      const isVisible=x<rect.width&&x+tileSize>0&&y<rect.height&&y+tileSize>0;
      if(isVisible)visible.push(source);
      // Accessible only while the actual tile is inside the viewport.
      slot.element.setAttribute('aria-hidden',String(!isVisible));
      const select=slot.element.querySelector<HTMLButtonElement>('.tile-select');
      if(select){
        select.tabIndex=isVisible?0:-1;
        if(!isVisible&&document.activeElement===select)select.blur();
      }
      if(!isVisible&&activeTopic===slot.element)hideTopic();
      if(x<rect.width+margin&&x+tileSize>-margin&&
         y<rect.height+margin&&y+tileSize>-margin)retained.push(source);
    }
    // Give the selected original source first claim on its identity while panning.
    placement.sync(visible,retained,selectedChoice?.source);
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
    if(moving||bloomModule)paintMovement(moving?.fraction??0);
    if(selectedChoice)highlightSelection();
    refreshMobileTopics();
  }
  function paintMovement(fraction:number):void {
    const vacancies=bloomModule&&bloomAnchor?bloomVacancies(bloomAnchor):[];
    for(const slot of slots){
      const visual=occupiedCell(slot,vacancies);
      if(bloomModule)slot.element.classList.toggle('grid-tile--bloom-shifted',visual.column!==slot.column);
      const position=paintedCell(slot,fraction);
      const dx=(position.column-slot.column)*tileSize;
      const dy=(position.row-slot.row)*tileSize;
      slot.element.style.transform=(dx||dy)?'translate3d('+dx+'px,'+dy+'px,0)':'';
    }
    refreshMobileTopics();
  }
  function paintedCell(slot:TileSlot,fraction=moving?.fraction??0):CellCoordinate {
    const visual=occupiedCell(slot,bloomModule&&bloomAnchor?bloomVacancies(bloomAnchor):[]);
    const p=easeInOut(fraction);
    const rowMove=moving?.moves.find(move=>move.axis==='row'&&move.line===visual.row);
    const columnMove=moving?.moves.find(move=>move.axis==='column'&&move.line===visual.column);
    return {column:visual.column+(rowMove?.direction??0)*p,
      row:visual.row+(columnMove?.direction??0)*p};
  }
  function refreshMobileTopics():void {
    surface.classList.toggle('has-center-topics',mobileTopics.matches);
    if(!mobileTopics.matches||document.hidden)return;
    const tile=tileAtCenter(slots,slot=>paintedCell(slot),
      {column:.5-panX/tileSize,row:.5-panY/tileSize});
    if(tile)showTopic(tile.element);
    else hideTopic(); // The center can be a bloom module rather than a tile.
  }
  function nextRound(delay:number):void {
    if(timer!==null)clearTimeout(timer);
    timer=setTimeout(startRound,delay);
  }
  function startRound():void {
    timer=null;
    if(centering||pendingChoice||bloomClosingTimer!==null){
      nextRound(1000);
      return;
    }
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
    let visibleRows=Array.from({length:bottom-top+1},(_,i)=>top+i);
    let visibleColumns=Array.from({length:right-left+1},(_,i)=>left+i);
    if(selectedChoice&&bloomModule){
      const anchor=bloomAnchor;
      if(!anchor){nextRound(1000);return;}
      const cell={column:anchor.column,row:anchor.row};
      visibleRows=visibleRows.filter(line=>shiftAvoidsBloom({axis:'row',line,direction:1},cell));
      visibleColumns=visibleColumns.filter(line=>shiftAvoidsBloom({axis:'column',line,direction:1},cell));
    }else if(selectedChoice){nextRound(1000);return;}
    const round=planShiftRound(visibleRows,visibleColumns);
    if(!round.moves.length){nextRound(restWait);return;}
    cancelIntro();
    // All incoming tiles already exist just outside the viewport. Give them
    // their final project identity NOW, before their shift reveals them.
    // Otherwise the completed sync could visibly replace their name and tint.
    const anchor=bloomModule?bloomAnchor:null;
    const vacancies=anchor?bloomVacancies(anchor):[];
    round.moves=round.moves.map(move=>({...move,vacancies}));
    const sourceAt=(column:number,row:number)=>{
      const cell=restingCell({column,row},vacancies);
      return sourceCell(cell.column,cell.row,history);
    };
    const entrances=round.moves.map(move=>{
      if(move.axis==='row'){
        const enteringColumn=move.direction===1?left-1:right+1;
        const departingColumn=move.direction===1?right:left;
        return {
          incoming:sourceAt(enteringColumn,move.line),
          departing:sourceAt(departingColumn,move.line)
        };
      }
      const enteringRow=move.direction===1?top-1:bottom+1;
      const departingRow=move.direction===1?bottom:top;
      return {
        incoming:sourceAt(move.line,enteringRow),
        departing:sourceAt(move.line,departingRow)
      };
    });
    placement.stageEntrances(entrances);
    // Only offscreen entrances should receive a new project at this point.
    for(const slot of slots)populate(slot,slot.column,slot.row);
    moving={moves:round.moves,started:performance.now(),pausedAt:null,fraction:0};
    surface.classList.add('is-autoshifting');
    if(heading)heading.textContent=round.axis==='row'?'Rows are shifting':'Columns are shifting';
    requestAnimationFrame(frameMovement);
  }
  function frameMovement(now:number):void {
    if(!moving||moving.pausedAt!==null)return;
    moving.fraction=Math.min(1,Math.max(0,(now-moving.started)/SHIFT_DURATION_MS));
    paintMovement(moving.fraction);
    if(moving.fraction<1){requestAnimationFrame(frameMovement);return;}
    history.push(...moving.moves);
    moving=null;
    // The source identity is carried by the shifted tile, not by its old slot.
    updateField(true);
    paintMovement(0);
    surface.classList.remove('is-autoshifting');
    if(heading)heading.textContent=selectedChoice?'Exploring project':'Living grid prototype';
    if(closeAfterShift){
      const next=closeAfterShift.next;closeAfterShift=null;
      stopSelection(true,next);
    }else if(pendingChoice&&!bloomClosingTimer){
      const chosen=pendingChoice;pendingChoice=null;
      beginSelection(chosen);
    }else nextRound(restWait);
  }
  function pauseMovement():void {
    if(moving&&moving.pausedAt===null){
      moving.pausedAt=performance.now();
      surface.classList.remove('is-autoshifting');
    }
  }
  function resumeMovement():void {
    if(!moving||moving.pausedAt===null||activePointer!==null||heldArrows.size>0||panIsMoving(manualPan)||document.hidden)return;
    moving.started+=performance.now()-moving.pausedAt;
    moving.pausedAt=null;
    surface.classList.add('is-autoshifting');
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
  /** Close old bloom before opening another. Pending source is highlighted
   * immediately while the old right-hand tiles slide home.
   */
  function stopSelection(animateReturn=true,nextChoice:ProjectChoice|null=null):void {
    const wasActive=!!selectedChoice||!!centering||!!bloomModule||!!pendingChoice;
    const hadBloom=!!bloomModule;
    if(hadBloom&&moving&&animateReturn){
      // Keep the current clock and easing curve. Selection/collapse waits
      // for this event to finish at its established tempo.
      closeAfterShift={next:nextChoice};
      pendingChoice=nextChoice;
      highlightSelection();
      if(nextChoice)liveStatus.textContent='Project selected. Waiting for the current shift to finish at its normal pace.';
      resumeMovement();
      return;
    }
    closeAfterShift=null;
    pendingChoice=nextChoice;
    centering=null;
    if(centerFrame!==null){cancelAnimationFrame(centerFrame);centerFrame=null;}
    if(bloomOpeningTimer!==null){clearTimeout(bloomOpeningTimer);bloomOpeningTimer=null;}
    if(bloomClosingTimer!==null){clearTimeout(bloomClosingTimer);bloomClosingTimer=null;}
    bloomModule?.remove();bloomModule=null;
    bloomAnchor=null;
    metadataModule?.remove();metadataModule=null;
    surface.classList.remove('is-focusing','is-blooming','is-bloom-opening','is-bloom-closing');
    for(const slot of slots)slot.element.classList.remove('grid-tile--bloom-returning');
    if(hadBloom&&animateReturn&&!prefersReduced.matches)
      surface.classList.add('is-bloom-closing');
    for(const slot of slots){
      const element=slot.element;
      element.classList.toggle('grid-tile--bloom-returning',
        hadBloom&&animateReturn&&!prefersReduced.matches
          &&element.classList.contains('grid-tile--bloom-shifted'));
      element.classList.remove('grid-tile--bloom-shifted','grid-tile--selected');
      element.style.removeProperty('transition');
    }
    selectedChoice=null;
    // Keep independent paused motion while displaced runs return home.
    paintMovement(moving?.fraction??0);
    highlightSelection();
    if(heading)heading.textContent=nextChoice?'Switching projects':'Living grid prototype';
    if(hadBloom&&animateReturn&&!prefersReduced.matches){
      bloomClosingTimer=setTimeout(()=>{
        surface.classList.remove('is-bloom-closing');
        for(const slot of slots){
          slot.element.classList.remove('grid-tile--bloom-returning');
          slot.element.style.removeProperty('transition');
        }
        bloomClosingTimer=null;
        if(pendingChoice){
          const following=pendingChoice;pendingChoice=null;
          beginSelection(following);
        }else if(moving)resumeMovement();
        else nextRound(restWait);
      },BLOOM_SHIFT_DURATION_MS);
    }else if(nextChoice){
      pendingChoice=null;
      beginSelection(nextChoice);
    }else if(wasActive){
      if(!moving)nextRound(restWait);
      else resumeMovement();
    }
  }

  /** Stage 2: shift the entire right-hand run by one real tile.
   * This is a vacant grid cell, not a floating modal over a neighbor.
   */
  function openSmallBloom(choice:ProjectChoice):void {
    const chosen=locate(choice);
    if(!chosen){stopSelection();return;}
    const project=demoProjects[chosen.projectIndex??-1];
    if(!project){stopSelection();return;}
    const selectedCell={column:chosen.column,row:chosen.row};
    bloomAnchor=selectedCell;
    const moduleCell=bloomModuleCell(selectedCell);
    surface.classList.remove('is-focusing');
    surface.classList.add('is-blooming','is-bloom-opening');
    highlightSelection();
    layer.getBoundingClientRect();
    for(const slot of slots){
      slot.element.classList.toggle('grid-tile--bloom-shifted',
        shiftsForBloom(slot,selectedCell));
    }
    const panel=document.createElement('section');
    panel.className='grid-bloom-module';
    panel.style.left=(moduleCell.column*tileSize)+'px';
    panel.style.top=(moduleCell.row*tileSize)+'px';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-label','Small bloom: '+project.name);
    const kicker=document.createElement('span');
    kicker.className='bloom-kicker';
    kicker.textContent='A CLOSER LOOK';
    const title=document.createElement('h2');
    title.className='bloom-title';title.textContent=project.name;
    const summary=document.createElement('p');
    summary.className='bloom-summary';summary.textContent=project.shortSummary;
    const close=document.createElement('button');
    close.className='bloom-close';close.type='button';
    close.textContent='Close';close.setAttribute('aria-label','Close '+project.name);
    close.addEventListener('click',event=>{
      event.stopPropagation();stopSelection();
      surface.focus({preventScroll:true});
    });
    panel.append(kicker,title,summary,close);
    layer.appendChild(panel);
    layer.getBoundingClientRect();
    bloomModule=panel;
    const metadata=document.createElement('section');
    metadata.className='grid-bloom-module';
    metadata.style.left=(selectedCell.column*tileSize)+'px';
    metadata.style.top=((selectedCell.row+1)*tileSize)+'px';
    metadata.setAttribute('aria-label','Project notes: '+project.name);
    const notesTitle=document.createElement('h2');
    notesTitle.className='bloom-title';notesTitle.textContent='Project notes';
    const notes=document.createElement('p');notes.className='bloom-summary';
    const topics=topicLabelsForProject(project.id);
    notes.textContent=TOPIC_POINTS.map(point=>topics[point]).join(' · ')+'. Source evidence: '+project.evidence+'. Provisional inventory candidate; details await review.';
    metadata.append(notesTitle,notes);layer.appendChild(metadata);metadataModule=metadata;
    paintMovement(moving?.fraction??0);
    bloomOpeningTimer=setTimeout(()=>{
      bloomOpeningTimer=null;
      surface.classList.remove('is-bloom-opening');
      panel.classList.add('is-open');
      metadata.classList.add('is-open');
      liveStatus.textContent=project.name+' opened beside its centered tile.';
      for(const slot of slots)slot.element.style.removeProperty('transition');
      // Re-enable the original dice-driven scheduler. Only lines that do not
      // cross the selected row/displaced corridor will be eligible.
      if(moving)resumeMovement();
      else nextRound(1500);
    },prefersReduced.matches?0:BLOOM_SHIFT_DURATION_MS);
  }

  /** Stage 1: move the grid to center the exact original project source.
   * If an unrelated active shift could disrupt the bloom corridor, withdraw
   * it smoothly during the camera move; safe shifts stay paused and resume.
   */
  function frameCenter(now:number):void {
    centerFrame=null;
    const state=centering;
    if(!state)return;
    if(state.started===null)state.started=now;
    const t=Math.min(1,Math.max(0,(now-state.started)/CENTER_DURATION_MS));
    const progress=prefersReduced.matches?1:t;
    const current=interpolateCenter({x:state.fromX,y:state.fromY},
      {x:state.toX,y:state.toY},progress);
    panX=current.x;panY=current.y;
    updateField();
    if(t<1&&!prefersReduced.matches){
      centerFrame=requestAnimationFrame(frameCenter);
    }else{
      centering=null;
      if(selectedChoice)openSmallBloom(selectedChoice);
    }
  }
  function beginSelection(choice:ProjectChoice):void {
    // A second click on the same project closes its existing bloom.
    if(selectedChoice&&sameChoice(selectedChoice,choice)){
      stopSelection();surface.focus({preventScroll:true});return;
    }
    // A new click during the closing animation changes the destination.
    if(bloomClosingTimer!==null){
      pendingChoice=choice;highlightSelection();
      return;
    }
    // A currently opened bloom first closes its displaced row; only after
    // that 520ms movement finishes may a different camera move begin.
    if(selectedChoice){
      stopSelection(true,choice);
      return;
    }
    const chosen=locate(choice);
    if(!chosen){
      pendingChoice=null;highlightSelection();
      liveStatus.textContent='That project has moved out of reach. Please select it again.';
      return;
    }
    cancelIntro();hideTopic();
    if(timer!==null){clearTimeout(timer);timer=null;}
    heldArrows.clear();manualPan=createManualPanState();

    const cell={column:chosen.column,row:chosen.row};
    const movementAction=moving?selectionShiftAction(moving.moves,cell):null;
    if(movementAction==='wait'){
      // Selection never retimes an active shift. Mark gold now, then
      // begin the opening procedure once this round has finished.
      pendingChoice=choice;highlightSelection();
      if(heading)heading.textContent='Waiting to open '+demoProjects[chosen.projectIndex??0].name;
      liveStatus.textContent='Project selected. Waiting for the current shift to finish at its normal pace.';
      resumeMovement();
      return;
    }
    // No active shift remains when the opening procedure begins.
    pendingChoice=null;
    selectedChoice=choice;
    const target=centeredPan(chosen,tileSize);
    centering={fromX:panX,fromY:panY,toX:target.x,toY:target.y,started:null};
    surface.classList.add('is-focusing');
    highlightSelection();
    if(heading)heading.textContent='Centering '+demoProjects[chosen.projectIndex??0].name;
    liveStatus.textContent='Centering selected project.';
    centerFrame=requestAnimationFrame(frameCenter);
  }

  /** Tiny ambient hints on a steady ~5-second clock. A blocked attempt
   * retries shortly rather than restarting the whole interval: a moving row
   * must not make the teasers disappear for 10+ seconds.
   */
  function scheduleAmbient(delay:number):void {
    if(ambientTimer!==null)clearTimeout(ambientTimer);
    ambientTimer=setTimeout(tryAmbient,Math.max(0,delay));
  }
  function tryAmbient():void {
    ambientTimer=null;
    if(mobileTopics.matches){scheduleAmbient(AMBIENT_INTERVAL_MS);return;}
    const focused=document.activeElement;
    const focusedProjectControl=focused instanceof Element
      &&focused.matches('.tile-select:focus-visible, .bloom-close:focus-visible');
    // Only visible keyboard focus blocks hints. Pointer/touch focus can
    // persist after a tap even when the visitor is just watching.
    // Focusing the viewport itself is also safe.
    // The ambient world stays alive around an open small bloom.
    // Only suppress during entrance/closing and active user input.
    const bloomTransitioning=(selectedChoice!==null&&!bloomModule)
      ||(bloomModule!==null&&!bloomModule.classList.contains('is-open'));
    const blocked=document.hidden||prefersReduced.matches
      ||pendingChoice!==null||centering!==null||bloomClosingTimer!==null
      ||bloomTransitioning||activePointer!==null||heldArrows.size>0
      ||panIsMoving(manualPan)||activeTopic!==null||introPending>0
      ||focusedProjectControl;
    const wait=ambientPollDelay(performance.now(),nextAmbientAt,blocked);
    if(wait>0){scheduleAmbient(wait);return;}

    const viewportRect=surface.getBoundingClientRect();
    const headerHeight=document.querySelector('.site-header')?.getBoundingClientRect().height??52;
    const footerHeight=document.querySelector('.help-panel')?.getBoundingClientRect().height??48;
    const insets=ambientInsets(tileSize,headerHeight,footerHeight);
    // getBoundingClientRect reflects the actual viewport and CSS transforms,
    // unlike resting row/column indices or a simple aria-hidden check.
    const chosenSlot=bloomModule?bloomAnchor:null;
    const eligible=slots.filter(slot=>
      slot.projectIndex!==undefined
      &&slot.element.getAttribute('aria-hidden')==='false'
      // Avoid the centered tile, its bloom row, and actively moving tiles.
      &&(!chosenSlot||slot.row!==chosenSlot.row)
      &&!slot.element.classList.contains('grid-tile--selected')
      &&!(moving?.moves.some(move=>
        move.axis==='row'?move.line===slot.row:move.line===slot.column))
      &&ambientTileIsEligible(slot.element.getBoundingClientRect(),viewportRect,insets));
    if(!eligible.length){
      scheduleAmbient(AMBIENT_RETRY_MS);
      return;
    }
    const fresh=eligible.filter(slot=>slot.element.dataset.projectId!==lastAmbientProjectId);
    const candidates=fresh.length?fresh:eligible;
    const chosen=candidates[Math.floor(Math.random()*candidates.length)];
    const tile=chosen.element;
    const point=chooseAmbientPoint(lastAmbientPoint,Math.random());
    showTopic(tile,point);
    teaserTile=tile;
    lastAmbientProjectId=tile.dataset.projectId??null;
    lastAmbientPoint=point;
    teaserTimer=setTimeout(()=>{
      teaserTimer=null;
      if(activeTopic===tile)hideTopic();
    },AMBIENT_VISIBLE_MS);
    nextAmbientAt=performance.now()+AMBIENT_INTERVAL_MS;
    scheduleAmbient(AMBIENT_INTERVAL_MS);
  }

  function resetManualInput():void {
    heldArrows.clear();
    manualPan=createManualPanState();
    previousManualTime=null;
    resumeMovement();
  }

  surface.addEventListener('pointerover',event=>{
    if(mobileTopics.matches||event.pointerType==='touch'||activePointer!==null)return;
    const select=selectFrom(event.target);
    const tile=select?.closest<HTMLDivElement>('.grid-tile');
    if(!tile||(event.relatedTarget instanceof Node&&tile.contains(event.relatedTarget)))return;
    if(teaserTile===tile&&teaserTimer!==null){clearTimeout(teaserTimer);teaserTimer=null;teaserTile=null;}
    showTopic(tile);
  });
  surface.addEventListener('pointerout',event=>{
    if(mobileTopics.matches||event.pointerType==='touch')return;
    const select=selectFrom(event.target);
    const tile=select?.closest<HTMLDivElement>('.grid-tile');
    if(!tile||(event.relatedTarget instanceof Node&&tile.contains(event.relatedTarget)))return;
    if(!select?.matches(':focus-visible')&&activeTopic===tile)hideTopic();
  });
  surface.addEventListener('focusin',event=>{
    if(mobileTopics.matches)return;
    const tile=selectFrom(event.target)?.closest<HTMLDivElement>('.grid-tile');
    if(tile){
      if(teaserTile===tile&&teaserTimer!==null){clearTimeout(teaserTimer);teaserTimer=null;teaserTile=null;}
      showTopic(tile);
    }
  });
  surface.addEventListener('focusout',event=>{
    if(mobileTopics.matches)return;
    const tile=selectFrom(event.target)?.closest<HTMLDivElement>('.grid-tile');
    if(tile&&activeTopic===tile)hideTopic();
  });
  // One tile button for native keyboard activation and pointer selection.
  // Pointer taps are resolved after capture so dragging never activates it.
  surface.addEventListener('click',event=>{
    if(event.detail!==0)return;
    const tile=selectFrom(event.target)?.closest<HTMLDivElement>('.grid-tile');
    if(tile){
      const choice=choiceFor(tile);
      if(choice)beginSelection(choice);
    }
  });
  surface.addEventListener('pointerdown',event=>{
    if(activePointer!==null||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
    if(event.target instanceof Element&&event.target.closest('.grid-bloom-module'))return;
    cancelIntro();
    pointerDownSelect=selectFrom(event.target);
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
      if(!bloomModule&&!closeAfterShift&&(selectedChoice||pendingChoice||centering))stopSelection();
      if(!mobileTopics.matches)hideTopic();
    }
    if(pointerDragged||(!selectedChoice&&!centering))
      manualPan=queuePointerTravel(manualPan,event.clientX-lastX,event.clientY-lastY);
    lastX=event.clientX;lastY=event.clientY;
    scheduleManualFrame();
  });
  function release(event:PointerEvent):void {
    if(event.pointerId!==activePointer)return;
    const isTap=event.type==='pointerup'&&!pointerDragged
      &&Math.hypot(event.clientX-pointerDownX,event.clientY-pointerDownY)<=9;
    activePointer=null;surface.classList.remove('is-dragging');
    let chosen:ProjectChoice|null=null;
    if(isTap){
      // Pointer capture retargets pointerup to the viewport. Hit-test the
      // actual release position and require the same tile button at both ends.
      const hit=document.elementFromPoint(event.clientX,event.clientY);
      const select=selectFrom(hit);
      const selectedTile=select?.closest<HTMLDivElement>('.grid-tile');
      if(selectedTile&&select===pointerDownSelect&&surface.contains(selectedTile)){
        chosen=choiceFor(selectedTile);
        hideTopic();
      }else hideTopic();
    }
    pointerDownSelect=null;
    if(event.type==='pointercancel')hideTopic();
    // Discard remaining cursor lag on release: no delayed ghost-chase.
    manualPan.pending={x:0,y:0};
    manualPan.pointerVelocity={x:0,y:0};
    if(surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
    if(chosen){
      beginSelection(chosen);
      // Every active shift finishes at its original tempo before opening.
      if(pendingChoice&&!selectedChoice&&bloomClosingTimer===null)resumeMovement();
    }else resumeMovement();
    refreshMobileTopics();
  }
  surface.addEventListener('pointerup',release);
  surface.addEventListener('pointercancel',release);
  surface.addEventListener('lostpointercapture',release);
  const arrowNames=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
  surface.addEventListener('keydown',event=>{
    if(event.key==='Home'){
      stopSelection(false);
      hideTopic();
      cancelIntro();
      event.preventDefault();
      resetManualInput();
      panX=0;panY=0;updateField();
      return;
    }
    if(!arrowNames.has(event.key))return;
    if(!bloomModule&&(selectedChoice||pendingChoice||centering))stopSelection();
    if(!mobileTopics.matches)hideTopic();
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
  window.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&(selectedChoice||pendingChoice)){
      event.preventDefault();
      stopSelection();
      surface.focus({preventScroll:true});
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
  window.addEventListener('focus',refreshMobileTopics);
  reset.addEventListener('click',()=>{
    stopSelection(false);
    hideTopic();
    cancelIntro();
    resetManualInput();
    panX=0;panY=0;updateField();
    liveStatus.textContent='Returned to the starting tile.';
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){hideTopic();pauseMovement();}
    else{resumeMovement();refreshMobileTopics();}
  });
  mobileTopics.addEventListener('change',()=>{hideTopic();refreshMobileTopics();});
  prefersReduced.addEventListener('change',()=>{
    if(prefersReduced.matches){cancelIntro();hideTopic();refreshMobileTopics();}
    else nextRound(firstWait);
  });
  nextRound(firstWait);
  scheduleAmbient(AMBIENT_INTERVAL_MS);
  new ResizeObserver(rebuildPool).observe(surface);
  rebuildPool();
}
