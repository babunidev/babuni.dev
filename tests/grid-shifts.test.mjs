import assert from 'node:assert/strict';
import test from 'node:test';
import {easeInOut,planShiftRound,seededRandom,sourceCell} from '../src/lib/grid-shifts.ts';
test('seeded shift rounds are reproducible',()=>{
 const make=()=>planShiftRound([-1,0,1,2],[-2,-1,0,1,2],seededRandom(42));
 assert.deepEqual(make(),make());
});
test('each visible line rolls once with proposed descending initiative',()=>{
 const round=planShiftRound([0,1,2,3,4,5],[0,1,2,3],seededRandom(555));
 const n=round.axis==='row'?6:4;
 assert.equal(round.rolls.length,n);
 assert.equal(new Set(round.rolls.map(r=>r.line)).size,n);
 assert.deepEqual(round.rolls.map(r=>r.bonus),Array.from({length:n},(_,i)=>Math.max(0,4-i)));
 assert.ok(round.rolls.every(r=>r.d20>=1&&r.d20<=20));
 assert.ok(round.moves.every(m=>round.rolls.some(r=>r.line===m.line&&r.total>10)));
});
test('row and column moves map residents by exactly one cell',()=>{
 assert.deepEqual(sourceCell(8,0,[{axis:'row',line:0,direction:1}]),{column:7,row:0});
 assert.deepEqual(sourceCell(8,1,[{axis:'row',line:0,direction:1}]),{column:8,row:1});
 assert.deepEqual(sourceCell(1,8,[{axis:'column',line:1,direction:-1}]),{column:1,row:9});
});
test('successive perpendicular moves are order sensitive',()=>{
 const events=[{axis:'row',line:0,direction:1},{axis:'column',line:1,direction:1}];
 assert.deepEqual(sourceCell(1,1,events),{column:0,row:0});
 assert.deepEqual(sourceCell(1,1,[events[1],events[0]]),{column:1,row:0});
});
test('easing stays in bounds and lands on exact cell boundaries',()=>{
 assert.equal(easeInOut(-5),0);assert.equal(easeInOut(0),0);assert.equal(easeInOut(.5),.5);assert.equal(easeInOut(1),1);assert.equal(easeInOut(3),1);
});
