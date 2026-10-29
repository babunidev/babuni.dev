import test from 'node:test';import assert from 'node:assert/strict';
import {createProjectModuleLoader} from '../src/lib/project-module-loader.ts';
test('project modules load once per project, share pending fetches, and cache successful results',async()=>{
 let calls=0,finish;const loader=createProjectModuleLoader(async url=>{calls++;assert.equal(url,'/_project-modules/lootfeed.json');await new Promise(resolve=>finish=resolve);return new Response(JSON.stringify([{id:'overview',type:'text',body:'content'}]));});
 assert.equal(loader.get('lootfeed'),undefined);const a=loader.load('lootfeed'),b=loader.load('lootfeed');assert.equal(a,b);finish();const result=await a;assert.equal(loader.get('lootfeed'),result);assert.equal(await loader.load('lootfeed'),result);assert.equal(calls,1);
});
test('failed project loads can retry and invalid IDs never fetch',async()=>{
 let calls=0;const loader=createProjectModuleLoader(async()=>{calls++;return calls===1?new Response('',{status:503}):new Response('[]');});
 await assert.rejects(()=>loader.load('../private'));assert.equal(calls,0);
 await assert.rejects(()=>loader.load('lootfeed'));assert.equal(loader.get('lootfeed'),undefined);
 assert.deepEqual(await loader.load('lootfeed'),[]);assert.equal(calls,2);
});
