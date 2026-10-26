/** Immediate acknowledgement only: never delays an action or changes motion. */
export function installInteractionFeedback():void {
  const timers=new WeakMap<HTMLElement,ReturnType<typeof setTimeout>>();
  function acknowledge(target:EventTarget|null){
    if(!(target instanceof Element))return;
    const control=target.closest<HTMLElement>('.tile-select,.bloom-action,.bloom-close');
    if(!control||control.matches(':disabled'))return;
    const previous=timers.get(control);if(previous)clearTimeout(previous);
    control.classList.add('is-pressed');
    timers.set(control,setTimeout(()=>{control.classList.remove('is-pressed');timers.delete(control);},240));
  }
  document.addEventListener('pointerdown',event=>{
    if(event.isPrimary&&event.button===0)acknowledge(event.target);
  },{capture:true,passive:true});
  document.addEventListener('keydown',event=>{
    if(!event.repeat&&(event.key==='Enter'||event.key===' '))acknowledge(event.target);
  },{capture:true});
}
