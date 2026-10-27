import test from 'node:test';
import assert from 'node:assert/strict';
import {stepShiftPlayback,SHIFT_BRAKE_MS} from '../src/lib/shift-playback.ts';
import {SHIFT_DURATION_MS} from '../src/lib/grid-shifts.ts';
test('ordinary presses never change normal shift tempo',()=>{
 let state={elapsed:0,rate:1};
 for(let i=0;i<440;i++)state=stepShiftPlayback(state,10,false);
 assert.equal(state.elapsed,SHIFT_DURATION_MS);assert.equal(state.rate,1);
});
test('actual dragging brakes progressively with continuous positive progress',()=>{
 const first=stepShiftPlayback({elapsed:1000,rate:1},70,true);
 assert.equal(first.rate,.75);assert.ok(first.elapsed>1000&&first.elapsed<1070);
 const stopped=stepShiftPlayback(first,SHIFT_BRAKE_MS-70,true);
 assert.equal(stopped.rate,0);assert.equal(stopped.elapsed,1140);
 assert.deepEqual(stepShiftPlayback(stopped,1000,true),stopped);
 const resumed=stepShiftPlayback(stopped,70,false);
 assert.equal(resumed.rate,.25);assert.ok(resumed.elapsed>stopped.elapsed);
});
test('braking is independent of frame partition and never rewinds',()=>{
 let split={elapsed:0,rate:1};for(let i=0;i<70;i++)split=stepShiftPlayback(split,5,true);
 const single=stepShiftPlayback({elapsed:0,rate:1},350,true);
 assert.ok(Math.abs(split.elapsed-single.elapsed)<1e-8);assert.equal(split.rate,0);
});
