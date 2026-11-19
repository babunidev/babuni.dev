/** Round project icon (its portal artwork) in the top-left corner of a big-bloom
 * card or the reader. Clicking it goes back one step, exactly like Escape:
 * the reader returns to the big bloom, the big bloom to the small bloom.
 * Cards skip the tab order of the spatial grid; the reader passes `focusable`. */
export function renderProjectIcon(src:string,label:string,goBack:()=>void,{focusable=false}:{focusable?:boolean}={}):HTMLButtonElement {
  const button=document.createElement('button');button.type='button';
  button.className='bloom-action project-icon';button.tabIndex=focusable?0:-1;
  button.setAttribute('aria-label',label);button.title=label;
  const image=document.createElement('img');image.src=src;image.alt='';image.decoding='async';image.draggable=false;
  button.append(image);
  button.addEventListener('click',event=>{event.stopPropagation();goBack();});
  return button;
}
