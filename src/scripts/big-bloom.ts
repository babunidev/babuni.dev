import {bigBloomLayout} from '../lib/big-bloom';
import {moduleRevealPlan,videosForModule,type ProjectModule} from '../lib/project-modules';
import {renderModulePreview,renderVideo} from './module-preview';
import {renderDocument} from './document-reader';
import {CENTER_DURATION_MS} from '../lib/grid-focus';
interface Project {id:string;name:string;portalArtwork?:string;tint:string}
/** Separate camera and modal depth; the underlying small bloom is retained. */
export function openBigBloom(project:Project,modules:ProjectModule[],selectedId:string,origin:DOMRect,onReturn:()=>void){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const dialog=document.createElement('dialog');dialog.className='big-bloom';
  dialog.setAttribute('aria-label',project.name+' big bloom');
  const portal=document.createElement('button');portal.type='button';portal.className='big-bloom-portal';
  portal.setAttribute('aria-label','Back to '+project.name+' small bloom');
  const aperture=document.createElement('span');aperture.className='big-portal-aperture';aperture.style.background=project.tint;
  if(project.portalArtwork){const image=document.createElement('img');image.src=project.portalArtwork;image.alt='';image.draggable=false;aperture.append(image);}
  const label=document.createElement('span');label.textContent=project.name;portal.append(aperture,label);
  const instructions=document.createElement('p');instructions.className='big-bloom-instructions';
  instructions.textContent='Drag to explore · Arrow keys to move · Read more for detail';
  const stage=document.createElement('div');stage.className='big-bloom-stage';stage.tabIndex=0;
  stage.setAttribute('aria-label','Project modules. Drag or use arrow keys to explore. Home returns to the selected module.');
  const world=document.createElement('div');world.className='big-bloom-world';stage.append(world);
  const status=document.createElement('div');status.className='sr-only';status.setAttribute('role','status');
  dialog.append(portal,instructions,stage,status);document.body.append(dialog);dialog.showModal();
  const size=Math.min(420,Math.max(260,stage.clientWidth-40)),height=Math.min(390,Math.max(280,stage.clientHeight-40));
  let x=0,y=0,closed=false,returning=false,detail:HTMLDialogElement|null=null;
  const timers:ReturnType<typeof setTimeout>[]=[];
  const layout=bigBloomLayout(modules,selectedId);
  function paint(){world.style.transform=`translate(${stage.clientWidth/2-size/2+x}px,${stage.clientHeight/2-height/2+y}px)`;}
  function stopPlayers(root:HTMLElement){root.querySelectorAll('video').forEach(video=>video.pause());root.querySelectorAll('iframe').forEach(frame=>{const figure=frame.closest('figure');if(figure)figure.replaceWith(renderVideo({embed:frame.src,title:frame.title}));else frame.remove();});}
  function closeDetail(){if(!detail)return;stopPlayers(detail);detail.close();detail.remove();detail=null;}
  function openDetail(module:ProjectModule,trigger:HTMLButtonElement){
    stopPlayers(world);
    const view=document.createElement('dialog');view.className='module-detail';view.setAttribute('aria-label',module.title+' detail');detail=view;
    const back=document.createElement('button');back.type='button';back.className='bloom-action detail-back';back.textContent='Back to big bloom';
    const title=document.createElement('h1');title.textContent=module.title;
    const content=document.createElement('article');content.className='module-detail-content';
    if(module.type==='text')content.append(renderDocument(module.body??''));
    if(module.type==='gallery')for(const item of module.images??[]){
      const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');
      image.src=item.src;image.alt=item.alt;image.loading='lazy';caption.textContent=item.caption??'';
      const fullscreen=document.createElement('button');fullscreen.type='button';fullscreen.className='bloom-action';fullscreen.textContent='View image fullscreen';
      if(!image.requestFullscreen){fullscreen.disabled=true;fullscreen.textContent='Fullscreen unavailable in this browser';}
      fullscreen.addEventListener('click',()=>{image.requestFullscreen?.().catch(()=>{fullscreen.textContent='Fullscreen unavailable in this browser';});});
      figure.append(image,caption,fullscreen);content.append(figure);
    }
    if(module.type==='video')for(const video of videosForModule(module))content.append(renderVideo(video));
    if(module.type==='resources')for(const item of module.links??[]){const link=document.createElement('a');link.href=item.href;link.textContent=item.label;link.className='bloom-action';link.target='_blank';link.rel='noopener noreferrer';content.append(link);}
    if(module.source){const source=document.createElement('a');source.href=module.source;source.textContent='View source';source.target='_blank';source.rel='noopener noreferrer';content.append(source);}
    if(module.credit){const credit=document.createElement('p');credit.className='module-credit';credit.textContent=module.credit;content.append(credit);}
    function backToBloom(){closeDetail();trigger.focus({preventScroll:true});}
    back.addEventListener('click',backToBloom);view.addEventListener('cancel',event=>{event.preventDefault();backToBloom();});
    view.append(back,title,content);document.body.append(view);view.showModal();back.focus({preventScroll:true});
  }
  const cards=layout.map(entry=>{
    const card=renderModulePreview(entry.module,project.name,()=>openDetail(entry.module,card.querySelector<HTMLButtonElement>('.bloom-read-more')!));
    card.classList.add('big-bloom-card');card.style.left=entry.column*(size+24)+'px';card.style.top=entry.row*(height+24)+'px';
    card.style.width=size+'px';card.style.height=height+'px';
    if(entry.module.id===selectedId)card.classList.add('big-bloom-card--selected');
    world.append(card);return card;
  });
  // Selected module introduces the project immediately; others follow in a
  // shuffled sequence, with the existing module reveal intervals.
  cards[0]?.classList.add('is-open');
  for(const reveal of moduleRevealPlan(cards.slice(1))){
    if(reduced.matches)reveal.item.classList.add('is-open');
    else timers.push(setTimeout(()=>{reveal.item.classList.add('is-open');},260+reveal.delay));
  }
  status.textContent=project.name+': '+layout.length+' modules. '+(layout[0]?.module.title??'')+' selected.';
  paint();stage.focus({preventScroll:true});
  const target=portal.getBoundingClientRect();
  if(!reduced.matches)portal.animate([
    {transform:`translate(${origin.left-target.left}px,${origin.top-target.top}px) scale(${origin.width/target.width})`},
    {transform:'translate(0,0) scale(1)'}
  ],{duration:CENTER_DURATION_MS,easing:'ease-in-out'});
  async function returnToSmall(){
    if(returning)return;returning=true;
    timers.forEach(clearTimeout);stopPlayers(dialog);closeDetail();
    if(!reduced.matches){
      const rect=portal.getBoundingClientRect();
      await portal.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${innerWidth/2-origin.width/2-rect.left}px,${innerHeight/2-origin.height/2-rect.top}px) scale(${origin.width/rect.width})`}],{duration:CENTER_DURATION_MS,easing:'ease-in-out',fill:'forwards'}).finished;
    }
    closed=true;observer.disconnect();window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',release);window.removeEventListener('blur',resetPointer);dialog.close();dialog.remove();onReturn();
  }
  portal.addEventListener('click',()=>void returnToSmall());
  dialog.addEventListener('cancel',event=>{event.preventDefault();void returnToSmall();});
  // Pointer capture starts only after drag intent. A tap on a card or its
  // Read more remains an activation; dragging cannot accidentally open detail.
  let pointer:number|null=null,startX=0,startY=0,lastX=0,lastY=0,dragged=false;
  stage.addEventListener('pointerdown',event=>{
    if(pointer!==null||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
    dragged=false;
    if(event.target instanceof Element&&event.target.closest('button,a,video,iframe'))return;
    pointer=event.pointerId;startX=lastX=event.clientX;startY=lastY=event.clientY;dragged=false;
  });
  stage.addEventListener('pointermove',event=>{
    if(pointer!==event.pointerId)return;
    if(!dragged&&Math.hypot(event.clientX-startX,event.clientY-startY)>9){dragged=true;stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');}
    if(dragged){x+=event.clientX-lastX;y+=event.clientY-lastY;paint();}
    lastX=event.clientX;lastY=event.clientY;
  });
  function release(event:PointerEvent){if(pointer!==event.pointerId)return;pointer=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);}
  stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
  function resetPointer(){if(pointer!==null&&stage.hasPointerCapture(pointer))stage.releasePointerCapture(pointer);pointer=null;stage.classList.remove('is-dragging');}
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('blur',resetPointer);
  stage.addEventListener('click',event=>{if(dragged&&event.detail!==0){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
  stage.addEventListener('focusin',event=>{
    if(!(event.target instanceof HTMLElement))return;
    const card=event.target.closest<HTMLElement>('.big-bloom-card');if(!card)return;
    const rect=event.target.getBoundingClientRect(),bounds=stage.getBoundingClientRect();
    if(rect.left<bounds.left||rect.right>bounds.right||rect.top<bounds.top||rect.bottom>bounds.bottom){
      x=-card.offsetLeft;y=-card.offsetTop;paint();
    }
  });
  stage.addEventListener('keydown',event=>{
    if(event.target instanceof Element&&event.target.closest('button,a,video,iframe'))return;
    const moves:Record<string,[number,number]>={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]};
    if(event.key==='Home'){x=0;y=0;event.preventDefault();paint();}
    if(moves[event.key]){event.preventDefault();x+=moves[event.key][0];y+=moves[event.key][1];paint();}
  });
  const observer=new ResizeObserver(()=>{if(!closed)paint();});observer.observe(stage);
}
