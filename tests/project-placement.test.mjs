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

test('real desktop and phone aspect ratios keep visible identities unique while panning',()=>{
  for(const [width,height,size] of [[1920,1080,240],[390,844,156]]){
    const mgr=new ProjectPlacement(70);
    for(let step=0;step<35;step++){
      const originX=width/2-size/2-step*91;
      const originY=height/2-size/2+step*43;
      const bounds=visibleCellBounds(width,height,size,originX,originY);
      const visible=[],retained=[];
      for(let row=bounds.firstRow-2;row<=bounds.lastRow+2;row++){
        for(let col=bounds.firstColumn-2;col<=bounds.lastColumn+2;col++){
          const cell=p(col,row);
          retained.push(cell);
          if(col>=bounds.firstColumn&&col<=bounds.lastColumn&&row>=bounds.firstRow&&row<=bounds.lastRow){
            visible.push(cell);
          }
        }
      }
      mgr.sync(visible,retained);
      assert.equal(new Set(visible.map(c=>mgr.get(c))).size,visible.length);
    }
  }
});

import {sourceCell} from '../src/lib/grid-shifts.ts';

function enteringAndDeparting(move){
  if(move.axis==='row'){
    return {
      incoming:p(move.direction===1?-5:5,move.line),
      departing:p(move.direction===1?4:-4,move.line)
    };
  }
  return {
    incoming:p(move.line,move.direction===1?-3:3),
    departing:p(move.line,move.direction===1?2:-2)
  };
}
test('each of four entering edges keeps its project number and tint identity after a shift',()=>{
  for(const axis of ['row','column']){
    for(const direction of [-1,1]){
      const manager=new ProjectPlacement(45);
      const visible=box(0,0,4,2),retained=box(0,0,6,4);
      manager.sync(visible,retained);
      const move={axis,line:0,direction};
      const pair=enteringAndDeparting(move);
      const snapshots=visible.map(cell=>[cell,manager.get(cell)]);
      manager.stageEntrances([pair]);
      const projectWhileEntering=manager.get(pair.incoming);
      assert.notEqual(projectWhileEntering,undefined,`${axis} ${direction} not staged`);
      for(const [cell,oldProject] of snapshots)
        assert.equal(manager.get(cell),oldProject,'a visible tile changed at shift start');
      const source=cell=>sourceCell(cell.column,cell.row,[move]);
      const after=visible.map(source),nextBuffer=retained.map(source);
      manager.sync(after,nextBuffer);
      assert.equal(manager.get(pair.incoming),projectWhileEntering,
        `${axis} ${direction}: tile was renamed after its movement finished`);
      assert.equal(new Set(after.map(cell=>manager.get(cell))).size,45,
        `${axis} ${direction}: finishing movement produced duplicate visible projects`);
    }
  }
});
test('opposite-moving lines stage both entering projects without an end-of-shift swap',()=>{
  for(const axis of ['row','column']){
    const manager=new ProjectPlacement(45);
    const before=box(0,0,4,2),buffer=box(0,0,6,4);
    manager.sync(before,buffer);
    const moves=axis==='row'
      ?[{axis,line:0,direction:1},{axis,line:1,direction:-1}]
      :[{axis,line:0,direction:1},{axis,line:1,direction:-1}];
    const pairs=moves.map(enteringAndDeparting);
    manager.stageEntrances(pairs);
    const expected=pairs.map(pair=>manager.get(pair.incoming));
    const updated=cell=>sourceCell(cell.column,cell.row,moves);
    const after=before.map(updated);
    manager.sync(after,buffer.map(updated));
    assert.deepEqual(pairs.map(pair=>manager.get(pair.incoming)),expected);
    assert.equal(new Set(after.map(cell=>manager.get(cell))).size,45);
  }
});

test('a selected visible source keeps its identity as other tiles come and go',()=>{
  const manager=new ProjectPlacement(45);
  const original=box(0,0,4,2),band=box(0,0,6,4);
  manager.sync(original,band);
  const selected=p(4,0);
  const originalId=manager.get(selected);
  for(let step=1;step<=4;step++){
    const shiftedVisible=box(step,0,4,2);
    manager.sync(shiftedVisible,box(step,0,6,4),selected);
    assert.equal(manager.get(selected),originalId);
  }
});

test('open bloom source survives panning beyond the DOM pool and returning',()=>{
 const mgr=new ProjectPlacement(53),anchor=p(0,0);
 mgr.sync(box(0,0,2,2),box(0,0,4,4),anchor);
 const selected=mgr.get(anchor);
 for(const distance of [20,100,-80]){
  mgr.sync(box(distance,distance,2,2),box(distance,distance,4,4),anchor);
  assert.equal(mgr.get(anchor),selected,'offscreen selected identity stays pinned');
 }
 mgr.sync(box(0,0,2,2),box(0,0,4,4),anchor);
 assert.equal(mgr.get(anchor),selected);
 mgr.sync(box(100,100,2,2),box(100,100,4,4));
 assert.equal(mgr.get(anchor),undefined,'unselected distant identity can be reclaimed');
});

