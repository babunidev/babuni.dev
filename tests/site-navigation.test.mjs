import test from 'node:test';
import assert from 'node:assert/strict';
import {matchingProjects,attachReaderHeader,projectUpdatedAt,updatedLabel} from '../src/scripts/site-navigation.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {ProjectPlacement} from '../src/lib/project-placement.ts';
test('project search finds current catalog entries regardless of naming',()=>{
 assert.equal(matchingProjects('').length,demoProjects.length);
 assert.equal(new Set(matchingProjects('').map(p=>p.id)).size,demoProjects.length);
 for(const p of demoProjects)assert.ok(matchingProjects(p.name).some(x=>x.id===p.id),p.name);
 assert.equal(matchingProjects('does-not-exist').length,0);
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

test('menu lists every project once, most recently updated first, and respects searching',()=>{
 const ids=matchingProjects('').map(p=>p.id);
 assert.deepEqual(ids.slice().sort(),demoProjects.map(p=>p.id).sort());
 const times=matchingProjects('').map(p=>projectUpdatedAt(p.id)?.getTime()??null);
 const dated=times.filter(t=>t!==null);
 assert.deepEqual(dated,dated.slice().sort((a,b)=>b-a),'newest first');
 assert.ok(times.indexOf(null)===-1||times.slice(times.indexOf(null)).every(t=>t===null),'undated projects last');
 assert.deepEqual(matchingProjects('no such project'),[]);
});
test('update labels read naturally',()=>{
 const now=Date.parse('2026-11-25T12:00:00Z'),day=86400000;
 assert.equal(updatedLabel(new Date(now-3600000),now),'today');
 assert.equal(updatedLabel(new Date(now-day),now),'yesterday');
 assert.equal(updatedLabel(new Date(now-5*day),now),'5 days ago');
 assert.equal(updatedLabel(new Date(now-40*day),now),'1 month ago');
 assert.equal(updatedLabel(new Date(now-800*day),now),'2 years ago');
});
