import {gridDeepLinkHash} from '../lib/grid-deep-link.ts';
/** Absolute homepage link that reopens this module's reader from its big bloom,
 * optionally at one document of a folder reader. */
export function moduleShareUrl(projectId:string,moduleId:string,base:Location|URL=location,doc:string|null=null):string {
  return base.origin+base.pathname+gridDeepLinkHash({project:projectId,bloom:'big',read:moduleId,doc});
}
const ICON='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';
/** Top-right share control for a big-bloom card or the reader. Uses the system
 * share sheet where one exists (phones), otherwise copies the link to the
 * clipboard. `link` may be a function when the shared view can change, as in
 * a folder reader. Cards skip the tab order of the spatial grid; the reader
 * passes `focusable` so keyboard users can reach it. */
export function renderShareButton(link:string|(()=>{url:string;title:string}),title:string,announce:(message:string)=>void,{focusable=false}:{focusable?:boolean}={}):HTMLButtonElement {
  const current=()=>typeof link==='string'?{url:link,title}:link();
  const button=document.createElement('button');button.type='button';
  button.className='bloom-action bloom-share';button.tabIndex=focusable?0:-1;
  button.innerHTML=ICON;button.setAttribute('aria-label','Share link: '+title);button.title='Share link';
  let reset:ReturnType<typeof setTimeout>|null=null;
  const confirm=(message:string)=>{
    announce(message);button.classList.add('is-copied');button.title=message;
    if(reset!==null)clearTimeout(reset);
    reset=setTimeout(()=>{button.classList.remove('is-copied');button.title='Share link';reset=null;},1600);
  };
  button.addEventListener('click',async event=>{
    event.stopPropagation();
    const {url,title}=current();
    if(navigator.share&&matchMedia('(pointer:coarse)').matches){
      try{await navigator.share({title,url});return;}
      catch(error){if(error instanceof DOMException&&error.name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(url);confirm('Link copied');}
    catch{window.prompt('Copy this link',url);}
  });
  return button;
}
