import {safeEmbedUrl,type ProjectModule} from '../lib/project-modules';
/** Previews own their media controls. Expanded page composition is a later layer. */
export function renderModulePreview(module:ProjectModule,projectName:string):HTMLElement {
  const panel=document.createElement('section');
  panel.className='grid-bloom-module';panel.dataset.moduleId=module.id;
  panel.dataset.moduleType=module.type;panel.setAttribute('aria-label',projectName+': '+module.title);
  const title=document.createElement('h2');title.className='bloom-title';title.textContent=module.title;
  const summary=document.createElement('p');summary.className='bloom-summary';summary.textContent=module.preview;
  panel.append(title,summary);
  if(module.type==='gallery'&&module.images?.length){
    const figure=document.createElement('figure');figure.className='bloom-media';
    const image=document.createElement('img');image.loading='lazy';image.decoding='async';image.draggable=false;
    let index=0;
    const update=()=>{const item=module.images![index];image.src=item.src;image.alt=item.alt;};update();
    figure.append(image);panel.append(figure);
    if(module.images.length>1){
      const next=document.createElement('button');next.type='button';next.className='bloom-action';
      next.textContent='Next image';next.setAttribute('aria-label','Next image in '+module.title);
      next.addEventListener('click',()=>{index=(index+1)%module.images!.length;update();});panel.append(next);
    }
  }
  if(module.type==='video'&&module.video){
    if(module.video.src){
      const video=document.createElement('video');video.className='bloom-media';
      video.controls=true;video.preload='none';video.playsInline=true;
      video.src=module.video.src;if(module.video.poster)video.poster=module.video.poster;
      video.setAttribute('aria-label',module.video.title);panel.append(video);
    }else if(module.video.embed){
      const safe=safeEmbedUrl(module.video.embed);
      if(safe){
        // The external player is requested only after explicit activation.
        const play=document.createElement('button');play.className='bloom-action';play.textContent='Load video';play.type='button';
        play.addEventListener('click',()=>{
          const frame=document.createElement('iframe');frame.className='bloom-media';frame.src=safe;
          frame.title=module.video!.title;frame.allow='fullscreen; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';
          play.replaceWith(frame);
        },{once:true});panel.append(play);
      }
    }
  }
  if(module.type==='resources')for(const item of module.links??[]){
    const link=document.createElement('a');link.className='bloom-action';link.textContent=item.label;
    link.href=item.href;link.target='_blank';link.rel='noopener noreferrer';panel.append(link);
  }
  return panel;
}
