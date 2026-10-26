import {safeEmbedUrl,videosForModule,type ModuleVideo,type ProjectModule} from '../lib/project-modules';
/** Players are deliberately activated; no autoplay or eager video fetch. */
export function renderVideo(video:ModuleVideo):HTMLElement {
  const container=document.createElement('figure');container.className='video-item';
  const caption=document.createElement('figcaption');caption.textContent=video.title;container.append(caption);
  if(video.src){
    const player=document.createElement('video');player.className='bloom-media';
    player.controls=true;player.preload='none';player.playsInline=true;
    player.src=video.src;if(video.poster)player.poster=video.poster;
    player.setAttribute('aria-label',video.title);container.append(player);
  }else if(video.embed){
    const safe=safeEmbedUrl(video.embed);
    if(safe){
      const play=document.createElement('button');play.className='bloom-action';play.textContent='Load video';play.type='button';
      play.addEventListener('click',()=>{
        const frame=document.createElement('iframe');frame.className='bloom-media';frame.src=safe;
        frame.title=video.title;frame.allow='fullscreen; picture-in-picture';frame.allowFullscreen=true;
        frame.referrerPolicy='strict-origin-when-cross-origin';play.replaceWith(frame);
      },{once:true});container.append(play);
    }
  }
  return container;
}
export function renderModulePreview(module:ProjectModule,projectName:string,onReadMore?:()=>void):HTMLElement {
  const panel=document.createElement('section');
  panel.className='grid-bloom-module';panel.dataset.moduleId=module.id;
  panel.dataset.moduleType=module.type;panel.setAttribute('aria-label',projectName+': '+module.title);
  const title=document.createElement('h2');title.className='bloom-title';title.textContent=module.title;
  const summary=document.createElement('p');summary.className='bloom-summary';summary.textContent=module.preview;
  const content=document.createElement('div');content.className='bloom-preview-content';
  content.append(title,summary);panel.append(content);
  if(module.type==='gallery'&&module.images?.length){
    const figure=document.createElement('figure');figure.className='bloom-media';
    const image=document.createElement('img');image.loading='lazy';image.decoding='async';image.draggable=false;
    let index=0;
    const update=()=>{const item=module.images![index];image.src=item.src;image.alt=item.alt;};update();
    figure.append(image);content.append(figure);
    if(module.images.length>1){
      const next=document.createElement('button');next.type='button';next.className='bloom-action';
      next.textContent='Next image';next.setAttribute('aria-label','Next image in '+module.title);
      next.addEventListener('click',()=>{index=(index+1)%module.images!.length;update();});content.append(next);
    }
  }
  if(module.type==='video'){
    const videos=videosForModule(module);
    if(videos[0])content.append(renderVideo(videos[0]));
    if(videos.length>1){const count=document.createElement('span');count.className='video-count';count.textContent=videos.length+' videos';content.append(count);}
  }
  if(module.type==='resources')for(const item of module.links??[]){
    const link=document.createElement('a');link.className='bloom-action';link.textContent=item.label;
    link.href=item.href;link.target='_blank';link.rel='noopener noreferrer';content.append(link);
  }
  if(onReadMore){
    const read=document.createElement('button');read.type='button';read.className='bloom-action bloom-read-more';
    read.textContent='Read more';read.setAttribute('aria-label','Read more: '+module.title);
    read.addEventListener('click',event=>{event.stopPropagation();onReadMore();});panel.append(read);
    panel.addEventListener('click',event=>{
      if(event.target instanceof Element&&event.target.closest('button,a,video,iframe'))return;
      if(window.getSelection()?.toString())return;
      onReadMore();
    });
  }
  return panel;
}
