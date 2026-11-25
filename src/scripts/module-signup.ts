import {safeSignupUrl,type ProjectModule} from '../lib/project-modules.ts';
/** Exactly what the framed page may do: submit its form, run its own scripts on
 * its own origin, and let reCAPTCHA ask for its own cookies after a user gesture
 * (refused with console errors otherwise). No top navigation, pop-ups or dialogs. */
export const SIGNUP_SANDBOX='allow-forms allow-scripts allow-same-origin allow-storage-access-by-user-activation';
/** The hosted page lays its text above its form at this width and fits in a
 * square of it; smaller boxes show the page scaled down instead of scrolling. */
export const SIGNUP_FIT_SIZE=440;
/** Scale that shows a SIGNUP_FIT_SIZE square page whole inside a width × height box. */
export function signupScale(width:number,height:number):number {
  if(!(width>0&&height>0))return 1;
  return Math.min(1,Math.min(width,height)/SIGNUP_FIT_SIZE);
}
/** The sandboxed frame of a module's sign-up page, or null when its address is not allowed. */
export function createSignupFrame(module:ProjectModule):{shell:HTMLElement;frame:HTMLIFrameElement}|null {
  const src=safeSignupUrl(module.signup?.src),title=module.signup?.title?.trim();
  if(!src||!title)return null;
  const shell=document.createElement('div');shell.className='video-frame signup-frame-shell';
  const frame=document.createElement('iframe');frame.className='signup-frame';
  // Sandbox and referrer policy are set before the address, so the first request already obeys them.
  frame.setAttribute('sandbox',SIGNUP_SANDBOX);
  frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.loading='lazy';frame.title=title;frame.src=src;
  shell.append(frame);
  return {shell,frame};
}
/** Keeps the whole page visible in a box of any size: the frame is laid out at
 * the box size divided by the scale, then scaled down to the box. */
function fitToShell(shell:HTMLElement,frame:HTMLIFrameElement):void {
  if(typeof ResizeObserver==='undefined')return;
  new ResizeObserver(()=>{
    const width=shell.clientWidth,height=shell.clientHeight,scale=signupScale(width,height);
    frame.style.width=width/scale+'px';frame.style.height=height/scale+'px';
    frame.style.transform=scale<1?`scale(${scale})`:'';
  }).observe(shell);
}
/** Big-bloom card body: only the form, filling the card. A visually hidden
 * button is the card's keyboard stop; Enter on it moves focus into the form. */
export function renderSignupCard(module:ProjectModule,content:HTMLElement):HTMLButtonElement|null {
  const signup=createSignupFrame(module);if(!signup)return null;
  signup.shell.className+=' signup-card-frame';fitToShell(signup.shell,signup.frame);
  const enter=document.createElement('button');enter.type='button';
  enter.className='bloom-read-more signup-enter';enter.tabIndex=-1;
  enter.textContent='Go to the sign-up form';enter.setAttribute('aria-label','Go to the sign-up form: '+module.title);
  enter.addEventListener('click',event=>{event.stopPropagation();signup.frame.focus();});
  content.replaceChildren(signup.shell);
  return enter;
}
/** Reader body of a sign-up module: a disclosure line and the form. */
export function renderSignup(module:ProjectModule):HTMLElement|null {
  const signup=createSignupFrame(module);if(!signup)return null;
  const box=document.createElement('div');box.className='module-signup';
  const note=document.createElement('p');note.className='module-signup-note';
  note.textContent='The form is hosted by EmailOctopus and uses Google reCAPTCHA.';
  box.append(note,signup.shell);
  return box;
}
