/** Development screenshots published by scripts/import-screenshots.mjs. A journal links the full
 * image, on babuni.dev or root-relative; the reader shows its thumbnail and opens it large. */
const SCREENSHOT=/^(?:https:\/\/(?:www\.)?babuni\.dev)?(\/media\/[a-z0-9]+(?:-[a-z0-9]+)*\/screenshots\/\d{4}-\d{2}-\d{2}\/)([a-z0-9]+(?:-[a-z0-9]+)*\.webp)$/;

/** Same-origin full and thumbnail paths of a published screenshot, or null for any other image. */
export function screenshotImage(href:string):{src:string;thumb:string}|null {
  const match=SCREENSHOT.exec(href.trim());
  return match?{src:match[1]+match[2],thumb:match[1]+'thumbs/'+match[2]}:null;
}

/** A small button with the thumbnail; activating it shows the full screenshot above the reader. */
export function renderScreenshotThumb(src:string,thumb:string,alt:string):HTMLButtonElement {
  const button=document.createElement('button');button.type='button';button.className='screenshot-thumb';
  button.setAttribute('aria-label',(alt||'Screenshot')+' — open large');
  const img=document.createElement('img');img.src=thumb;img.alt=alt;img.loading='lazy';img.decoding='async';
  button.append(img);
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openLightbox(src,alt,button);});
  return button;
}

/** A click anywhere, Escape or Close returns to the reader at the same scroll position. */
export function openLightbox(src:string,alt:string,trigger?:HTMLElement):HTMLDialogElement {
  const view=document.createElement('dialog');view.className='image-lightbox';view.setAttribute('aria-label',alt||'Screenshot');
  const figure=document.createElement('figure');
  const img=document.createElement('img');img.src=src;img.alt=alt;img.decoding='async';figure.append(img);
  if(alt){const caption=document.createElement('figcaption');caption.textContent=alt;figure.append(caption);}
  const close=document.createElement('button');close.type='button';close.className='image-lightbox-close';
  close.textContent='×';close.setAttribute('aria-label','Close image');
  view.append(close,figure);
  view.addEventListener('click',event=>{event.stopPropagation();view.close();});
  view.addEventListener('cancel',event=>event.stopPropagation());
  view.addEventListener('close',()=>{view.remove();trigger?.focus({preventScroll:true});},{once:true});
  document.body.append(view);view.showModal();close.focus({preventScroll:true});
  return view;
}
