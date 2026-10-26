import { demoProjectIndex, gridWindow, logicalCell, positiveModulo, tileSizeForWidth } from '../lib/grid-math';

interface ProjectPlaceholder { name: string; tint: string; }
const projects: ProjectPlaceholder[] = [
  {name:'PROJECT 01',tint:'#568cdb'}, {name:'PROJECT 02',tint:'#d3a457'},
  {name:'PROJECT 03',tint:'#6ac0a5'}, {name:'PROJECT 04',tint:'#c778b9'},
  {name:'PROJECT 05',tint:'#db7859'}, {name:'PROJECT 06',tint:'#8c8be3'},
  {name:'PROJECT 07',tint:'#7eb875'}, {name:'PROJECT 08',tint:'#c1b56d'},
  {name:'PROJECT 09',tint:'#61afb9'}, {name:'PROJECT 10',tint:'#ab88d1'},
  {name:'PROJECT 11',tint:'#d08e79'}, {name:'PROJECT 12',tint:'#70a3c2'}
];
interface TileSlot { element: HTMLDivElement; column: number; row: number; }
const viewport = document.querySelector<HTMLElement>('#grid-viewport');
const world = document.querySelector<HTMLElement>('#grid-world');
const resetButton = document.querySelector<HTMLButtonElement>('#reset-view');
const status = document.querySelector<HTMLElement>('#grid-status');

if (viewport && world && resetButton && status) {
  const surface=viewport, layer=world, reset=resetButton, liveStatus=status;
  const bufferCells=2;
  let panX=0, panY=0, tileSize=240, columns=0, rows=0;
  let firstColumn=0, firstRow=0, columnHead=0, rowHead=0;
  let slots:TileSlot[]=[];
  let activePointer:number|null=null, lastX=0, lastY=0;

  function makeTile():HTMLDivElement {
    const element=document.createElement('div');
    element.className='grid-tile';
    element.setAttribute('aria-hidden','true');
    element.innerHTML='<div class="tile-face"><div class="tile-mark"></div><div class="tile-portal"></div><div class="tile-name"></div></div>';
    return element;
  }
  function populate(slot:TileSlot,column:number,row:number):void {
    if(slot.column===column && slot.row===row) return;
    slot.column=column; slot.row=row;
    slot.element.style.left=(column*tileSize)+'px';
    slot.element.style.top=(row*tileSize)+'px';
    const isOrigin=column===0&&row===0;
    const project=isOrigin ? {name:'BABUNI.DEV',tint:'#b78af9'} :
      projects[demoProjectIndex(column,row,projects.length)];
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
    updateField();
  }
  /** Move the whole layer for every drag event; repurpose only exiting pool slots. */
  function updateField():void {
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
  }
  surface.addEventListener('pointerdown',event=>{
    if(activePointer!==null||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0)) return;
    activePointer=event.pointerId; lastX=event.clientX; lastY=event.clientY;
    surface.setPointerCapture(event.pointerId);
    surface.classList.add('is-dragging');
  });
  surface.addEventListener('pointermove',event=>{
    if(event.pointerId!==activePointer)return;
    panX+=event.clientX-lastX; panY+=event.clientY-lastY;
    lastX=event.clientX; lastY=event.clientY;
    updateField();
  });
  function release(event:PointerEvent):void {
    if(event.pointerId!==activePointer)return;
    activePointer=null; surface.classList.remove('is-dragging');
    if(surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
  }
  surface.addEventListener('pointerup',release);
  surface.addEventListener('pointercancel',release);
  surface.addEventListener('lostpointercapture',release);
  surface.addEventListener('keydown',event=>{
    const distance=event.shiftKey?tileSize:Math.round(tileSize/3);
    switch(event.key){
      case 'ArrowLeft':panX+=distance;break;
      case 'ArrowRight':panX-=distance;break;
      case 'ArrowUp':panY+=distance;break;
      case 'ArrowDown':panY-=distance;break;
      case 'Home':panX=0;panY=0;break;
      default:return;
    }
    event.preventDefault();updateField();
  });
  reset.addEventListener('click',()=>{
    panX=0;panY=0;updateField();
    liveStatus.textContent='Returned to the starting tile.';
  });
  new ResizeObserver(rebuildPool).observe(surface);
  rebuildPool();
}
