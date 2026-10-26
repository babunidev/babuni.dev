import test from 'node:test';
import assert from 'node:assert/strict';
import {spiralIndex,visibleCellBounds,ProjectPlacement} from '../src/lib/project-placement.ts';
const p=(column,row)=>({column,row});
const spiral=[p(0,0),p(0,-1),p(1,-1),p(1,0),p(1,1),p(0,1),p(-1,1),p(-1,0),p(-1,-1),p(0,-2),p(1,-2),p(2,-2)];
const box=(cx,cy,halfX,halfY)=>{
  const list=[];
  for(let y=cy-halfY;y<=cy+halfY;y++)for(let x=cx-halfX;x<=cx+halfX;x++)list.push(p(x,y));
  return list;
};
test('clockwise spiral follows the creator specified center and first two rings',()=>{
  assert.deepEqual(spiral.map(c=>spiralIndex(c.column,c.row)),spiral.map((_,i)=>i));
  assert.equal(spiralIndex(-2,-2),23);
  assert.equal(spiralIndex(-2,-1),22);
  assert.equal(spiralIndex(-2,0),21);
  assert.equal(spiralIndex(0,2),17);
  assert.equal(spiralIndex(0,-3),25);
});
test('initial 3x3 follows the exact spiral and preserves the center',()=>{
  const mgr=new ProjectPlacement(13);
  mgr.sync(box(0,0,1,1),box(0,0,3,3));
  assert.deepEqual(spiral.slice(0,9).map(c=>mgr.get(c)),[0,1,2,3,4,5,6,7,8]);
});
test('five projects fill tiles and repeat in spiral order without filler',()=>{
  const mgr=new ProjectPlacement(5);
  mgr.sync(box(0,0,2,2),box(0,0,4,4));
  for(let i=0;i<spiral.length;i++)assert.equal(mgr.get(spiral[i]),i%5);
});
test('sufficient projects remain unique in the viewport during extensive panning',()=>{
  const mgr=new ProjectPlacement(100);
  for(let cx=0;cx<15;cx++){
    const visible=box(cx,0,4,2),retained=box(cx,0,6,4);
    mgr.sync(visible,retained);
    assert.equal(new Set(visible.map(c=>mgr.get(c))).size,visible.length);
  }
});
test('even exactly as many projects as visible tiles preserves no-duplicate rule',()=>{
  const mgr=new ProjectPlacement(45);
  for(let cx=0;cx<20;cx++){
    const visible=box(cx,0,4,2),retained=box(cx,0,6,4);
    mgr.sync(visible,retained);
    assert.equal(new Set(visible.map(c=>mgr.get(c))).size,45);
  }
});
test('an out-of-view tile is retained for two tiles and released beyond the buffer',()=>{
  const mgr=new ProjectPlacement(100);
  mgr.sync(box(0,0,1,1),box(0,0,3,3));
  const original=mgr.get(p(0,0));
  mgr.sync(box(2,0,1,1),box(2,0,3,3));
  assert.equal(mgr.get(p(0,0)),original);
  mgr.sync(box(5,0,1,1),box(5,0,3,3));
  assert.equal(mgr.get(p(0,0)),undefined);
});
test('reentering the buffer preserves a resident project identity',()=>{
  const mgr=new ProjectPlacement(90);
  const original=box(0,0,4,2),band=box(0,0,6,4);
  mgr.sync(original,band);
  const center=mgr.get(p(0,0));
  mgr.sync(box(1,0,4,2),box(1,0,6,4));
  mgr.sync(original,band);
  assert.equal(mgr.get(p(0,0)),center);
});
test('shifted row retains source project identity and uniqueness',()=>{
  const mgr=new ProjectPlacement(80);
  const cells=box(0,0,2,2);
  mgr.sync(cells,box(0,0,4,4));
  const origin=mgr.get(p(0,0));
  const shifted=cells.map(c=>c.row===0?p(c.column-1,c.row):c);
  const band=box(0,0,4,4).map(c=>c.row===0?p(c.column-1,c.row):c);
  mgr.sync(shifted,band);
  assert.equal(mgr.get(p(0,0)),origin);
  assert.equal(new Set(shifted.map(c=>mgr.get(c))).size,cells.length);
});

test('both viewport edges detect a newly entering partially visible tile',()=>{
  const before=visibleCellBounds(385,900,240,0,0);
  const after=visibleCellBounds(385,900,240,-100,0);
  assert.equal(before.firstColumn,after.firstColumn);
  assert.notEqual(before.lastColumn,after.lastColumn);
});
