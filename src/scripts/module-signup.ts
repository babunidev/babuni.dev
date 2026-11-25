import {safeSignupUrl,type ProjectModule} from '../lib/project-modules.ts';
/** Exactly what the framed page may do: submit its form, run its own scripts on
 * its own origin, and let reCAPTCHA ask for its own cookies after a user gesture
 * (refused with console errors otherwise). No top navigation, pop-ups or dialogs. */
export const SIGNUP_SANDBOX='allow-forms allow-scripts allow-same-origin allow-storage-access-by-user-activation';
/** Reader body of a sign-up module: a disclosure line and a button. Nothing is
 * requested from the hosted page until the button is pressed; the press puts
 * the sandboxed frame in the button's place and moves focus into it. Returns
 * null when the module's address is not an allowed sign-up page. */
export function renderSignup(module:ProjectModule):HTMLElement|null {
  const src=safeSignupUrl(module.signup?.src),title=module.signup?.title?.trim();
  if(!src||!title)return null;
  const box=document.createElement('div');box.className='module-signup';
  const note=document.createElement('p');note.className='module-signup-note';
  note.textContent='The form is hosted by EmailOctopus and uses Google reCAPTCHA.';
  const show=document.createElement('button');show.type='button';show.className='bloom-action';
  show.textContent='Show sign-up form';
  show.addEventListener('click',()=>{
    const shell=document.createElement('div');shell.className='video-frame signup-frame-shell';
    const frame=document.createElement('iframe');frame.className='signup-frame';
    // Sandbox and referrer policy are set before the address, so the first request already obeys them.
    frame.setAttribute('sandbox',SIGNUP_SANDBOX);
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.loading='lazy';frame.title=title;frame.src=src;
    shell.append(frame);box.replaceChildren(note,shell);
    frame.focus?.();
  });
  box.append(note,show);
  return box;
}
