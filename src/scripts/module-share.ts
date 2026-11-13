import {gridDeepLinkHash} from '../lib/grid-deep-link.ts';
/** Absolute homepage link that reopens this module's reader from its big bloom. */
export function moduleShareUrl(projectId:string,moduleId:string,base:Location|URL=location):string {
  return base.origin+base.pathname+gridDeepLinkHash({project:projectId,bloom:'big',read:moduleId});
}
const ICON='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';
/** Top-right share control for a big-bloom card. Uses the system share sheet
 * where one exists (phones), otherwise copies the link to the clipboard. */
export function renderShareButton(url:string,title:string,announce:(message:string)=>void):HTMLButtonElement {
  const button=document.createElement('button');button.type='button';
  button.className='bloom-action bloom-share';button.tabIndex=-1;
  button.innerHTML=ICON;button.setAttribute('aria-label','Share link: '+title);button.title='Share link';
  let reset:ReturnType<typeof setTimeout>|null=null;
  const confirm=(message:string)=>{
    announce(message);button.classList.add('is-copied');button.title=message;
    if(reset!==null)clearTimeout(reset);
    reset=setTimeout(()=>{button.classList.remove('is-copied');button.title='Share link';reset=null;},1600);
  };
  button.addEventListener('click',async event=>{
    event.stopPropagation();
    if(navigator.share&&matchMedia('(pointer:coarse)').matches){
      try{await navigator.share({title,url});return;}
      catch(error){if(error instanceof DOMException&&error.name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(url);confirm('Link copied');}
    catch{window.prompt('Copy this link',url);}
  });
  return button;
}
