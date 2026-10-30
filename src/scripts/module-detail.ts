import {installReaderScroll} from './reader-scroll';
import {shrinkReader} from './reader-transition';
import {attachReaderHeader} from './site-navigation';
import {videosForModule,type ProjectModule} from '../lib/project-modules';
import {renderVideo} from './module-preview';
import {renderDocument} from './document-reader';
import {createDocumentBody} from './document-body';
import {installReaderDismissal} from './reader-dismissal';
/** Detail is modal; big bloom itself belongs to the living grid. */
export function createModuleDetails(onChange:(open:boolean,title?:string)=>void){
  let detail:HTMLDialogElement|null=null;
  let disposeScroll:(()=>void)|null=null;
  let cancelClosing:(()=>void)|null=null;
  let closing=false;
  let dismissReader:(()=>void)|null=null;
  let restoreHeader:(()=>void)|null=null;
  let documentRequest:AbortController|null=null;
  function stopPlayers(root:HTMLElement){root.querySelectorAll('video').forEach(video=>video.pause());root.querySelectorAll('iframe').forEach(frame=>{const figure=frame.closest('figure');if(figure)figure.replaceWith(renderVideo({embed:frame.src,title:frame.title}));else frame.remove();});}
  function closeDetail(){disposeScroll?.();disposeScroll=null;cancelClosing?.();cancelClosing=null;closing=false;dismissReader=null;if(!detail)return;documentRequest?.abort();documentRequest=null;stopPlayers(detail);restoreHeader?.();restoreHeader=null;detail.close();detail.remove();detail=null;onChange(false);}
  function openDetail(module:ProjectModule,trigger:HTMLButtonElement){
    closeDetail();
    onChange(true,module.title);
    const view=document.createElement('dialog');view.className='module-detail';view.setAttribute('aria-label',module.title+' detail');detail=view;
    const title=document.createElement('h1');title.textContent=module.title;title.tabIndex=-1;
    const content=document.createElement('article');content.className='module-detail-content';
    if(module.id==='about')content.classList.add('about-content');
    if(module.type==='text'){
      if(module.bodyUrl){
        const request=new AbortController();
        documentRequest=request;
        const body=createDocumentBody(module.bodyUrl,{
          signal:request.signal,isCurrent:()=>detail===view,sourceUrl:module.source
        });
        content.append(body.element);
        void body.load();
      }else content.append(renderDocument(module.body??'',module.source));
    }
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
    function backToBloom(){
      if(closing)return;closing=true;
      documentRequest?.abort();stopPlayers(view);
      cancelClosing=shrinkReader(panel,matchMedia('(prefers-reduced-motion: reduce)').matches,()=>{
        if(detail!==view)return;
        closeDetail();trigger.focus({preventScroll:true});
      });
    }
    dismissReader=backToBloom;
    const panel=document.createElement('div');panel.className='module-detail-panel';const scroller=document.createElement('div');scroller.className='reader-scroll-content';scroller.append(title,content);panel.append(scroller);
    installReaderDismissal(view,backToBloom,panel);
    view.append(panel);document.body.append(view);restoreHeader=attachReaderHeader(view);view.showModal();disposeScroll=installReaderScroll(panel,scroller,content);title.focus({preventScroll:true});
  }
  return {open:openDetail,close:()=>dismissReader?.(),isOpen:()=>detail!==null};
}
