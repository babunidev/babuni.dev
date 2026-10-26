import test from 'node:test';
import assert from 'node:assert/strict';
import {occupiedCell,restingCell,bloomVacancies} from '../src/lib/bloom-geometry.ts';
import {sourceCell} from '../src/lib/grid-shifts.ts';
import {shiftTouchesSelection,shiftAvoidsBloom} from '../src/lib/grid-focus.ts';
test('two modules and future 3x3 vacancies preserve unique occupied cells',()=>{
 for(const vacancies of [bloomVacancies({column:0,row:0}),Array.from({length:9},(_,i)=>({column:i%3-1,row:Math.floor(i/3)-1})).filter(c=>c.column||c.row)]){
  const seen=new Set();
  for(let row=-5;row<=5;row++)for(let column=-5;column<=5;column++){
   const c={column,row},v=occupiedCell(c,vacancies),key=JSON.stringify(v);
   assert.ok(!seen.has(key));seen.add(key);
   assert.ok(!vacancies.some(h=>h.column===v.column&&h.row===v.row));
   assert.deepEqual(restingCell(v,vacancies),c);
  }
 }
});
test('vertical shifts select actual visual occupants and preserve straight x and identity at commit',()=>{
 const selected={column:0,row:0},vacancies=bloomVacancies(selected);
 for(const direction of [-1,1])for(const line of [-3,-1,2,3,5]){
  const move={axis:'column',line,direction,vacancies};
  assert.ok(shiftAvoidsBloom(move,selected));
  for(let row=-4;row<4;row++){
   const original=restingCell({column:line,row},vacancies);
   const end=restingCell({column:line,row:row+direction},vacancies);
   assert.deepEqual(sourceCell(end.column,end.row,[move]),original);
   assert.equal(occupiedCell(original,vacancies).column,occupiedCell(end,vacancies).column);
  }
 }
});
test('expansion waits for far-right columns and both displaced row runs',()=>{
 const c={column:2,row:3};
 for(const move of [{axis:'column',line:9,direction:1},{axis:'row',line:4,direction:-1}])assert.ok(shiftTouchesSelection(move,c));
 assert.equal(shiftTouchesSelection({axis:'column',line:1,direction:1},c),false);
});

test('successive opposite column shifts stay aligned and reassign every endpoint without collision',()=>{
 const vacancies=bloomVacancies({column:0,row:0});
 const history=[];
 for(let round=0;round<8;round++){
  const moves=[{axis:'column',line:2,direction:round%2?1:-1,vacancies},
               {axis:'column',line:4,direction:round%2?-1:1,vacancies}];
  const sources=[];
  for(let row=-6;row<=6;row++)for(let column=-4;column<=6;column++){
   const cell={column,row},visual=occupiedCell(cell,vacancies);
   const move=moves.find(m=>m.line===visual.column);
   const end={column:visual.column,row:row+(move?.direction??0)};
   sources.push({visual,move,end,source:sourceCell(column,row,history)});
  }
  for(const progress of [0,.1,.5,.9,1]){
   const positions=new Set();
   for(const {visual,move} of sources){
    const position={column:visual.column,row:visual.row+(move?.direction??0)*progress};
    assert.equal(position.column,visual.column);
    const key=JSON.stringify(position);
    assert.ok(!positions.has(key),'no two tiles share a trajectory position');positions.add(key);
   }
  }
  history.push(...moves);
  for(const {end,source} of sources){
   const resting=restingCell(end,vacancies);
   assert.deepEqual(sourceCell(resting.column,resting.row,history),source);
  }
 }
});

test('center ownership follows panning, displaced cells and mid-shift positions',async()=>{
 const {tileAtCenter}=await import('../src/lib/bloom-geometry.ts');
 const tiles=[{column:0,row:0},{column:1,row:0},{column:0,row:1}];
 assert.equal(tileAtCenter(tiles,c=>c,{column:.5,row:.5}),tiles[0]);
 assert.equal(tileAtCenter(tiles,c=>c,{column:1,row:.5}),tiles[1]);
 const vacancies=bloomVacancies(tiles[0]);
 assert.equal(tileAtCenter(tiles,c=>occupiedCell(c,vacancies),{column:1.5,row:.5}),undefined,'module vacancy has no topic tile');
 assert.equal(tileAtCenter(tiles,c=>occupiedCell(c,vacancies),{column:2.5,row:.5}),tiles[1]);
 const column=[{column:3,row:0},{column:3,row:1}];
 assert.equal(tileAtCenter(column,c=>({...c,row:c.row+.75}),{column:3.5,row:1.5}),column[0]);
 assert.equal(tileAtCenter(column,c=>({...c,row:c.row+.25}),{column:3.5,row:1.5}),column[1]);
});
