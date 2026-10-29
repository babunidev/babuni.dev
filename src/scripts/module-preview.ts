import {renderDocument} from './document-reader.ts';
import {moduleIntro} from '../lib/big-bloom.ts';
import {safeEmbedUrl,videosForModule,type ModuleVideo,type ProjectModule} from '../lib/project-modules.ts';
/** Embedded players show their preview immediately; playback remains user initiated. */
export function renderVideo(video:ModuleVideo):HTMLElement {
  const container=document.createElement('figure');container.className='video-item';
  const caption=document.createElement('figcaption');caption.textContent=video.title;container.append(caption);
  const frameShell=document.createElement('div');frameShell.className='video-frame';
  if(video.src){
    const player=document.createElement('video');player.className='bloom-media';
    player.controls=true;player.preload='none';player.playsInline=true;
    player.src=video.src;if(video.poster)player.poster=video.poster;
    player.setAttribute('aria-label',video.title);frameShell.append(player);
  }else if(video.embed){
    const safe=safeEmbedUrl(video.embed);
    if(safe){
      const frame=document.createElement('iframe');frame.className='bloom-media';frame.src=safe;
      frame.title=video.title;frame.loading='lazy';
      frame.allow='encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;
      frame.referrerPolicy='strict-origin-when-cross-origin';frameShell.append(frame);
    }
  }
  if(frameShell.children.length)container.append(frameShell);
  return container;
}
export function renderModulePreview(module:ProjectModule,projectName:string,onReadMore?:()=>void,depth:'small'|'big'='small'):HTMLElement {
  const panel=document.createElement('section');
  panel.className='grid-bloom-module';panel.dataset.moduleId=module.id;
  panel.dataset.moduleType=module.type;panel.setAttribute('aria-label',projectName+': '+module.title);
  const title=document.createElement('h2');title.className='bloom-title';title.textContent=module.title;
  const summary=renderDocument(depth==='big'?moduleIntro(module):module.preview,module.source,false);
  summary.className='bloom-summary module-document';
  const content=document.createElement('div');content.className='bloom-preview-content';
  content.append(title,summary);panel.append(content);
  if(module.type==='gallery'&&module.images?.length){
    const figure=document.createElement('figure');figure.className='bloom-media';
    const image=document.createElement('img');image.loading='lazy';image.decoding='async';image.draggable=false;
    const caption=document.createElement('figcaption');
    let index=0;
    const update=()=>{const item=module.images![index];image.src=item.src;image.alt=item.alt;caption.textContent=item.caption??item.alt;};update();
    figure.append(image);content.append(figure);
    if(depth==='big'){content.append(caption);const count=document.createElement('span');count.className='video-count';count.textContent=module.images.length+' images';content.append(count);}
    if(module.images.length>1){
      const next=document.createElement('button');next.type='button';next.className='bloom-action';
      next.textContent='Next image';next.setAttribute('aria-label','Next image in '+module.title);
      next.addEventListener('click',()=>{index=(index+1)%module.images!.length;update();});content.append(next);
    }
  }
  if(module.type==='video'){
    const videos=videosForModule(module);
    if(videos[0])content.insertBefore(renderVideo(videos[0]),summary);
    if(depth==='big'){const list=document.createElement('ul');list.className='bloom-collection-list';for(const video of videos){const item=document.createElement('li');item.textContent=video.title;list.append(item);}content.append(list);}
    if(videos.length>1){const count=document.createElement('span');count.className='video-count';count.textContent=videos.length+' videos';content.append(count);}
  }
  if(module.type==='resources')for(const item of module.links??[]){
    const link=document.createElement('a');link.className='bloom-action';link.textContent=item.label;
    link.href=item.href;link.target='_blank';link.rel='noopener noreferrer';content.append(link);
  }
  if(depth==='big'&&module.credit){const credit=document.createElement('p');credit.className='bloom-preview-credit';credit.textContent=module.credit;content.append(credit);}
  if(onReadMore){
    const read=document.createElement('button');read.type='button';read.className='bloom-action bloom-read-more';
    read.tabIndex=-1;read.textContent='Read more';read.setAttribute('aria-label','Read more: '+module.title);
    read.addEventListener('click',event=>{event.stopPropagation();onReadMore();});panel.append(read);
    panel.addEventListener('click',event=>{
      if(event.target instanceof Element&&event.target.closest('button,a,video,iframe'))return;
      if(panel.closest('.is-dragging')||panel.dataset.dragged==='true')return;
      if(window.getSelection()?.toString())return;
      onReadMore();
    });
  }
  return panel;
}
