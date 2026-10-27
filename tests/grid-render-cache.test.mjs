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
test('settlement preserves warm unaffected cells without replaying the session',()=>{
 const history=[];let replays=0;
 const lookup=createSourceLookup(history,(x,y,h)=>{replays++;return sourceCell(x,y,h);});
 for(let x=0;x<20;x++)lookup(x,0);
 const initial=replays;
 for(let i=0;i<1000;i++){history.push({axis:'row',line:100,direction:1});for(let x=0;x<20;x++)assert.deepEqual(lookup(x,0),{column:x,row:0});}
 assert.equal(replays,initial);
});
test('cache survives eviction and mixed bloom histories without changing identities',()=>{
 const history=[],lookup=createSourceLookup(history);
 const vacancies=moduleVacancies({column:0,row:0},[{column:1,row:0},{column:0,row:1},{column:-1,row:0}]);
 for(let i=0;i<120;i++){
  history.push({axis:i%2?'column':'row',line:i%7-3,direction:i%3?1:-1,vacancies:i%4?vacancies:[]});
  for(let x=-7;x<=7;x++)for(let y=-4;y<=4;y++)assert.deepEqual(lookup(x,y),sourceCell(x,y,history));
 }
 for(let x=0;x<2100;x++)assert.deepEqual(lookup(x,30),sourceCell(x,30,history));
 assert.deepEqual(lookup(0,0),sourceCell(0,0,history));
});
