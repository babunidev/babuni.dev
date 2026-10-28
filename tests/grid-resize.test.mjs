import test from 'node:test';
import assert from 'node:assert/strict';
import {resizedPan,gridWindow,tileSizeForWidth} from '../src/lib/grid-math.ts';
test('responsive resize keeps logical map center through desktop, laptop and phone sizes',()=>{
 let size=240,pan={x:613,y:-947};const logical={x:.5-pan.x/size,y:.5-pan.y/size};
 for(const width of [900,390,1440,580,1024]){
  const next=tileSizeForWidth(width);pan=resizedPan(pan,size,next);size=next;
  assert.ok(Math.abs((.5-pan.x/size)-logical.x)<1e-10);assert.ok(Math.abs((.5-pan.y/size)-logical.y)<1e-10);
  const frame=gridWindow({width,height:700,tileSize:size,panX:pan.x,panY:pan.y,bufferCells:2});
  assert.ok(Number.isFinite(frame.originX));assert.ok(frame.columns>0);
 }
});
test('in-flight camera endpoints retain their progress and selected anchor on resize',()=>{
 const from={x:100,y:200},to={x:-960,y:480},progress=.43;
 const before={x:from.x+(to.x-from.x)*progress,y:from.y+(to.y-from.y)*progress};
 const a=resizedPan(from,240,156),b=resizedPan(to,240,156),current=resizedPan(before,240,156);
 assert.ok(Math.abs(current.x-(a.x+(b.x-a.x)*progress))<1e-10);
 assert.ok(Math.abs(current.y-(a.y+(b.y-a.y)*progress))<1e-10);
});
