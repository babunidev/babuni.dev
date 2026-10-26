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

/** Force only the first random draw (axis selection); retain seeded dice and initiative rolls. */
function seededAxisRandom(axis, seed) {
  const source=seededRandom(seed);
  let first=true;
  return () => {
    if(first){ first=false; return axis==='row' ? 0.25 : 0.75; }
    return source();
  };
}
test('both axes: no two moving lines share a direction across 400 seeded rounds',()=>{
  for(const axis of ['row','column']){
    let successfulMoves=0;
    for(let seed=0;seed<200;seed++){
      const round=planShiftRound([-3,-2,-1,0,1,2,3],[-3,-2,-1,0,1,2,3],seededAxisRandom(axis,seed));
      assert.equal(round.axis,axis);
      assert.ok(round.moves.length<=2);
      assert.equal(new Set(round.moves.map(move=>move.direction)).size,round.moves.length);
      assert.ok(round.moves.every(move=>round.rolls.some(roll=>
        roll.line===move.line && roll.direction===move.direction && roll.total>10)));
      successfulMoves+=round.moves.length;
    }
    assert.ok(successfulMoves>0,axis+' did not exercise any successful shifts');
  }
});
test('first successful initiative roll takes precedence on both axes',()=>{
  for(const axis of ['row','column']){
    for(let seed=0;seed<100;seed++){
      const round=planShiftRound([0,1,2,3,4,5],[0,1,2,3,4,5],seededAxisRandom(axis,seed));
      assert.equal(round.axis,axis);
      for(const move of round.moves){
        const earliest=round.rolls.find(roll=>roll.total>10 && roll.direction===move.direction);
        assert.equal(move.line,earliest.line);
      }
    }
  }
});
