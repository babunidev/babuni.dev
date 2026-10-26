import test from 'node:test';
import assert from 'node:assert/strict';
import {bigBloomLayout} from '../src/lib/big-bloom.ts';
import {seededRandom} from '../src/lib/grid-shifts.ts';
const modules=Array.from({length:27},(_,index)=>({id:'m'+index,type:'text',title:'Module '+index,body:'Content'}));
test('big bloom contains every populated module, selected at center, with nonoverlapping stable cells',()=>{
 for(let seed=0;seed<40;seed++){
  const layout=bigBloomLayout([...modules,{id:'empty',type:'text',body:''}],'m17',seededRandom(seed));
  assert.equal(layout.length,27);assert.equal(layout[0].module.id,'m17');
  assert.equal(layout[0].column,0);assert.equal(layout[0].row,0);
  assert.equal(new Set(layout.map(item=>item.module.id)).size,27);
  assert.equal(new Set(layout.map(item=>`${item.column},${item.row}`)).size,27);
  assert.deepEqual(layout,bigBloomLayout(modules,'m17',seededRandom(seed)));
 }
 assert.notDeepEqual(bigBloomLayout(modules,'m17',seededRandom(2)).slice(1),bigBloomLayout(modules,'m17',seededRandom(3)).slice(1));
});
test('empty collections and missing selection have safe fallbacks without modifying source order',()=>{
 assert.deepEqual(bigBloomLayout([],'missing'),[]);
 const ids=modules.map(m=>m.id);assert.equal(bigBloomLayout(modules,'missing')[0].module.id,'m0');
 assert.deepEqual(modules.map(m=>m.id),ids);
});

import {bigBloomVacancies,bigModuleCell,bigBloomRevealPlan,moduleIntro} from '../src/lib/big-bloom.ts';
import {occupiedCell,restingCell,moduleVacancies} from '../src/lib/bloom-geometry.ts';
import {MODULE_OFFSETS} from '../src/lib/project-modules.ts';
import {spiralIndex} from '../src/lib/project-placement.ts';
import {gridWindow} from '../src/lib/grid-math.ts';
import {sourceCell} from '../src/lib/grid-shifts.ts';
import {shiftAvoidsBloom} from '../src/lib/grid-focus.ts';
test('first nine use the site spiral; extra modules extend only down in three columns',()=>{
 const layout=bigBloomLayout(modules,'m17',seededRandom(4));
 for(let index=0;index<9;index++)assert.equal(spiralIndex(layout[index].column,layout[index].row),index);
 layout.slice(9).forEach((entry,index)=>{assert.equal(entry.row,2+Math.floor(index/3));assert.equal(entry.column,index%3-1);});
 const plan=bigBloomRevealPlan(layout,seededRandom(6));
 assert.deepEqual(plan.map(item=>item.item),layout);assert.equal(plan[0].delay,0);
 for(let index=1;index<plan.length;index++)assert.ok(plan[index].delay-plan[index-1].delay>=260&&plan[index].delay-plan[index-1].delay<=420);
});
test('2×2 footprints clear every covered cell except the one deliberate original anchor overlay',()=>{
 for(const anchor of [{column:0,row:0},{column:-12,row:8}])for(const count of [1,2,5,8,9,10,17,27]){
  const layout=bigBloomLayout(modules.slice(0,count),'m0',seededRandom(count));
  const holes=bigBloomVacancies(anchor,layout),covered=new Set();
  assert.equal(holes.length,4*count-1);
  for(const entry of layout){const start=bigModuleCell(anchor,entry);for(let y=0;y<2;y++)for(let x=0;x<2;x++){
   const key=`${start.column+x},${start.row+y}`;assert.ok(!covered.has(key));covered.add(key);
  }}
  assert.deepEqual(occupiedCell(anchor,holes),anchor);
  const small=moduleVacancies(anchor,MODULE_OFFSETS.slice(0,Math.min(count,8)));
  for(let row=anchor.row-5;row<=anchor.row+20;row++)for(let column=anchor.column-10;column<=anchor.column+10;column++){
   const cell={column,row},visual=occupiedCell(cell,holes);assert.deepEqual(restingCell(visual,holes),cell);
   assert.ok(!holes.some(h=>h.column===visual.column&&h.row===visual.row));
   assert.equal(covered.has(`${visual.column},${visual.row}`),column===anchor.column&&row===anchor.row);
   for(const progress of [0,.25,.5,.75,1]){
    const from=occupiedCell(cell,small),nextFrom=occupiedCell({column:column+1,row},small),next=occupiedCell({column:column+1,row},holes);
    assert.ok((1-progress)*(nextFrom.column-from.column)+progress*(next.column-visual.column)>=1);
   }
  }
  for(const line of [anchor.column-3,anchor.column+4])for(const direction of [-1,1]){
   const move={axis:'column',line,direction,vacancies:holes};assert.ok(shiftAvoidsBloom(move,anchor,holes));
   for(let row=anchor.row-5;row<anchor.row+22;row++){
    const start=restingCell({column:line,row},holes),end=restingCell({column:line,row:row+direction},holes);
    assert.deepEqual(sourceCell(end.column,end.row,[move]),start);
   }
  }
 }
});
test('bounded horizontal staging covers the visible grid outside large reservations while panning',()=>{
 const holes=bigBloomVacancies({column:0,row:0},bigBloomLayout(modules,'m0'));
 for(const [width,height,tileSize] of [[1280,720,240],[390,844,156]])for(const panX of [-2000,-240,0,900])for(const panY of [-1800,0,300]){
  const frame=gridWindow({width,height,tileSize,panX,panY,bufferCells:2,columnBufferCells:6}),occupied=new Set();
  for(let y=0;y<frame.rows;y++)for(let x=0;x<frame.columns;x++){
   const cell=occupiedCell({column:frame.firstColumn+x,row:frame.firstRow+y},holes);occupied.add(`${cell.column},${cell.row}`);
  }
  for(let row=Math.floor(-frame.originY/tileSize);row<Math.ceil((height-frame.originY)/tileSize);row++)
   for(let column=Math.floor(-frame.originX/tileSize);column<Math.ceil((width-frame.originX)/tileSize);column++){
    const reserved=holes.some(h=>h.column===column&&h.row===row);
    assert.equal(occupied.has(`${column},${row}`),!reserved);
   }
 }
});
test('large text preview progressively reveals real body content with bounded length',()=>{
 const module={preview:'Tiny teaser.',body:'# Title\n\nA real introduction with content. '+('More source words. '.repeat(200))};
 const intro=moduleIntro(module);
 assert.ok(intro.startsWith('A real introduction'));assert.ok(intro.length>module.preview.length);assert.ok(intro.length<=1601);
 assert.equal(moduleIntro({preview:'Fallback'}),'Fallback');
});
