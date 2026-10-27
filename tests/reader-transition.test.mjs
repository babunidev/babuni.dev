import test from 'node:test';
import assert from 'node:assert/strict';
import {shrinkReader} from '../src/scripts/reader-transition.ts';
test('reader stays alive until shrink finishes, then closes once',async()=>{
 let resolve,closed=0,frames,options;
 const finished=new Promise(done=>{resolve=done;});
 shrinkReader({animate(f,o){frames=f;options=o;return {finished,cancel(){}};}},false,()=>closed++);
 assert.equal(closed,0);assert.equal(options.duration,420);assert.equal(frames.at(-1).transform,'scale(.96)');
 resolve();await finished;await Promise.resolve();assert.equal(closed,1);
});
test('replacing a shrinking reader cancels its stale completion',async()=>{
 let resolve,closed=0,cancelled=0;const finished=new Promise(done=>{resolve=done;});
 const cancel=shrinkReader({animate(){return {finished,cancel(){cancelled++;}};}},false,()=>closed++);
 cancel();resolve();await finished;await Promise.resolve();assert.equal(cancelled,1);assert.equal(closed,0);
});
test('reduced motion closes immediately without starting an animation',()=>{
 let closed=0;
 shrinkReader({animate(){throw new Error('motion should be skipped');}},true,()=>closed++);
 assert.equal(closed,1);
});
