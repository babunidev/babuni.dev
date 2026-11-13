import type {ProjectModule} from '../lib/project-modules.ts';
/** Renders a resources module's scannable code as a link to its first destination, with an optional hint. */
export function appendModuleQr(content:HTMLElement,module:ProjectModule){
  const target=module.links?.[0];if(!module.qr||!target)return;
  const link=document.createElement('a');link.className='module-qr';link.href=target.href;link.target='_blank';link.rel='noopener noreferrer';link.tabIndex=-1;
  const image=document.createElement('img');image.src=module.qr.src;image.alt=module.qr.alt;image.width=180;image.height=180;image.decoding='async';image.draggable=false;
  link.append(image);content.append(link);
  if(module.qr.caption){const hint=document.createElement('p');hint.className='module-qr-hint';hint.textContent=module.qr.caption;content.append(hint);}
}
