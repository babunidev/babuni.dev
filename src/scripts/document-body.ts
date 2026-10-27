import {loadIndexedBody} from '../lib/repository-content.ts';
import {renderDocument} from './document-reader.ts';

/** Async reading owns only this body; source links and credits are siblings. */
export function createDocumentBody(url:string,options:{
  signal:AbortSignal;isCurrent:()=>boolean;
  loadBody?:(url:string,signal:AbortSignal)=>Promise<string>;
}){
  const element=document.createElement('div');element.className='module-detail-body';
  const progress=document.createElement('p');progress.setAttribute('role','status');
  const loadBody=options.loadBody??((url,signal)=>loadIndexedBody(url,fetch,signal));
  async function load():Promise<void>{
    progress.textContent='Loading document…';element.replaceChildren(progress);
    try{
      const body=await loadBody(url,options.signal);
      if(!options.isCurrent()||options.signal.aborted)return;
      element.replaceChildren(renderDocument(body));
    }catch{
      if(!options.isCurrent()||options.signal.aborted)return;
      progress.textContent='Could not load this document. Please try again.';
      const retry=document.createElement('button');retry.type='button';retry.className='bloom-action';
      retry.textContent='Retry document';
      retry.addEventListener('click',()=>{void load();},{once:true});
      element.replaceChildren(progress,retry);
    }
  }
  return {element,load};
}
