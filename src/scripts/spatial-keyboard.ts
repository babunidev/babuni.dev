import {spatialNeighbor,type SpatialPoint,type Arrow} from '../lib/spatial-navigation.ts';
export interface KeyboardItem extends SpatialPoint {element:HTMLButtonElement;container:HTMLElement}
export function installSpatialKeyboard(surface:HTMLElement,options:{items:()=>KeyboardItem[];entry:()=>KeyboardItem|undefined;reveal:(item:KeyboardItem)=>void;blocked:()=>boolean}){
 let keyboard=false;let roving:HTMLButtonElement|null=null;
 const clear=()=>{surface.querySelectorAll('.keyboard-highlight').forEach(node=>node.classList.remove('keyboard-highlight'));if(roving)roving.tabIndex=-1;roving=null;surface.tabIndex=0;};
 function mark(element:Element){clear();const item=options.items().find(item=>item.element===element);if(item){item.container.classList.add('keyboard-highlight');roving=item.element;roving.tabIndex=0;surface.tabIndex=-1;}}
 function focus(item:KeyboardItem|undefined){if(!item)return;options.reveal(item);item.element.focus({preventScroll:true});mark(item.element);}
 function focusEntry(){focus(options.entry());}
 document.addEventListener('pointerdown',()=>{keyboard=false;clear();},{capture:true,passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboard=true;},true);
 surface.addEventListener('focusin',event=>{
  if(!keyboard)return;
  if(event.target===surface)focusEntry();else if(event.target instanceof Element)mark(event.target);
 });
 surface.addEventListener('focusout',()=>{queueMicrotask(()=>{if(!surface.contains(document.activeElement))clear();});});
 surface.addEventListener('keydown',event=>{
  const items=options.items(),current=items.find(item=>item.element===document.activeElement);
  if(event.target!==surface&&!current)return; // Leave media/links/native controls alone.
  if(event.key==='Tab'&&current&&!event.shiftKey){
   event.preventDefault();document.querySelector<HTMLButtonElement>('#projects-toggle')?.focus();return;
  }
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
   event.preventDefault();event.stopPropagation();keyboard=true;
   if(options.blocked())return;
   if(current)focus(spatialNeighbor(items,current,event.key as Arrow));else focusEntry();return;
  }
  if((event.key===' '||event.key==='Enter')&&current){
   event.preventDefault();event.stopPropagation();keyboard=true;
   if(!event.repeat&&!options.blocked())current.element.click();
  }
 });
 return {active:()=>keyboard,focusEntry,focusElement:(element:HTMLButtonElement|null)=>focus(options.items().find(item=>item.element===element))};
}
