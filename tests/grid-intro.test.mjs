import test from 'node:test';
import assert from 'node:assert/strict';
import {INTRO_SPAWN_DURATION_MS,INTRO_SPAWN_STAGGER_MS,introSequence} from '../src/lib/grid-intro.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {ProjectPlacement} from '../src/lib/project-placement.ts';
const at=(column,row)=>({column,row});
test('each tile grows for 373ms and even a 53-tile cascade lasts under 4 seconds',()=>{
  assert.equal(INTRO_SPAWN_DURATION_MS,373);
  assert.equal(INTRO_SPAWN_STAGGER_MS,68);
  assert.ok((demoProjects.length-1)*INTRO_SPAWN_STAGGER_MS+INTRO_SPAWN_DURATION_MS<4000);
});
test('tiles spawn center-first clockwise, independently of DOM pool iteration',()=>{
  const cells=[at(1,1),at(-1,0),at(0,0),at(1,-1),at(0,-2),at(0,-1),at(-1,-1)];
  assert.deepEqual(introSequence(cells,c=>c),[
    at(0,0),at(0,-1),at(1,-1),at(1,1),at(-1,0),at(-1,-1),at(0,-2)
  ]);
  assert.deepEqual(cells[0],at(1,1));
});
test('45 initial desktop tiles spawn in assigned project-number order',()=>{
  const cells=[];
  for(let y=-2;y<=2;y++)for(let x=-4;x<=4;x++)cells.push(at(x,y));
  const placement=new ProjectPlacement(demoProjects.length);
  const retained=[];
  for(let y=-4;y<=4;y++)for(let x=-6;x<=6;x++)retained.push(at(x,y));
  placement.sync(cells,retained);
  const ordered=introSequence(cells,c=>c);
  assert.deepEqual(ordered.map(c=>placement.get(c)),Array.from({length:45},(_,i)=>i));
});
