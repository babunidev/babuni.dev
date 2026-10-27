/** Keep the modal and its header alive until the reading panel has shrunk.
 * Cancellation lets direct navigation replace a closing reader safely. */
export function shrinkReader(panel:HTMLElement,reduced:boolean,finish:()=>void):()=>void {
  if(reduced||!panel.animate){finish();return ()=>{};}
  let active=true;
  const animation=panel.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.96)'}],
    {duration:420,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
  const complete=()=>{if(active){active=false;finish();}};
  void animation.finished.then(complete,complete);
  return ()=>{active=false;animation.cancel();};
}
