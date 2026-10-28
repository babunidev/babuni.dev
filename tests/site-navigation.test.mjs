import test from 'node:test';
import assert from 'node:assert/strict';
import {matchingProjects,attachReaderHeader} from '../src/scripts/site-navigation.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {ProjectPlacement} from '../src/lib/project-placement.ts';
test('project search covers every stable project, ignores case and matches all words',()=>{
 assert.equal(matchingProjects('').length,demoProjects.length);
 assert.equal(new Set(matchingProjects('').map(p=>p.id)).size,demoProjects.length);
 assert.deepEqual(matchingProjects(' WORK god ').map(p=>p.id),['workthatgodbod']);
 assert.equal(matchingProjects('does-not-exist').length,0);
 assert.ok(matchingProjects('hydration').some(p=>p.name==='WorkThatGodBod'));
});
test('header moves into the reader and returns to its exact original sibling position',t=>{
 const previous=globalThis.document;t.after(()=>{globalThis.document=previous;});
 const sibling={},parent={insertBefore(node,next){this.restored=[node,next];}};
 const header={parentNode:parent,nextSibling:sibling};let attached;
 globalThis.document={querySelector:()=>header};
 const restore=attachReaderHeader({append(node){attached=node;}});
 assert.equal(attached,header);restore();assert.deepEqual(parent.restored,[header,sibling]);
});
test('direct navigation reserves a missing project without disturbing other cells',()=>{
 const placement=new ProjectPlacement(3);
 placement.assign({column:0,row:0},0);placement.assign({column:5,row:0},2);
 placement.sync([{column:5,row:0}],[{column:0,row:0},{column:5,row:0}],{column:5,row:0});
 assert.equal(placement.get({column:5,row:0}),2);assert.equal(placement.get({column:0,row:0}),0);
 assert.throws(()=>placement.assign({column:1,row:0},3),RangeError);
});
test('direct reservation replaces a stale buffered identity before camera recycling',()=>{
 const placement=new ProjectPlacement(4),source={column:5,row:0};
 placement.assign(source,1);placement.assign({column:0,row:0},0);
 placement.assign(source,3);
 placement.sync([{column:0,row:0}],[{column:0,row:0}],source);
 assert.equal(placement.get(source),3);
 placement.sync([source],[source,{column:6,row:0}],source);
 assert.equal(placement.get(source),3);
});

test('renamed and newly added projects are directly findable; fillers are not projects',()=>{
 assert.equal(matchingProjects('Rocket Game 42')[0].id,'rocket-game-42');
 assert.equal(matchingProjects('Worldbuilding')[0].id,'morkahjaworld');
 assert.ok(matchingProjects('Roar Guild').some(p=>p.id==='roar-guild-and-community'&&p.name==='Roar Guild'));
 assert.equal(matchingProjects('placeholder').length,0);
 assert.equal(matchingProjects('').length,43);
});
