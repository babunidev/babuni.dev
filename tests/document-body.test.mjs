import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocumentBody} from '../src/scripts/document-body.ts';

// Minimal DOM fixture: exercise asynchronous loading without adding a DOM package.
class Node {
  children=[];listeners=new Map();textContent='';
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=[...nodes];}
  setAttribute(){}
  addEventListener(name,callback){this.listeners.set(name,callback);}
}
function setup(t){
 const previous=globalThis.document;
 globalThis.document={createElement:()=>new Node(),createTextNode:text=>Object.assign(new Node(),{textContent:text})};
 t.after(()=>{globalThis.document=previous;});
 const parent=new Node(),source=new Node(),credit=new Node();
 source.textContent='View source';credit.textContent='Babuni.dev';
 const mount=options=>{
  const body=createDocumentBody('/_project-docs/babunidev--ButtonGame/README.md',{signal:new AbortController().signal,isCurrent:()=>true,...options});
  parent.append(body.element,source,credit);return body;
 };
 return {parent,source,credit,mount};
}
test('loaded document retains source and credit siblings',async t=>{
 const {parent,source,credit,mount}=setup(t);
 const body=mount({loadBody:async()=> '# Real document\n\nOriginal source text.'});
 await body.load();
 assert.deepEqual(parent.children,[body.element,source,credit]);
 assert.equal(body.element.children[0].className,'module-document');
});
test('failure and retry preserve the source and credit footer',async t=>{
 const {parent,source,credit,mount}=setup(t);let attempts=0;
 const body=mount({loadBody:async()=>{if(++attempts===1)throw new Error('offline');return 'Recovered text.';}});
 await body.load();
 assert.equal(body.element.children[1].textContent,'Retry document');
 assert.deepEqual(parent.children,[body.element,source,credit]);
 body.element.children[1].listeners.get('click')();
 // The injected request resolves on the next microtask, like an already-cached file.
 await Promise.resolve();await Promise.resolve();
 assert.equal(attempts,2);assert.equal(body.element.children[0].className,'module-document');
 assert.deepEqual(parent.children,[body.element,source,credit]);
});
test('late success after close or cancellation does not render into the old reader',async t=>{
 const {mount}=setup(t);
 for(const cancelled of [false,true]){
  let resolve,current=true;const request=new AbortController();
  const body=mount({signal:request.signal,isCurrent:()=>current,loadBody:()=>new Promise(done=>{resolve=done;})});
  const pending=body.load();
  if(cancelled)request.abort();else current=false;
  resolve('Late text');await pending;
  assert.equal(body.element.children[0].textContent,'Loading document…');
 }
});
