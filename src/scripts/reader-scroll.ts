/** A reader-only floating thumb; native wheel/touch scrolling stays on the content. */
export function readerScrollMetrics(viewport:number,content:number,position:number){
  const range=Math.max(0,content-viewport),track=Math.max(0,viewport-16);
  const size=Math.min(track,Math.min(96,Math.max(36,content>0?track*viewport/content:track)));
  const travel=track-size;
  return {range,size,travel,top:8+(range?Math.max(0,Math.min(range,position))/range*travel:0)};
}
export function installReaderScroll(panel:HTMLElement,scroller:HTMLElement,content:HTMLElement){
  const thumb=document.createElement('div');thumb.className='reader-scroll-thumb';thumb.tabIndex=0;
  thumb.setAttribute('role','scrollbar');thumb.setAttribute('aria-label','Reader position');thumb.setAttribute('aria-orientation','vertical');
  scroller.id='reader-scroll-content';thumb.setAttribute('aria-controls',scroller.id);thumb.setAttribute('aria-valuemin','0');
  panel.append(thumb);
  let drag:{id:number,y:number,position:number}|null=null;
  function update(){
    const m=readerScrollMetrics(scroller.clientHeight,scroller.scrollHeight,scroller.scrollTop);
    thumb.hidden=m.range<=1;thumb.style.height=m.size+'px';thumb.style.top=m.top+'px';
    thumb.setAttribute('aria-valuemax',String(Math.round(m.range)));thumb.setAttribute('aria-valuenow',String(Math.round(Math.max(0,Math.min(m.range,scroller.scrollTop)))));
    thumb.setAttribute('aria-valuetext',`${m.range?Math.round(scroller.scrollTop/m.range*100):0}%`);
  }
  thumb.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    event.preventDefault();event.stopPropagation();thumb.focus({preventScroll:true});thumb.setPointerCapture(event.pointerId);
    drag={id:event.pointerId,y:event.clientY,position:scroller.scrollTop};thumb.classList.add('is-dragging');
  });
  thumb.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const m=readerScrollMetrics(scroller.clientHeight,scroller.scrollHeight,scroller.scrollTop);
    if(m.travel)scroller.scrollTop=drag.position+(event.clientY-drag.y)*m.range/m.travel;
  });
  function finish(){drag=null;thumb.classList.remove('is-dragging');}
  thumb.addEventListener('pointerup',finish);thumb.addEventListener('pointercancel',finish);thumb.addEventListener('lostpointercapture',finish);
  thumb.addEventListener('keydown',event=>{
    const steps:Record<string,number>={ArrowDown:48,ArrowUp:-48,PageDown:scroller.clientHeight*.9,PageUp:-scroller.clientHeight*.9};
    if(event.key==='Home')scroller.scrollTop=0;
    else if(event.key==='End')scroller.scrollTop=scroller.scrollHeight;
    else if(event.key in steps)scroller.scrollTop+=steps[event.key];
    else return;
    event.preventDefault();event.stopPropagation();
  });
  scroller.addEventListener('scroll',update,{passive:true});
  const observer=new ResizeObserver(update);observer.observe(scroller);observer.observe(content);
  update();
  return ()=>{observer.disconnect();scroller.removeEventListener('scroll',update);finish();thumb.remove();};
}
