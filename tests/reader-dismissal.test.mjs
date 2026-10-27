import test from 'node:test';
import assert from 'node:assert/strict';
import {installReaderDismissal} from '../src/scripts/reader-dismissal.ts';
class Dialog extends EventTarget {
 getBoundingClientRect(){return {left:100,top:100,right:500,bottom:500};}
}
function setup(){
 const view=new Dialog();let dismissals=0;
 installReaderDismissal(view,()=>{dismissals++;});
 const send=(type,x=50,y=50,extra={})=>{
  const event=new Event(type,{cancelable:true});Object.assign(event,{clientX:x,clientY:y,button:0,isPrimary:true,...extra});
  view.dispatchEvent(event);return event;
 };
 return {view,send,count:()=>dismissals};
}
test('intentional clicks on any of the four backdrop margins dismiss and consume the click',()=>{
 for(const [x,y] of [[50,250],[550,250],[250,50],[250,550]]){
  const s=setup();s.send('pointerdown',x,y);const click=s.send('click',x,y);
  assert.equal(s.count(),1);assert.equal(click.defaultPrevented,true);
 }
});
test('content/padding clicks and dragging text outside never dismiss',()=>{
 const s=setup();
 s.send('pointerdown',250,250);s.send('click',250,250);assert.equal(s.count(),0);
 s.send('pointerdown',250,250);s.send('click',50,50);assert.equal(s.count(),0);
 s.send('pointerdown',50,50);s.send('click',250,250);assert.equal(s.count(),0);
});
test('cancelled, secondary and synthetic clicks do not dismiss',()=>{
 const s=setup();
 s.send('click');
 s.send('pointerdown',50,50,{button:2});s.send('click',50,50,{button:2});
 s.send('pointerdown',50,50,{isPrimary:false});s.send('click');
 s.send('pointerdown');s.send('pointercancel');s.send('click');
 assert.equal(s.count(),0);
});
test('Escape cancellation returns through the same dismissal path',()=>{
 const s=setup();const event=s.send('cancel');assert.equal(s.count(),1);assert.equal(event.defaultPrevented,true);
});
