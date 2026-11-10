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
    if(module.source&&module.type!=='document-list'){const source=document.createElement('a');source.href=module.source;source.textContent='View source';source.target='_blank';source.rel='noopener noreferrer';content.append(source);}
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
    view.append(panel);document.body.append(view);restoreHeader=attachReaderHeader(view);view.showModal();disposeScroll=installReaderScroll(panel,scroller,content);
    if(module.type==='document-list'){
      const anchorLink=(label:string,href:string):HTMLAnchorElement=>{
        const link=document.createElement('a');link.textContent=label;link.href=href;
        link.className='bloom-action';link.target='_blank';link.rel='noopener noreferrer';return link;
      };
      const showIndex=():void=>{
        documentRequest?.abort();documentRequest=null;
        title.textContent=module.title;
        const intro=document.createElement('p');intro.textContent=module.preview;
        const list=document.createElement('ul');list.className='module-document-list';
        if(module.documents?.some(item=>item.image))list.classList.add('has-images');
        for(const item of module.documents??[]){
          const li=document.createElement('li'),button=document.createElement('button');
          button.type='button';button.className='bloom-action';button.textContent=item.title;
          button.addEventListener('click',()=>showDocument(item));
          if(item.image){
            // Paired image sits centered above its document; small icons keep their size,
            // large images scale down to the reader width.
            const image=document.createElement('img');image.className='document-entry-image';
            image.src=item.image;image.alt='';image.loading='lazy';image.decoding='async';
            image.addEventListener('click',()=>showDocument(item));li.append(image);
          }
          li.append(button);list.append(li);
        }
        const children:HTMLElement[]=[intro];
        if(list.children.length)children.push(list);
        else{const empty=document.createElement('p');empty.textContent='No Markdown documents in this folder yet.';children.push(empty);}
        for(const link of module.links??[])children.push(anchorLink(link.label,link.href));
        if(module.source)children.push(anchorLink('Browse source folder',module.source));
        content.replaceChildren(...children);scroller.scrollTop=0;
      };
      const showDocument=(item:NonNullable<typeof module.documents>[number]):void=>{
        documentRequest?.abort();
        const controller=new AbortController();documentRequest=controller;
        title.textContent=item.title;
        const back=document.createElement('button');back.type='button';
        back.className='bloom-action';back.textContent='Back to '+module.title;
        back.addEventListener('click',()=>{showIndex();(content.querySelector('button')??title).focus({preventScroll:true});});
        const body=createDocumentBody(item.bodyUrl,{
          signal:controller.signal,isCurrent:()=>detail===view&&documentRequest===controller,
          sourceUrl:item.source
        });
        content.replaceChildren(back,body.element,anchorLink('View original Markdown',item.source));
        scroller.scrollTop=0;void body.load();
      };
      showIndex();
    }
    title.focus({preventScroll:true});
  }
  return {open:openDetail,close:()=>dismissReader?.(),isOpen:()=>detail!==null};
}
