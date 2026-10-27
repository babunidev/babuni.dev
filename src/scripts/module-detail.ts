import {videosForModule,type ProjectModule} from '../lib/project-modules';
import {renderVideo} from './module-preview';
import {renderDocument} from './document-reader';
import {loadIndexedBody} from '../lib/repository-content';
/** Detail is modal; big bloom itself belongs to the living grid. */
export function createModuleDetails(onChange:(open:boolean)=>void){
  let detail:HTMLDialogElement|null=null;
  let documentRequest:AbortController|null=null;
  function stopPlayers(root:HTMLElement){root.querySelectorAll('video').forEach(video=>video.pause());root.querySelectorAll('iframe').forEach(frame=>{const figure=frame.closest('figure');if(figure)figure.replaceWith(renderVideo({embed:frame.src,title:frame.title}));else frame.remove();});}
  function closeDetail(){if(!detail)return;documentRequest?.abort();documentRequest=null;stopPlayers(detail);detail.close();detail.remove();detail=null;onChange(false);}
  function openDetail(module:ProjectModule,trigger:HTMLButtonElement){
    onChange(true);
    const view=document.createElement('dialog');view.className='module-detail';view.setAttribute('aria-label',module.title+' detail');detail=view;
    const back=document.createElement('button');back.type='button';back.className='bloom-action detail-back';back.textContent='Back to big bloom';
    const title=document.createElement('h1');title.textContent=module.title;
    const content=document.createElement('article');content.className='module-detail-content';
    if(module.type==='text'){
      if(module.bodyUrl){
        const progress=document.createElement('p');
        progress.setAttribute('role','status');
        progress.textContent='Loading document…';
        content.append(progress);
        const request=new AbortController();
        documentRequest=request;
        const load=async()=>{
          progress.textContent='Loading document…';
          try {
            const body=await loadIndexedBody(module.bodyUrl!,fetch,request.signal);
            if(detail!==view||request.signal.aborted)return;
            content.replaceChildren(renderDocument(body));
          }catch(error){
            if(detail!==view||request.signal.aborted)return;
            progress.textContent='Could not load this document. Please try again.';
            const retry=document.createElement('button');
            retry.type='button';retry.className='bloom-action';
            retry.textContent='Retry document';
            retry.addEventListener('click',()=>{
              retry.remove();void load();
            },{once:true});
            content.replaceChildren(progress,retry);
          }
        };
        void load();
      }else content.append(renderDocument(module.body??''));
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
    function backToBloom(){closeDetail();trigger.focus({preventScroll:true});}
    back.addEventListener('click',backToBloom);view.addEventListener('cancel',event=>{event.preventDefault();backToBloom();});
    view.append(back,title,content);document.body.append(view);view.showModal();back.focus({preventScroll:true});
  }
  return {open:openDetail,close:closeDetail,isOpen:()=>detail!==null};
}
