import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects,DEMO_PROJECT_COUNT} from '../src/lib/demo-projects.ts';
import {gridWindow} from '../src/lib/grid-math.ts';
import {ProjectPlacement,visibleCellBounds,spiralIndex} from '../src/lib/project-placement.ts';

test('exactly 44 retained project entries have unique provisional IDs and summaries',()=>{
  assert.equal(DEMO_PROJECT_COUNT,44);
  assert.equal(demoProjects.length,44);
  assert.equal(demoProjects[0].name,'BABUNI.DEV');
  assert.deepEqual(demoProjects.slice(1,5).map(x=>x.name),[
    'Button Game','SocialForever','RoarForever','FlourishForever'
  ]);
  assert.equal(demoProjects.at(-1).name,'Babuni Gaming');
  assert.equal(new Set(demoProjects.map(x=>x.id)).size,44);
  assert.equal(new Set(demoProjects.map(x=>x.name)).size,44);
  assert.ok(demoProjects.every(x=>x.id&&x.shortSummary&&x.evidence&&x.tint));
  assert.ok(demoProjects.every(x=>!/^PROJECT \d+$/.test(x.name)));
});
test('candidate descriptions and evidence are snapshots of the provisional inventory',()=>{
  assert.match(demoProjects[1].shortSummary,/Android reaction game/);
  assert.equal(demoProjects[1].evidence,'repo');
  assert.equal(demoProjects.find(p=>p.id==='buxbrewding').evidence,'name-only');
  assert.equal(demoProjects.find(p=>p.id==='morkahjaworld').evidence,'human-confirmed');
});
test('initial desktop fills 45 visible cells with the retained library in spiral order',()=>{
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
 const planner=new ProjectPlacement(demoProjects.length,3);
 planner.sync(visible,retained);
 const names=visible.map(cell=>demoProjects[planner.get(cell)]?.name);
 assert.equal(new Set(names.filter(Boolean)).size,Math.min(visible.length,demoProjects.length));
 assert.equal(demoProjects[planner.get({column:0,row:0})].name,'BABUNI.DEV');
 assert.equal(demoProjects[planner.get({column:0,row:-1})].name,'Button Game');
 assert.equal(demoProjects[planner.get({column:1,row:-1})].name,'SocialForever');
 assert.equal(demoProjects[planner.get({column:0,row:-2})].name,'FavorCraft');
 assert.deepEqual(visible
   .slice().sort((a,b)=>spiralIndex(a.column,a.row)-spiralIndex(b.column,b.row))
   .map(cell=>planner.get(cell)),Array.from({length:45},(_,i)=>i));
});

test('human-withdrawn entries are absent and BABUNI keeps the collaboration documents',()=>{
 for(const id of ['wow-forever-talent-design-atlas','redridge-recipe-planner','human-ai-development-journal','morkahja-world-and-peoples','the-amberbrew-family','practical-templates-creator','warehouse-performance-model','guildchatai','dual-pc-streaming-setup','mech-arena','local-prompt-lab','morkahja-admin-console','fantasy-rpg-assets'])assert.equal(demoProjects.some(p=>p.id===id),false);
 assert.equal(demoProjects.filter(p=>p.id==='morkahjaworld').length,1);
 assert.match(demoProjects.find(p=>p.id==='morkahjaworld').shortSummary,/Worldbuilding/);
});
