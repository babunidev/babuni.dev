import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {selectModules,moduleHasContent,moduleRevealPlan,MODULE_OFFSETS,safeEmbedUrl,videosForModule} from '../src/lib/project-modules.ts';
import {moduleVacancies,occupiedCell,restingCell} from '../src/lib/bloom-geometry.ts';
import {sourceCell,seededRandom} from '../src/lib/grid-shifts.ts';
import {shiftAvoidsBloom} from '../src/lib/grid-focus.ts';
const catalog=JSON.parse(readFileSync(new URL('../src/content/project-modules.json',import.meta.url)));
const resolve=m=>({...m,body:m.document?readFileSync(new URL('../'+m.document,import.meta.url),'utf8'):m.body});
const fixture=Array.from({length:12},(_,i)=>({id:'example-'+i,type:'text',title:'Example '+i,preview:'Preview '+i,body:'Body '+i}));
const shortFixture=fixture.slice(0,5);
test('current catalog maintains unique module IDs and existing local media assets',()=>{
 for(const [projectId,raw] of Object.entries(catalog)){
  const modules=raw.map(resolve);
  assert.equal(new Set(modules.map(m=>m.id)).size,modules.length,projectId);
  for(const m of modules){
   for(const image of m.images??[])assert.ok(existsSync(new URL('../public'+image.src,import.meta.url)),projectId);
   for(const src of videosForModule(m).flatMap(video=>[video.src,video.poster]).filter(Boolean))assert.ok(existsSync(new URL('../public'+src,import.meta.url)),projectId);
  }
 }
});
test('sample populated modules without replacement across varying content sizes',()=>{
 const selections=new Set();
 for(let seed=0;seed<40;seed++){
  const picked=selectModules(fixture,seededRandom(seed*99991+83));
  assert.equal(picked.length,8);assert.equal(new Set(picked.map(m=>m.id)).size,8);
  assert.ok(picked.every(moduleHasContent));selections.add(picked.map(m=>m.id).sort().join(','));
  const short=selectModules(shortFixture,seededRandom(seed*99991+83));
  assert.equal(short.length,shortFixture.length);assert.ok(short.every(moduleHasContent));
 }
 assert.ok(selections.size>5);
 assert.equal(selectModules([],seededRandom(1)).length,0);
 const plan=moduleRevealPlan([1,2,3,4,5,6,7,8],seededRandom(4));
 assert.equal(plan[0].delay,0);assert.equal(new Set(plan.map(r=>r.item)).size,8);
 for(let i=1;i<plan.length;i++)assert.ok(plan[i].delay-plan[i-1].delay>=260&&plan[i].delay-plan[i-1].delay<=420);
});
test('eight physical module slots plus anchor remain distinct; expansion does not overlap or move anchor',()=>{
 assert.equal(MODULE_OFFSETS.length,8);
 assert.deepEqual(new Set(MODULE_OFFSETS.map(c=>`${c.column},${c.row}`)),new Set(['-1,-1','0,-1','1,-1','-1,0','1,0','-1,1','0,1','1,1']));
 for(const anchor of [{column:0,row:0},{column:-8,row:4}])for(let count=1;count<=8;count++){
  const holes=moduleVacancies(anchor,MODULE_OFFSETS.slice(0,count));
  assert.deepEqual(occupiedCell(anchor,holes),anchor);
  for(let row=anchor.row-2;row<=anchor.row+2;row++){
   let previous=-Infinity;
   for(let col=anchor.column-8;col<=anchor.column+8;col++){
    const cell={column:col,row},visual=occupiedCell(cell,holes);
    assert.deepEqual(restingCell(visual,holes),cell);
    assert.ok(!holes.some(h=>h.column===visual.column&&h.row===row));
    assert.ok(visual.column>previous);previous=visual.column;
    for(const progress of [0,.25,.5,.75,1]){
     const next=occupiedCell({column:col+1,row},holes);
     assert.ok((col+1+(next.column-col-1)*progress)-(col+(visual.column-col)*progress)>=1);
    }
   }
  }
  for(const line of [anchor.column-4,anchor.column+4])for(const direction of [-1,1]){
   const move={axis:'column',line,direction,vacancies:holes};assert.ok(shiftAvoidsBloom(move,anchor,holes));
   for(let row=anchor.row-3;row<=anchor.row+3;row++){
    const start=restingCell({column:line,row},holes),end=restingCell({column:line,row:row+direction},holes);
    assert.deepEqual(sourceCell(end.column,end.row,[move]),start);
   }
  }
 }
});
test('external embeds must be explicit HTTPS player URLs',()=>{
 assert.ok(safeEmbedUrl('https://www.youtube-nocookie.com/embed/abc-123'));
 assert.ok(safeEmbedUrl('https://player.vimeo.com/video/1234'));
 for(const url of ['javascript:alert(1)','http://player.vimeo.com/video/12','https://example.com/embed/x','https://www.youtube-nocookie.com/watch?v=x'])assert.equal(safeEmbedUrl(url),null);
 assert.equal(moduleHasContent({type:'video',video:{embed:'javascript:bad'}}),false);
});

test('video modules accept safe embeds and reject empty collections',()=>{
 assert.ok(moduleHasContent({type:'video',videos:[{title:'Embedded',embed:'https://www.youtube-nocookie.com/embed/abc'}]}));
 assert.equal(moduleHasContent({type:'video',videos:[]}),false);
});
