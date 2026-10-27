import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceLookup,compileVacancies} from '../src/lib/grid-render-cache.ts';
import {sourceCell} from '../src/lib/grid-shifts.ts';
import {occupiedCell,moduleVacancies} from '../src/lib/bloom-geometry.ts';
test('cached sources stay correct after settlement and across recycled coordinates',()=>{
 const history=[];const lookup=createSourceLookup(history);
 for(let round=0;round<30;round++){
  history.push({axis:round%2?'row':'column',line:round%5-2,direction:round%2?1:-1});
  for(let x=-5;x<6;x++)for(let y=-5;y<6;y++)assert.deepEqual(lookup(x,y),sourceCell(x,y,history));
 }
});
test('compiled occupancy matches small, extended and future 3x3 footprints',()=>{
 for(const width of [1,3,6]){
  const offsets=Array.from({length:width*5},(_,i)=>({column:i%width-1,row:Math.floor(i/width)-2}));
  const holes=moduleVacancies({column:2,row:1},offsets),compiled=compileVacancies(holes);
  for(let column=-8;column<14;column++)for(let row=-6;row<9;row++)assert.deepEqual(compiled({column,row}),occupiedCell({column,row},holes));
 }
});
