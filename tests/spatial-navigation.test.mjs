import test from 'node:test';
import assert from 'node:assert/strict';
import {spatialNeighbor} from '../src/lib/spatial-navigation.ts';
test('arrows choose distinct cardinal neighbors without activating anything',()=>{
 const center={x:0,y:0},up={x:0,y:-1},right={x:1,y:0},down={x:0,y:1},left={x:-1,y:0};
 const items=[center,up,right,down,left];
 for(const [key,expected] of [['ArrowUp',up],['ArrowRight',right],['ArrowDown',down],['ArrowLeft',left]])assert.equal(spatialNeighbor(items,center,key),expected);
 assert.equal(spatialNeighbor([center],center,'ArrowUp'),undefined);
});
test('aligned neighbors take precedence over diagonal items and reverse navigation returns',()=>{
 const center={x:0,y:0},diagonal={x:.4,y:.5},right={x:2,y:0};
 const items=[center,diagonal,right];
 assert.equal(spatialNeighbor(items,center,'ArrowRight'),right);
 assert.equal(spatialNeighbor(items,right,'ArrowLeft'),center);
});
test('navigation supports large modules and extra rows without a fixed eight-item limit',()=>{
 const items=Array.from({length:15},(_,i)=>({x:(i%3)*2,y:Math.floor(i/3)*2}));
 assert.equal(spatialNeighbor(items,items[10],'ArrowDown'),items[13]);
 assert.equal(spatialNeighbor(items,items[13],'ArrowUp'),items[10]);
 assert.equal(spatialNeighbor(items,items[14],'ArrowRight'),undefined);
});
