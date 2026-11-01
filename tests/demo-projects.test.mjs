import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects,DEMO_PROJECT_COUNT} from '../src/lib/demo-projects.ts';
import {gridWindow} from '../src/lib/grid-math.ts';
import {ProjectPlacement,visibleCellBounds,spiralIndex} from '../src/lib/project-placement.ts';

test('project inventory has valid unique identities without freezing its size or prose',()=>{
 assert.equal(DEMO_PROJECT_COUNT,demoProjects.length);
 assert.ok(demoProjects.length>0);
 assert.equal(demoProjects[0].id,'babuni-dev');
 assert.equal(new Set(demoProjects.map(p=>p.id)).size,demoProjects.length);
 assert.equal(new Set(demoProjects.map(p=>p.name)).size,demoProjects.length);
 for(const p of demoProjects){
  assert.match(p.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(typeof p.name==='string'&&p.name.trim());
  assert.ok(typeof p.shortSummary==='string'&&p.shortSummary.trim());
  assert.ok(p.evidence&&p.tint);
 }
});

test('desktop spiral places the current catalog without fixed editorial positions',()=>{
 const width=1920,height=1080,tileSize=240;
 const window=gridWindow({width,height,tileSize,panX:0,panY:0,bufferCells:2});
 const b=visibleCellBounds(width,height,tileSize,window.originX,window.originY);
 const visible=[],retained=[];
 for(let row=b.firstRow-2;row<=b.lastRow+2;row++)
  for(let column=b.firstColumn-2;column<=b.lastColumn+2;column++){
   const cell={column,row};retained.push(cell);
   if(column>=b.firstColumn&&column<=b.lastColumn&&row>=b.firstRow&&row<=b.lastRow)visible.push(cell);
  }
 assert.equal(visible.length,45); // Geometry of this viewport, not a project count.
 const planner=new ProjectPlacement(demoProjects.length,3);
 planner.sync(visible,retained);
 const ids=visible.map(cell=>planner.get(cell)).filter(x=>x!==undefined&&x<demoProjects.length);
 assert.equal(new Set(ids).size,Math.min(visible.length,demoProjects.length));
 assert.equal(planner.get({column:0,row:0}),0);
 assert.deepEqual(visible.slice().sort((a,b)=>spiralIndex(a.column,a.row)-spiralIndex(b.column,b.row)).map(cell=>planner.get(cell)),
  Array.from({length:visible.length},(_,i)=>i<(DEMO_PROJECT_COUNT+3)?i:i-(DEMO_PROJECT_COUNT+3)));
});
