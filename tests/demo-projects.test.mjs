import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects,DEMO_PROJECT_COUNT} from '../src/lib/demo-projects.ts';
import {gridWindow} from '../src/lib/grid-math.ts';
import {ProjectPlacement,visibleCellBounds} from '../src/lib/project-placement.ts';
test('45 unique demo identities from BABUNI.DEV to PROJECT 45',()=>{
 assert.equal(DEMO_PROJECT_COUNT,45);
 assert.equal(demoProjects.length,45);
 assert.equal(demoProjects[0].name,'BABUNI.DEV');
 assert.equal(demoProjects[1].name,'PROJECT 02');
 assert.equal(demoProjects[44].name,'PROJECT 45');
 assert.equal(new Set(demoProjects.map(p=>p.name)).size,45);
});
test('the initial 1920x1080 spiral contains exactly 45 unique visible projects',()=>{
 const width=1920,height=1080,tileSize=240;
 const window=gridWindow({width,height,tileSize,panX:0,panY:0,bufferCells:2});
 const b=visibleCellBounds(width,height,tileSize,window.originX,window.originY);
 const visible=[],retained=[];
 for(let row=b.firstRow-2;row<=b.lastRow+2;row++)
  for(let column=b.firstColumn-2;column<=b.lastColumn+2;column++){
   const cell={column,row};retained.push(cell);
   if(column>=b.firstColumn&&column<=b.lastColumn&&row>=b.firstRow&&row<=b.lastRow)visible.push(cell);
  }
 assert.equal(visible.length,45);
 const planner=new ProjectPlacement(demoProjects.length);
 planner.sync(visible,retained);
 assert.equal(new Set(visible.map(cell=>planner.get(cell))).size,45);
 assert.equal(planner.get({column:0,row:0}),0);
 assert.equal(planner.get({column:0,row:-1}),1);
 assert.equal(planner.get({column:1,row:-1}),2);
 assert.equal(planner.get({column:0,row:-2}),9);
});
