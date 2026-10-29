import {installSpatialKeyboard,type KeyboardItem} from './spatial-keyboard';
import {stepShiftPlayback,type ShiftPlayback} from '../lib/shift-playback';
import {createSourceLookup,compileVacancies} from '../lib/grid-render-cache';
import {installGridProfile} from './grid-profile';
import aboutText from '../content/about.md?raw';
import {installSiteNavigation} from './site-navigation';
import {installInteractionFeedback} from './interaction-feedback';
import {projectModuleLoader} from '../lib/project-module-loader';
import {selectModules,MODULE_OFFSETS,moduleRevealPlan} from '../lib/project-modules';
import {renderModulePreview} from './module-preview';
import {createModuleDetails} from './module-detail';
import {bigBloomLayout,bigBloomVacancies,bigModuleCell,bigBloomRevealPlan} from '../lib/big-bloom';
import {restingCell,moduleVacancies,tileAtCenter} from '../lib/bloom-geometry';
import { gridWindow, logicalCell, positiveModulo, tileSizeForWidth, resizedPan } from '../lib/grid-math';
import { easeInOut, SHIFT_DURATION_MS, planShiftRound, sourceCell, type ShiftEvent } from '../lib/grid-shifts';
import {settledResidents} from '../lib/shift-settlement';
import { createManualPanState, panIsMoving, queuePointerTravel, stepManualPan } from '../lib/grid-controls';
import { ProjectPlacement, spiralIndex, visibleCellBounds, type CellCoordinate } from '../lib/project-placement';
import {gridProjects as demoProjects} from '../lib/grid-projects';
import { topicLabelsForProject, TOPIC_POINTS, chooseAmbientPoint, topicRevealPlan, type TopicPoint } from '../lib/project-topics';
import { introSequence, INTRO_SPAWN_STAGGER_MS, INTRO_SPAWN_DURATION_MS } from '../lib/grid-intro';
import { centeredPan, interpolateCenter,
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
  installInteractionFeedback();
  const bufferCells=2;
  let columnBufferCells=2;
  // Activity order is fixed for this loaded bundle; semantic IDs survive slot recycling.
  const placement=new ProjectPlacement(demoProjects.length,3);
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
  let bigBloomOpen=false,bigTransitioning=false,detailOpen=false;
  let bigLayout:ReturnType<typeof bigBloomLayout>=[];
  let smallBloom:{panels:HTMLElement[];cells:ReturnType<typeof moduleVacancies>}|null=null;
  let centerCompletion:(()=>void)|null=null;
  let pendingBigBloom:(()=>void)|null=null;
  let pendingDepthControl:HTMLElement|null=null;
  let bloomModule:HTMLElement|null=null;
  let bloomAnchor:CellCoordinate|null=null;
  let bloomModules:HTMLElement[]=[];
  let bloomCells:ReturnType<typeof moduleVacancies>=[];
  let bloomRevealTimers:ReturnType<typeof setTimeout>[]=[];
  let bloomOpeningTimer:ReturnType<typeof setTimeout>|null=null;
  let bloomClosingTimer:ReturnType<typeof setTimeout>|null=null;
  let teaserTile:HTMLDivElement|null=null;
  let teaserTimer:ReturnType<typeof setTimeout>|null=null;
  let ambientTimer:ReturnType<typeof setTimeout>|null=null;
  let nextAmbientAt=performance.now()+AMBIENT_INTERVAL_MS;
  let lastAmbientProjectId:string|null=null;
  let lastAmbientPoint:TopicPoint|null=null;
  let pointerDownSelect:HTMLButtonElement|null=null;
  let pointerDownPanel:HTMLElement|null=null;
  let activeTopic:HTMLDivElement|null=null;
  let manualPan=createManualPanState();
  let manualFrame:number|null=null;
  let previousManualTime:number|null=null;
  // Experimental movement values, not yet confirmed by the creator.
  const firstWait=6500, restWait=8000;
  const history:ShiftEvent[]=[];
  const sourceAtCell=createSourceLookup(history);
  let vacancyKey:readonly {column:number;row:number;originColumn?:number}[]|null=null;
  const noVacancies:never[]=[];
  let vacancyPosition=compileVacancies(noVacancies);
  function visualCell(cell:{column:number;row:number}){
    const vacancies=bloomModule?bloomCells:noVacancies;
    if(vacancyKey!==vacancies){vacancyKey=vacancies;vacancyPosition=compileVacancies(vacancies);}
    return vacancyPosition(cell);
  }
  interface Moving {moves:ShiftEvent[]; pausedAt:number|null; fraction:number; playback:ShiftPlayback; lastFrame:number}
  let moving:Moving|null=null;
  let closeAfterShift:{next:ProjectChoice|null}|null=null;
  installGridProfile(import.meta.env.DEV&&new URLSearchParams(location.search).has('grid-profile'),()=>detailOpen?'reader':centering?'centering':activePointer!==null?'pointer':moving?'shift':bigBloomOpen?'big-bloom':bloomModule?'small-bloom':'idle',()=>({rate:moving?.playback.rate??1,fraction:moving?.fraction??0,paused:moving?.pausedAt!==null&&!!moving}));
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobileTopics=matchMedia('(hover: none) and (pointer: coarse)');
  const heading=document.querySelector<HTMLElement>('.header-note');
  let timer:ReturnType<typeof setTimeout>|null=null;
  function projectName(){return demoProjects.find(project=>project.id===selectedChoice?.projectId)?.name??'project';}
  function explorationStatus(){return selectedChoice?`Exploring ${projectName()} · ${bigBloomOpen?'big':'small'} bloom`:'Living grid';}
  let readerActivity:string|null=null;
  function activity(message:string){if(heading)heading.textContent=readerActivity??message;}
  const details=createModuleDetails((open,title)=>{
    detailOpen=open;
    readerActivity=open?(title==='About BABUNI.DEV'?'About BABUNI.DEV':`Reading ${projectName()} · ${title}`):null;
    activity(explorationStatus());
    if(open){pauseBloomMedia();manualPan=createManualPanState();pauseMovement();}
    else{surface.scrollTop=0;surface.scrollLeft=0;resumeMovement();if(!moving)nextRound(restWait);}
  });

  let directNavigationTimer:ReturnType<typeof setTimeout>|null=null;
  installSiteNavigation(id=>{
    details.close();
    if(directNavigationTimer!==null)clearTimeout(directNavigationTimer);
    const index=demoProjects.findIndex(project=>project.id===id);
    if(index<0)return;
    const navigate=()=>{
      directNavigationTimer=null;
      if(details.isOpen()||moving||bigTransitioning||bloomClosingTimer!==null||centering){
        activity(`${moving?'Waiting for shift to finish':'Switching projects'} · ${demoProjects[index].name}`);
        directNavigationTimer=setTimeout(navigate,100);return;
      }
      if(selectedChoice||bloomModule){stopSelection();directNavigationTimer=setTimeout(navigate,100);return;}
      let slot=slots.find(slot=>slot.projectIndex===index);
      if(!slot){
        slot=slots.find(slot=>slot.element.getAttribute('aria-hidden')==='true');
        if(!slot){liveStatus.textContent='Project navigation unavailable. Please try again.';return;}
      }
      // Buffered render slots can still carry an identity from a former
      // viewport. Pin the requested source before the camera recycles them.
      placement.assign(sourceAtCell(slot.column,slot.row),index);
      populate(slot,slot.column,slot.row);
      beginSelection({source:sourceAtCell(slot.column,slot.row),projectId:id});
    };
    navigate();
  },trigger=>{
    if(directNavigationTimer!==null){clearTimeout(directNavigationTimer);directNavigationTimer=null;}
    details.open({id:'about',type:'text',title:'About BABUNI.DEV',preview:'',
      body:aboutText,
      source:'https://github.com/babunidev/babuni.dev/blob/main/src/content/about.md'},trigger);
  });

  function keyboardItems():KeyboardItem[]{
    const tiles=slots.filter(slot=>slot.projectIndex!==undefined&&slot.projectIndex<demoProjects.length).map(slot=>{
      const cell=paintedCell(slot);
      return {element:slot.element.querySelector<HTMLButtonElement>('.tile-select')!,container:slot.element,x:cell.column+.5,y:cell.row+.5};
    });
    const modules=bloomModules.filter(panel=>panel.classList.contains('is-open')).map(panel=>({
      element:panel.querySelector<HTMLButtonElement>('.bloom-read-more')!,container:panel,
      x:parseFloat(panel.style.left)/tileSize+(bigBloomOpen?1:.5),
      y:parseFloat(panel.style.top)/tileSize+(bigBloomOpen?1:.5)
    }));
    return [...tiles,...modules];
  }
  const keyboard=installSpatialKeyboard(surface,{
    items:keyboardItems,
    entry:()=>{
      const items=keyboardItems();
      const center={x:.5-panX/tileSize,y:.5-panY/tileSize};
      return items.filter(item=>item.container.getAttribute('aria-hidden')!=='true')
        .sort((a,b)=>(a.x-center.x)**2+(a.y-center.y)**2-((b.x-center.x)**2+(b.y-center.y)**2))[0];
    },
    blocked:()=>!!centering||bigTransitioning||bloomClosingTimer!==null||bloomOpeningTimer!==null,
    reveal:item=>{
      const box=item.element.getBoundingClientRect(),bounds=surface.getBoundingClientRect();
      const top=bounds.top+(document.querySelector('.site-header')?.getBoundingClientRect().height??52)+8;
      let dx=box.left<bounds.left+8?bounds.left+8-box.left:box.right>bounds.right-8?bounds.right-8-box.right:0;
      let dy=box.top<top?top-box.top:box.bottom>bounds.bottom-8?bounds.bottom-8-box.bottom:0;
      if(dx||dy){panX+=dx;panY+=dy;updateField();}
      surface.scrollLeft=0;surface.scrollTop=0;
    }
  });

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
    if(tile.classList.contains('grid-tile--placeholder')){hideTopic();return;}
    if(tile.getAttribute('aria-hidden')==='true')return;
    // Suppress only the open bloom's physical anchor, not other copies
    // of that project or the queued destination of a selection switch.
    const slot=slots.find(slot=>slot.element===tile);
    if(bloomModule&&bloomAnchor&&slot
       &&slot.column===bloomAnchor.column&&slot.row===bloomAnchor.row){
      hideTopic();
      return;
    }
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
    if(!slot||slot.projectIndex===undefined||!demoProjects[slot.projectIndex])return null;
    // A shifting tile can already be visibly entering from the buffer while
    // its resting-position aria-hidden flag still says it is offscreen.
    const box=tile.getBoundingClientRect(),view=surface.getBoundingClientRect();
    if(box.right<=view.left||box.left>=view.right
      ||box.bottom<=view.top||box.top>=view.bottom)return null;
    return {
      source:sourceAtCell(slot.column,slot.row),
      projectId:demoProjects[slot.projectIndex].id
    };
  }
  function locate(choice:ProjectChoice):TileSlot|undefined {
    return slots.find(slot=>{
      const source=sourceAtCell(slot.column,slot.row);
      return source.column===choice.source.column&&source.row===choice.source.row
        &&demoProjects[slot.projectIndex??-1]?.id===choice.projectId;
    });
  }
  function highlightSelection():void {
    for(const slot of slots){
      const anchor=bigBloomOpen&&!!bloomAnchor&&slot.column===bloomAnchor.column&&slot.row===bloomAnchor.row;
      slot.element.classList.toggle('grid-tile--big-anchor',anchor);
      const button=slot.element.querySelector<HTMLButtonElement>('.tile-select');
      if(button){const label=button.dataset.exploreLabel;if(anchor)button.setAttribute('aria-label','Back to small bloom');else if(label)button.setAttribute('aria-label',label);}
    }
    const choice=pendingChoice??selectedChoice;
    const waiting=(!!moving&&(pendingChoice!==null||closeAfterShift!==null||pendingBigBloom!==null))
      ||surface.classList.contains('is-content-loading')||centering!==null||bigTransitioning||bloomClosingTimer!==null||surface.classList.contains('is-bloom-opening')||surface.classList.contains('is-bloom-closing');
    for(const slot of slots){
      const source=sourceAtCell(slot.column,slot.row);
      const selected=!!choice&&source.column===choice.source.column
        &&source.row===choice.source.row
        &&demoProjects[slot.projectIndex??-1]?.id===choice.projectId;
      slot.element.classList.toggle('grid-tile--selected',selected);
      slot.element.classList.toggle('grid-tile--waiting',selected&&waiting);
      const button=slot.element.querySelector('.tile-select');
      const busy=String(selected&&waiting);if(button&&button.getAttribute('aria-busy')!==busy)button.setAttribute('aria-busy',busy);
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
    const source=sourceAtCell(column,row);
    // Unreserved outer buffer cells receive a temporary visual ID until they
    // approach the retention band; this never consumes a visible project.
    const projectIndex=placement.get(source)??spiralIndex(source.column,source.row)%placement.capacity;
    if(!force&&slot.projectIndex===projectIndex)return;
    if(activeTopic===slot.element)hideTopic();
    slot.projectIndex=projectIndex;
    const project=demoProjects[projectIndex];
    const isOrigin=project?.id==='babuni-dev';
    slot.element.classList.toggle('grid-tile--placeholder',!project);
    const control=slot.element.querySelector<HTMLButtonElement>('.tile-select');
    if(control)control.disabled=!project;
    if(!project){
      slot.element.dataset.neutralVariant=String(projectIndex-demoProjects.length);
      delete slot.element.dataset.projectId;delete slot.element.dataset.projectSummary;
      slot.element.classList.remove('grid-tile--origin','grid-tile--long-title','grid-tile--topic-open');
      slot.element.querySelector('.tile-portal')?.replaceChildren();
      const name=slot.element.querySelector('.tile-name');if(name)name.textContent='';
      control?.removeAttribute('aria-label');
      return;
    }
    delete slot.element.dataset.neutralVariant;
    slot.element.dataset.projectId=project.id;
    slot.element.dataset.projectSummary=project.shortSummary;
    slot.element.style.setProperty('--portal-color',project.tint);
    const titleScale=project.name.length<=12?.105:project.name.length<=18?.09:.075;
    slot.element.style.setProperty('--project-title-scale',String(titleScale));
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
      const hasArtwork=Boolean(project.portalArtwork);
      portal.classList.toggle('tile-portal--artwork',hasArtwork);
      if(hasArtwork){
        const image=document.createElement('img');
        image.className='tile-portal-image';image.alt='';
        image.loading='lazy';image.decoding='async';image.draggable=false;
        image.width=512;image.height=512;
        image.src=project.portalArtwork!;
        portal.appendChild(image);
      }
    }
    const select=slot.element.querySelector<HTMLButtonElement>('.tile-select');
    if(select){select.dataset.exploreLabel='Explore '+project.name+': '+TOPIC_POINTS.map(point=>topics[point]).join(', ');select.setAttribute('aria-label',select.dataset.exploreLabel);}
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
    const ordered=introSequence(visible,slot=>sourceAtCell(slot.column,slot.row));
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
  function rebuildPool(preserveBloom=false,force=false):void {
    preserveBloom=preserveBloom||bigBloomOpen||!!selectedChoice||!!pendingChoice;
    const rect=surface.getBoundingClientRect();
    if(!rect.width||!rect.height) return;
    // ResizeObserver repeats the initial size; never rebuild/replay for that.
    if(!force&&rect.width===viewportWidth&&rect.height===viewportHeight&&slots.length)return;
    cancelIntro();
    if(!preserveBloom)stopSelection(false);
    hideTopic();
    viewportWidth=rect.width;viewportHeight=rect.height;
    const newSize=tileSizeForWidth(rect.width);
    if(newSize!==tileSize){
      const pan=resizedPan({x:panX,y:panY},tileSize,newSize);panX=pan.x;panY=pan.y;
      if(centering){
        const from=resizedPan({x:centering.fromX,y:centering.fromY},tileSize,newSize);
        const to=resizedPan({x:centering.toX,y:centering.toY},tileSize,newSize);
        centering={...centering,fromX:from.x,fromY:from.y,toX:to.x,toY:to.y};
      }
    }
    tileSize=newSize;
    surface.style.setProperty('--tile-size',tileSize+'px');
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells,columnBufferCells});
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
    layer.replaceChildren(fragment,...bloomModules);
    positionBloomPanels();
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
      const visual=visualCell(slot);
      const x=frame.originX+visual.column*tileSize;
      const y=frame.originY+visual.row*tileSize;
      const source=sourceAtCell(slot.column,slot.row);
      const isVisible=x<rect.width&&x+tileSize>0&&y<rect.height&&y+tileSize>0;
      if(isVisible)visible.push(source);
      // Accessible only while the actual tile is inside the viewport.
      slot.element.setAttribute('aria-hidden',String(!isVisible));
      const select=slot.element.querySelector<HTMLButtonElement>('.tile-select');
      if(select){
        select.tabIndex=-1;
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
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells,columnBufferCells});
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
    for(const slot of slots){
      const visual=visualCell(slot);
      if(bloomModule)slot.element.classList.toggle('grid-tile--bloom-shifted',visual.column!==slot.column);
      const position=paintedCell(slot,fraction);
      const dx=(position.column-slot.column)*tileSize;
      const dy=(position.row-slot.row)*tileSize;
      const transform=(dx||dy)?'translate3d('+dx+'px,'+dy+'px,0)':'';
      if(slot.element.style.transform!==transform)slot.element.style.transform=transform;
    }
    refreshMobileTopics();
  }
  function paintedCell(slot:TileSlot,fraction=moving?.fraction??0):CellCoordinate {
    const visual=visualCell(slot);
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
    if(centering||bigTransitioning||detailOpen||pendingChoice||pendingBigBloom||bloomClosingTimer!==null){
      nextRound(1000);
      return;
    }
    if(activePointer!==null||panIsMoving(manualPan)||document.hidden||prefersReduced.matches||moving){
      nextRound(1000);
      return;
    }
    const rect=surface.getBoundingClientRect();
    const frame=gridWindow({width:rect.width,height:rect.height,tileSize,panX,panY,bufferCells,columnBufferCells});
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
      visibleRows=visibleRows.filter(line=>shiftAvoidsBloom({axis:'row',line,direction:1},cell,bloomCells));
      visibleColumns=visibleColumns.filter(line=>shiftAvoidsBloom({axis:'column',line,direction:1},cell,bloomCells));
    }else if(selectedChoice){nextRound(1000);return;}
    const round=planShiftRound(visibleRows,visibleColumns);
    if(!round.moves.length){nextRound(restWait);return;}
    cancelIntro();
    // All incoming tiles already exist just outside the viewport. Give them
    // their final project identity NOW, before their shift reveals them.
    // Otherwise the completed sync could visibly replace their name and tint.
    const vacancies=bloomModule?bloomCells:[];
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
    const now=performance.now();
    moving={moves:round.moves,pausedAt:null,fraction:0,playback:{elapsed:0,rate:1},lastFrame:now};
    surface.classList.add('is-autoshifting');
    if(!detailOpen)activity(`${round.axis==='row'?'Rows':'Columns'} are shifting${selectedChoice?' · '+explorationStatus():''}`);
    requestAnimationFrame(frameMovement);
  }
  /** Transfer the already-rendered, already-decoded tile *element* to the
   * cell its movement landed on, instead of rebuilding its portal image.
   * Keep projectIndex paired with that element until syncProjects reconciles
   * only the (offscreen) wrapped pool edges.
   */
  function settleMovedResidents(moves:readonly ShiftEvent[]):void {
    const mappings=settledResidents(slots,moves,bloomModule?bloomCells:[]);
    const old=new Map(slots.map(slot=>[slot,{
      element:slot.element,projectIndex:slot.projectIndex
    }]));
    for(const {destination,source} of mappings){
      const resident=old.get(source)!;
      destination.element=resident.element;
      destination.projectIndex=resident.projectIndex;
    }
    for(const {destination} of mappings){
      destination.element.style.left=(destination.column*tileSize)+'px';
      destination.element.style.top=(destination.row*tileSize)+'px';
      destination.element.style.transform='';
    }
  }
  function frameMovement(now:number):void {
    if(!moving||moving.pausedAt!==null)return;
    const dragging=(activePointer!==null&&pointerDragged)||panIsMoving(manualPan);
    moving.playback=stepShiftPlayback(moving.playback,now-moving.lastFrame,dragging);
    moving.lastFrame=now;
    moving.fraction=Math.min(1,moving.playback.elapsed/SHIFT_DURATION_MS);
    paintMovement(moving.fraction);
    if(moving.fraction<1){
      if(dragging&&moving.playback.rate===0){moving.pausedAt=now;surface.classList.remove('is-autoshifting');}
      else requestAnimationFrame(frameMovement);
      return;
    }
    // Move the actual resident DOM elements into their landed cells before
    // committing history. Otherwise a normal placement sync recreates their
    // <img> logos just after the tiles visually arrive.
    settleMovedResidents(moving.moves);
    history.push(...moving.moves);
    moving=null;
    updateField(true);
    placement.finishEntrances();
    paintMovement(0);
    surface.classList.remove('is-autoshifting');
    if(pendingBigBloom){const open=pendingBigBloom;pendingBigBloom=null;open();return;}
    if(!detailOpen)activity(explorationStatus());
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
    if(detailOpen||!moving||moving.pausedAt===null||activePointer!==null||panIsMoving(manualPan)||document.hidden)return;
    moving.pausedAt=null;
    moving.lastFrame=performance.now();
    surface.classList.add('is-autoshifting');
    requestAnimationFrame(frameMovement);
  }
  function scheduleManualFrame():void {
    if(manualFrame===null) manualFrame=requestAnimationFrame(animateManual);
  }
  function animateManual(now:number):void {
    manualFrame=null;
    const elapsed=previousManualTime===null?1/60:(now-previousManualTime)/1000;
    previousManualTime=now;
    const step=stepManualPan(manualPan,elapsed,activePointer!==null,{x:0,y:0});
    manualPan=step.state;
    if(step.delta.x!==0||step.delta.y!==0){
      panX+=step.delta.x;panY+=step.delta.y;
      updateField();
    }
    if(activePointer!==null||panIsMoving(manualPan)){
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
    pendingBigBloom=null;clearDepthFeedback();surface.classList.remove('is-big-bloom-waiting');
    const wasActive=!!selectedChoice||!!centering||!!bloomModule||!!pendingChoice;
    const hadBloom=!!bloomModule;
    const closingName=projectName();
    const keyboardAnchor=selectedChoice?locate(selectedChoice)?.element.querySelector<HTMLButtonElement>('.tile-select')??null:null;
    if(hadBloom&&moving&&animateReturn){
      // Keep the current clock and easing curve. Selection/collapse waits
      // for this event to finish at its established tempo.
      closeAfterShift={next:nextChoice};
      pendingChoice=nextChoice;
      highlightSelection();
      activity(`Waiting for shift to finish · ${closingName}`);
      if(nextChoice)liveStatus.textContent='Project selected. Waiting for the current shift to finish at its normal pace.';
      resumeMovement();
      return;
    }
    closeAfterShift=null;
    details.close();pauseBloomMedia();
    smallBloom?.panels.forEach(panel=>panel.remove());smallBloom=null;bigLayout=[];
    bigBloomOpen=false;bigTransitioning=false;centerCompletion=null;
    surface.classList.remove('is-big-bloom');
    pendingChoice=nextChoice;
    centering=null;
    if(centerFrame!==null){cancelAnimationFrame(centerFrame);centerFrame=null;}
    if(bloomOpeningTimer!==null){clearTimeout(bloomOpeningTimer);bloomOpeningTimer=null;}
    if(bloomClosingTimer!==null){clearTimeout(bloomClosingTimer);bloomClosingTimer=null;}
    for(const timer of bloomRevealTimers)clearTimeout(timer);
    bloomRevealTimers=[];
    for(const panel of bloomModules)panel.remove();
    bloomModules=[];bloomModule=null;bloomAnchor=null;bloomCells=[];
    surface.classList.remove('is-focusing','is-blooming','is-bloom-opening','is-bloom-closing','is-content-loading');
    for(const slot of slots)slot.element.classList.remove('grid-tile--bloom-returning');
    if(hadBloom&&animateReturn&&!prefersReduced.matches)
      surface.classList.add('is-bloom-closing');
    for(const slot of slots){
      const element=slot.element;
      element.classList.toggle('grid-tile--bloom-returning',
        hadBloom&&animateReturn&&!prefersReduced.matches
          &&element.classList.contains('grid-tile--bloom-shifted'));
      element.classList.remove('grid-tile--bloom-shifted','grid-tile--selected','grid-tile--big-anchor','grid-tile--depth-transition');
      element.style.removeProperty('transition');
    }
    selectedChoice=null;
    // Keep independent paused motion while displaced runs return home.
    paintMovement(moving?.fraction??0);
    highlightSelection();
    activity(hadBloom&&animateReturn?`Closing ${closingName} bloom`:'Living grid');
    if(hadBloom&&animateReturn&&!prefersReduced.matches){
      bloomClosingTimer=setTimeout(()=>{
        surface.classList.remove('is-bloom-closing');
        for(const slot of slots){
          slot.element.classList.remove('grid-tile--bloom-returning');
          slot.element.style.removeProperty('transition');
        }
        bloomClosingTimer=null;
        activity(explorationStatus());
        if(keyboard.active()&&!pendingChoice){if(keyboardAnchor?.isConnected)keyboard.focusElement(keyboardAnchor);else keyboard.focusEntry();}
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

  /** Reserve real cells without moving the project anchor; preview selection
   * and reveal order are sampled once for this opening. */
  function openSmallBloom(choice:ProjectChoice):void {
    const chosen=locate(choice);
    if(!chosen){stopSelection();return;}
    const project=demoProjects[chosen.projectIndex??-1];
    if(!project){stopSelection();return;}
    const selectedCell={column:chosen.column,row:chosen.row};
    const available=projectModuleLoader.get(project.id);
    if(!available){
      surface.classList.add('is-content-loading');highlightSelection();
      activity(`Loading ${project.name} · small bloom`);
      projectModuleLoader.load(project.id).then(()=>{
        if(selectedChoice&&sameChoice(selectedChoice,choice)&&!bloomModule)openSmallBloom(choice);
      }).catch(()=>{
        if(!selectedChoice||!sameChoice(selectedChoice,choice))return;
        stopSelection(false);activity('Project content could not load · select it to retry');
        liveStatus.textContent='Project content could not load. Please select the project to retry.';
      });
      return;
    }
    surface.classList.remove('is-content-loading');
    const modules=selectModules(available);
    bloomAnchor=selectedCell;
    bloomCells=moduleVacancies(selectedCell,MODULE_OFFSETS.slice(0,modules.length));
    surface.classList.remove('is-focusing');
    surface.classList.add('is-blooming','is-bloom-opening');
    highlightSelection();
    layer.getBoundingClientRect();
    bloomModules=modules.map((module,index)=>{
      const panel=renderModulePreview(module,project.name,()=>requestBigBloom(module.id));
      panel.style.left=(bloomCells[index].column*tileSize)+'px';
      panel.style.top=(bloomCells[index].row*tileSize)+'px';
      layer.appendChild(panel);return panel;
    });
    bloomModule=bloomModules[0]??null;
    if(activeTopic===chosen.element)hideTopic();
    activity(`Opening ${project.name} · small bloom`);
    paintMovement(0);
    // Reserve the entire footprint first; reveal previews only after the
    // displacement settles. Pending timers belong to this bloom instance.
    const plan=moduleRevealPlan(bloomModules);
    bloomOpeningTimer=setTimeout(()=>{
      bloomOpeningTimer=null;
      surface.classList.remove('is-bloom-opening');highlightSelection();
      for(const reveal of plan){
        if(prefersReduced.matches||reveal.delay===0)reveal.item.classList.add('is-open');
        else bloomRevealTimers.push(setTimeout(()=>reveal.item.classList.add('is-open'),reveal.delay));
      }
      if(keyboard.active())keyboard.focusElement(chosen.element.querySelector<HTMLButtonElement>('.tile-select'));
      activity(`Exploring ${project.name} · small bloom`);
      liveStatus.textContent=project.name+': '+modules.length+' preview modules opened.';
      for(const slot of slots)slot.element.style.removeProperty('transition');
      if(moving)resumeMovement();else nextRound(1500);
    },prefersReduced.matches?0:BLOOM_SHIFT_DURATION_MS);
  }

  function positionBloomPanels():void {
    bloomModules.forEach((panel,index)=>{
      const cell=bigBloomOpen&&bloomAnchor?bigModuleCell(bloomAnchor,bigLayout[index]):bloomCells[index];
      if(!cell)return;
      panel.style.left=cell.column*tileSize+'px';panel.style.top=cell.row*tileSize+'px';
      if(bigBloomOpen){panel.style.width=2*tileSize+'px';panel.style.height=2*tileSize+'px';}
    });
    if(smallBloom)smallBloom.panels.forEach((panel,index)=>{
      panel.style.left=smallBloom!.cells[index].column*tileSize+'px';
      panel.style.top=smallBloom!.cells[index].row*tileSize+'px';
    });
  }
  function clearBloomTimers():void {
    if(bloomOpeningTimer!==null){clearTimeout(bloomOpeningTimer);bloomOpeningTimer=null;}
    bloomRevealTimers.forEach(clearTimeout);bloomRevealTimers=[];
  }
  function pauseBloomMedia():void {
    for(const panel of bloomModules)panel.querySelectorAll('video').forEach(video=>video.pause());
  }
  function depthTransition(target:{x:number;y:number},settled:()=>void):void {
    bigTransitioning=true;manualPan=createManualPanState();hideTopic();
    if(timer!==null){clearTimeout(timer);timer=null;}
    surface.classList.add('is-bloom-opening');
    for(const slot of slots)slot.element.classList.add('grid-tile--depth-transition');
    // Existing rows interpolate only horizontally; the shared camera owns
    // the whole-field travel. Space settles before panels become visible.
    paintMovement(0);updateField(true);
    centering={fromX:panX,fromY:panY,toX:target.x,toY:target.y,started:null};
    centerCompletion=()=>{};
    if(centerFrame!==null)cancelAnimationFrame(centerFrame);
    centerFrame=requestAnimationFrame(frameCenter);
    bloomOpeningTimer=setTimeout(()=>{
      bloomOpeningTimer=null;bigTransitioning=false;
      surface.classList.remove('is-bloom-opening');
      for(const slot of slots)slot.element.classList.remove('grid-tile--depth-transition');
      settled();highlightSelection();surface.scrollTop=0;surface.scrollLeft=0;nextRound(1500);
    },prefersReduced.matches?0:Math.max(CENTER_DURATION_MS,BLOOM_SHIFT_DURATION_MS));
  }
  function clearDepthFeedback():void {
    pendingDepthControl?.classList.remove('is-waiting');
    pendingDepthControl?.setAttribute('aria-busy','false');pendingDepthControl=null;
  }
  function queueDepthChange(change:()=>void,control:HTMLElement|null=null):void {
    clearDepthFeedback();
    const run=()=>{clearDepthFeedback();activity(`Opening ${projectName()} · ${bigBloomOpen?'small':'big'} bloom`);change();};
    if(moving){
      pendingDepthControl=control;control?.classList.add('is-waiting');control?.setAttribute('aria-busy','true');
      pendingBigBloom=run;surface.classList.add('is-big-bloom-waiting');highlightSelection();
      activity(`Waiting for shift to finish · ${projectName()}`);liveStatus.textContent='Waiting for the current shift before changing bloom depth.';resumeMovement();
    }else run();
  }
  function requestBigBloom(moduleId:string):void {
    if(bigBloomOpen||bigTransitioning||closeAfterShift||!selectedChoice||!bloomModule||!bloomAnchor||bloomClosingTimer!==null)return;
    queueDepthChange(()=>{
      if(!selectedChoice||!bloomAnchor)return;
      const project=demoProjects.find(item=>item.id===selectedChoice!.projectId);if(!project)return;
      const source=bloomModules.find(panel=>panel.dataset.moduleId===moduleId);
      const start={column:parseFloat(source?.style.left??'0')/tileSize,row:parseFloat(source?.style.top??'0')/tileSize};
      clearBloomTimers();pauseBloomMedia();
      // Four rightward vacancies plus two staging cells cover the widest row.
      // Keep the bounded horizontal pool thereafter; vertical buffering is unchanged.
      if(columnBufferCells<6){columnBufferCells=6;rebuildPool(true,true);}
      smallBloom={panels:[...bloomModules],cells:[...bloomCells]};
      bigLayout=bigBloomLayout(projectModuleLoader.get(project.id)??[],moduleId);
      layer.getBoundingClientRect();
      for(const panel of bloomModules)panel.remove();
      bigBloomOpen=true;surface.classList.add('is-big-bloom');surface.classList.remove('is-big-bloom-waiting');
      surface.scrollTop=0;surface.scrollLeft=0;
      bloomCells=bigBloomVacancies(bloomAnchor,bigLayout);
      bloomModules=bigLayout.map(entry=>{
        const panel=renderModulePreview(entry.module,project.name,()=>details.open(entry.module,panel.querySelector<HTMLButtonElement>('.bloom-read-more')!),'big');
        panel.classList.add('big-bloom-card');
        if(entry.module.id===moduleId)panel.classList.add('big-bloom-card--selected');
        layer.append(panel);return panel;
      });
      bloomModule=bloomModules[0]??null;positionBloomPanels();highlightSelection();
      const anchor=bloomAnchor;
      depthTransition({x:-anchor.column*tileSize-tileSize/2,y:-anchor.row*tileSize+tileSize/2},()=>{
        const plan=bigBloomRevealPlan(bloomModules);
        for(const reveal of plan){
          const show=()=>{
            reveal.item.classList.add('is-open');
            if(reveal.item===bloomModules[0]&&!prefersReduced.matches){
              const cell=bigModuleCell(anchor,bigLayout[0]);
              reveal.item.animate([{transform:`translate(${(start.column-cell.column)*tileSize}px,${(start.row-cell.row)*tileSize}px) scale(.5)`},{transform:'translate(0,0) scale(1)'}],{duration:INTRO_SPAWN_DURATION_MS,easing:'ease-in-out'});
            }
          };
          if(prefersReduced.matches||reveal.delay===0)show();else bloomRevealTimers.push(setTimeout(show,reveal.delay));
        }
        if(keyboard.active())keyboard.focusElement(bloomModules[0]?.querySelector<HTMLButtonElement>('.bloom-read-more')??null);
        else if(activePointer===null)surface.focus({preventScroll:true});
        activity(`Exploring ${project.name} · big bloom`);
        liveStatus.textContent=project.name+': '+bloomModules.length+' large modules in the living grid.';
      });
    },bloomModules.find(panel=>panel.dataset.moduleId===moduleId)?.querySelector<HTMLElement>('.bloom-read-more')??null);
  }
  function requestSmallBloom():void {
    if(!bigBloomOpen||bigTransitioning||closeAfterShift||!smallBloom||!bloomAnchor)return;
    const keyboardReturnModule=bigLayout[0]?.module.id;
    queueDepthChange(()=>{
      if(!smallBloom||!bloomAnchor)return;
      clearBloomTimers();pauseBloomMedia();layer.getBoundingClientRect();
      for(const panel of bloomModules)panel.remove();
      bloomModules=smallBloom.panels;bloomCells=smallBloom.cells;smallBloom=null;
      bigBloomOpen=false;bigLayout=[];
      surface.classList.remove('is-big-bloom','is-big-bloom-waiting');
      for(const panel of bloomModules){panel.classList.remove('is-open');layer.append(panel);}
      bloomModule=bloomModules[0]??null;positionBloomPanels();highlightSelection();
      depthTransition(centeredPan(bloomAnchor,tileSize),()=>{
        bloomModules.forEach(panel=>panel.classList.add('is-open'));
        surface.scrollTop=0;surface.scrollLeft=0;
        activity(explorationStatus());
        if(keyboard.active())keyboard.focusElement(bloomModules.find(panel=>panel.dataset.moduleId===keyboardReturnModule)?.querySelector<HTMLButtonElement>('.bloom-read-more')??null);
        else surface.focus({preventScroll:true});liveStatus.textContent='Returned to the same small bloom.';
      });
    });
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
      const done=centerCompletion;centerCompletion=null;
      if(done){done();highlightSelection();}else if(selectedChoice)openSmallBloom(selectedChoice);
    }
  }
  function beginSelection(choice:ProjectChoice):void {
    // Fetch alongside the existing shift/centering procedure; never retime it.
    void projectModuleLoader.load(choice.projectId).catch(()=>{});
    // The original tile backs out one depth; small bloom then closes.
    if(bigTransitioning)return;
    if(bigBloomOpen&&selectedChoice&&sameChoice(selectedChoice,choice)){requestSmallBloom();return;}
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
    manualPan=createManualPanState();

    const cell={column:chosen.column,row:chosen.row};
    const movementAction=moving?selectionShiftAction(moving.moves,cell):null;
    if(movementAction==='wait'){
      // Selection never retimes an active shift. Mark gold now, then
      // begin the opening procedure once this round has finished.
      pendingChoice=choice;highlightSelection();
      if(heading)heading.textContent='Waiting for shift to finish · '+demoProjects[chosen.projectIndex??0].name;
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
    const blocked=bigBloomOpen||document.hidden||prefersReduced.matches
      ||pendingChoice!==null||centering!==null||bloomClosingTimer!==null
      ||bloomTransitioning||activePointer!==null
      ||panIsMoving(manualPan)||activeTopic!==null||introPending>0
      ||focusedProjectControl;
    const wait=ambientPollDelay(performance.now(),nextAmbientAt,blocked);
    if(wait>0){scheduleAmbient(wait);return;}

    const viewportRect=surface.getBoundingClientRect();
    const headerHeight=document.querySelector('.site-header')?.getBoundingClientRect().height??52;
    const footerHeight=0;
    const insets=ambientInsets(tileSize,headerHeight,footerHeight);
    // getBoundingClientRect reflects the actual viewport and CSS transforms,
    // unlike resting row/column indices or a simple aria-hidden check.
    const chosenSlot=bloomModule?bloomAnchor:null;
    const eligible=slots.filter(slot=>
      slot.projectIndex!==undefined&&slot.projectIndex<demoProjects.length
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
    if(event.target instanceof Element&&event.target.closest('.grid-bloom-module')
       &&(!bigBloomOpen||event.target.closest('button,a,video,iframe')))return;
    layer.querySelectorAll<HTMLElement>('.grid-bloom-module[data-dragged]').forEach(panel=>delete panel.dataset.dragged);
    cancelIntro();
    pointerDownSelect=selectFrom(event.target);
    pointerDownPanel=bigBloomOpen&&event.target instanceof Element?event.target.closest<HTMLElement>('.big-bloom-card'):null;
    pointerDownX=event.clientX;pointerDownY=event.clientY;pointerDragged=false;
    activePointer=event.pointerId; lastX=event.clientX; lastY=event.clientY;
    surface.setPointerCapture(event.pointerId);
    manualPan.pending={x:0,y:0};
    manualPan.pointerVelocity={x:0,y:0};
  });
  surface.addEventListener('pointermove',event=>{
    if(event.pointerId!==activePointer)return;
    if(Math.hypot(event.clientX-pointerDownX,event.clientY-pointerDownY)>9){
      pointerDragged=true;surface.classList.add('is-dragging');
      if(bigBloomOpen||bigTransitioning){
        if(centering){centering=null;centerCompletion=null;if(centerFrame!==null)cancelAnimationFrame(centerFrame);centerFrame=null;}
        const panel=document.elementFromPoint(pointerDownX,pointerDownY)?.closest<HTMLElement>('.big-bloom-card');
        if(panel)panel.dataset.dragged='true';
      }
      if(!bloomModule&&!closeAfterShift&&(selectedChoice||pendingChoice||centering))stopSelection();
      if(!mobileTopics.matches)hideTopic();
    }
    if(pointerDragged)
      manualPan=queuePointerTravel(manualPan,event.clientX-lastX,event.clientY-lastY);
    lastX=event.clientX;lastY=event.clientY;
    if(pointerDragged)scheduleManualFrame();
  });
  function release(event:PointerEvent):void {
    if(event.pointerId!==activePointer)return;
    const isTap=event.type==='pointerup'&&!pointerDragged
      &&Math.hypot(event.clientX-pointerDownX,event.clientY-pointerDownY)<=9;
    activePointer=null;surface.classList.remove('is-dragging');
    let chosen:ProjectChoice|null=null;
    let activatePanel:HTMLElement|null=null;
    if(isTap){
      // Pointer capture retargets pointerup to the viewport. Hit-test the
      // actual release position and require the same tile button at both ends.
      const hit=document.elementFromPoint(event.clientX,event.clientY);
      if(pointerDownPanel&&hit?.closest('.big-bloom-card')===pointerDownPanel)activatePanel=pointerDownPanel;
      const select=selectFrom(hit);
      const selectedTile=select?.closest<HTMLDivElement>('.grid-tile');
      if(selectedTile&&select===pointerDownSelect&&surface.contains(selectedTile)){
        chosen=choiceFor(selectedTile);
        hideTopic();
      }else hideTopic();
    }
    pointerDownSelect=null;pointerDownPanel=null;
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
    if(activatePanel){const entry=bigLayout.find(entry=>entry.module.id===activatePanel!.dataset.moduleId);if(entry)details.open(entry.module,activatePanel.querySelector<HTMLButtonElement>('.bloom-read-more')!);}
    refreshMobileTopics();
  }
  surface.addEventListener('pointerup',release);
  surface.addEventListener('pointercancel',release);
  surface.addEventListener('lostpointercapture',release);
  window.addEventListener('keydown',event=>{
    if(detailOpen||event.repeat)return;
    if(event.key==='Escape'&&bigBloomOpen){event.preventDefault();requestSmallBloom();return;}
    if(event.key==='Escape'&&(selectedChoice||pendingChoice)){
      event.preventDefault();
      stopSelection();
      surface.focus({preventScroll:true});
    }
  });
  window.addEventListener('blur',()=>{
    hideTopic();

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
    details.close();
    document.querySelector('.site-help')?.classList.remove('is-open');
    document.querySelector('#help-toggle')?.setAttribute('aria-expanded','false');
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
  new ResizeObserver(()=>rebuildPool()).observe(surface);
  rebuildPool();
}
