/** Only an intentional primary click that starts and ends on the backdrop closes. */
export function installReaderDismissal(view:HTMLDialogElement,dismiss:()=>void):void {
  let startedOutside=false;
  const outside=(event:MouseEvent)=>{
    if(event.target!==view)return false;
    const box=view.getBoundingClientRect();
    return event.clientX<box.left||event.clientX>=box.right||event.clientY<box.top||event.clientY>=box.bottom;
  };
  view.addEventListener('pointerdown',event=>{
    startedOutside=event.isPrimary&&event.button===0&&outside(event);
  });
  view.addEventListener('pointercancel',()=>{startedOutside=false;});
  view.addEventListener('click',event=>{
    const shouldDismiss=startedOutside&&event.button===0&&outside(event);
    startedOutside=false;
    if(!shouldDismiss)return;
    event.preventDefault();event.stopPropagation();dismiss();
  });
  view.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
}