test('unique neutral capacity permits real repeats without identity swaps after catalog changes',()=>{
 for(const count of [12,42,43,53]){
  const manager=new ProjectPlacement(count,3),visible=box(0,0,4,2),buffer=box(0,0,6,4),history=[];
  const source=cell=>sourceCell(cell.column,cell.row,history);
  manager.sync(visible,buffer);
  for(let round=0;round<240;round++){
   const before=visible.map(source),old=new Map(before.map(c=>[c.column+','+c.row,manager.get(c)]));
   const axis=round%2?'row':'column',direction=round%4<2?1:-1;
   const move={axis,line:0,direction},pair=enteringAndDeparting(move);
   manager.stageEntrances([{incoming:source(pair.incoming),departing:source(pair.departing)}]);
   const incomingSource=source(pair.incoming),entering=manager.get(incomingSource);
   if(entering>=count)assert.ok(![...old.values()].includes(entering),'neutral entrant duplicates a still-visible neutral');
   manager.sync(before,buffer.map(source)); // Intermediate camera sync must retain a staged offscreen identity.
   assert.equal(manager.get(incomingSource),entering);
   history.push(move);const after=visible.map(source);manager.sync(after,buffer.map(source));
   const projects=after.map(c=>manager.get(c)).filter(id=>id<count);
   const neutrals=after.map(c=>manager.get(c)).filter(id=>id>=count);
   assert.equal(new Set(neutrals).size,neutrals.length,'neutral duplicated');
   assert.ok(neutrals.length<=3);
   if(count>=visible.length+1)assert.equal(new Set(projects).size,projects.length,'real repeat despite spare capacity');
   for(const c of after){const id=c.column+','+c.row;if(old.has(id))assert.equal(manager.get(c),old.get(id),'continuing tile changed identity');}
   assert.equal(manager.get(incomingSource),entering,'entering tile changed identity at settlement');
   for(const c of after){const index=manager.get(c);assert.ok(index>=0&&index<manager.capacity);}
  }
 }
});
test('long panning caps neutral tiles and preserves continuing residents despite a reduced library',()=>{
 const manager=new ProjectPlacement(20,3);
 let previous=new Map();
 for(let step=0;step<80;step++){
  const visible=box(step,Math.floor(step/9),4,2),retained=box(step,Math.floor(step/9),6,4);
  manager.sync(visible,retained);
  const projects=visible.map(c=>manager.get(c)).filter(id=>id<manager.projectCount);
  const neutral=visible.map(c=>manager.get(c)).filter(id=>id>=manager.projectCount);
  assert.ok(neutral.length<=3,'neutral walls accumulated');assert.equal(new Set(neutral).size,neutral.length);
  for(const c of visible){const k=c.column+','+c.row;if(previous.has(k))assert.equal(manager.get(c),previous.get(k));}
  previous=new Map(visible.map(c=>[c.column+','+c.row,manager.get(c)]));
 }
});

import {moduleVacancies,restingCell} from '../src/lib/bloom-geometry.ts';
import {MODULE_OFFSETS} from '../src/lib/project-modules.ts';
test('reduced catalog stays stable while visual columns beside a bloom shift',()=>{
 const holes=moduleVacancies(p(0,0),MODULE_OFFSETS),history=[],manager=new ProjectPlacement(43,3);
 const clear=cell=>!holes.some(h=>h.column===cell.column&&h.row===cell.row);
 const cells=box(0,0,4,2).filter(clear),band=box(0,0,6,4).filter(clear);
 const source=cell=>{const resting=restingCell(cell,holes);return sourceCell(resting.column,resting.row,history);};
 const pinned=p(0,0);manager.sync(cells.map(source),band.map(source),pinned);
 for(let round=0;round<100;round++){
  const move={axis:'column',line:3,direction:round%2?1:-1,vacancies:holes};
  const old=new Map(cells.map(source).map(c=>[c.column+','+c.row,manager.get(c)]));
  const pair=enteringAndDeparting(move),incoming=source(pair.incoming);
  manager.stageEntrances([{incoming,departing:source(pair.departing)}]);const expected=manager.get(incoming);
  history.push(move);const after=cells.map(source);manager.sync(after,band.map(source),pinned);
  const real=after.map(c=>manager.get(c)).filter(id=>id<43);assert.equal(new Set(real).size,real.length);
  for(const c of after){const k=c.column+','+c.row;if(old.has(k))assert.equal(manager.get(c),old.get(k));}
  assert.equal(manager.get(incoming),expected);
 }
});

// A viewport can exceed all available unique identities. Never repair this by renaming residents.
test('saturated panning never repeats a neutral while real projects may repeat',()=>{
 const manager=new ProjectPlacement(6,3);let visible=box(0,0,2,1);const band=box(0,0,4,3);
 manager.sync(visible,band);
 for(let step=0;step<100;step++){
  const neutral=visible.map(c=>manager.get(c)).filter(id=>id>=6);assert.equal(new Set(neutral).size,neutral.length);assert.ok(neutral.length<=3);
  visible=box(step+1,0,2,1);manager.sync(visible,box(step+1,0,4,3));
 }
});
test('offscreen prefetch never fills the retained band with neutral decoration',()=>{
 const manager=new ProjectPlacement(44,3),visible=box(0,0,4,2),band=box(0,0,6,4);
 manager.sync(visible,band);const keys=new Set(visible.map(c=>c.column+','+c.row));
 for(const c of band)if(!keys.has(c.column+','+c.row))assert.ok(manager.get(c)<44);
 const neutrals=visible.map(c=>manager.get(c)).filter(id=>id>=44);assert.equal(neutrals.length,1);
});

test('menu-selected offscreen source keeps its identity when another copy is still visible',()=>{
 const manager=new ProjectPlacement(44,3),visible=box(0,0,4,2),band=box(0,0,6,4);
 manager.sync(visible,band);const target=p(5,0),selected=manager.get(p(0,0));
 manager.assign(target,selected);manager.sync(visible,band,target);
 manager.sync(box(1,0,4,2),box(1,0,6,4),target);
 assert.equal(manager.get(target),selected,'pinned menu destination must not be repaired into another project');
 assert.equal(manager.get(p(0,0)),selected,'continuing resident retains its identity too');
});
