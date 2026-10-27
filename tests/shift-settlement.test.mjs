import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {settledResidents} from '../src/lib/shift-settlement.ts';
import {sourceCell} from '../src/lib/grid-shifts.ts';
import {occupiedCell} from '../src/lib/bloom-geometry.ts';

const pool=(first=-4,last=4)=>Array.from({length:last-first+1},(_,y)=>
  Array.from({length:last-first+1},(_,x)=>({
    column:first+x,row:first+y,
    // Represent predecoded portal artwork and the source identity carried
    // by this actual element, rather than recreating it after movement.
    resident:'portal:'+ (first+x)+','+(first+y)
  }))).flat();

function checkRound(moves,vacancies=[]){
  const slots=pool();
  const assignments=settledResidents(slots,moves,vacancies);
  assert.equal(new Set(assignments.map(x=>x.destination)).size,assignments.length);
  assert.equal(new Set(assignments.map(x=>x.source)).size,assignments.length);
  const next=new Map(assignments.map(({destination,source})=>[destination,source.resident]));
  for(const move of moves){
    const line=slots.filter(cell=>{
      const visual=occupiedCell(cell,vacancies);
      return move.axis==='row'?visual.row===move.line:visual.column===move.line;
    });
    assert.ok(line.length>=3);
    const leading=Math.min(...line.map(c=>move.axis==='row'?occupiedCell(c,vacancies).column:occupiedCell(c,vacancies).row));
    const trailing=Math.max(...line.map(c=>move.axis==='row'?occupiedCell(c,vacancies).column:occupiedCell(c,vacancies).row));
    for(const {destination,source} of assignments){
      const vd=occupiedCell(destination,vacancies);
      if((move.axis==='row'?vd.row:vd.column)!==move.line)continue;
      const at=move.axis==='row'?vd.column:vd.row;
      // One wrapped pool tile goes to an offscreen buffer edge.
      if(move.direction===1&&at===leading || move.direction===-1&&at===trailing)continue;
      assert.deepEqual(sourceCell(destination.column,destination.row,[{...move,vacancies}]),
        {column:source.column,row:source.row});
      assert.equal(next.get(destination),source.resident);
    }
  }
}
test('row settlements carry the real existing portal nodes in both directions',()=>{
  checkRound([{axis:'row',line:0,direction:1}]);
  checkRound([{axis:'row',line:0,direction:-1}]);
  checkRound([{axis:'row',line:-2,direction:1},{axis:'row',line:2,direction:-1}]);
});
test('column settlements preserve artwork instead of reconstructing it',()=>{
  checkRound([{axis:'column',line:2,direction:1}]);
  checkRound([{axis:'column',line:-2,direction:-1}]);
  checkRound([{axis:'column',line:1,direction:1},{axis:'column',line:3,direction:-1}]);
});
test('settled residents respect the actual bloom-displaced visual column',()=>{
  const holes=[{column:1,row:0,originColumn:0},{column:0,row:1,originColumn:0}];
  checkRound([{axis:'column',line:3,direction:1}],holes);
  checkRound([{axis:'column',line:3,direction:-1}],holes);
  checkRound([{axis:'row',line:-2,direction:1}],holes);
});
test('the renderer settles moved elements before history sync and never reattaches their logos',()=>{
  // This guards the flicker regression without requiring a browser DOM.
  const source=readFileSync(new URL('../src/scripts/grid.ts',import.meta.url),'utf8');
  assert.match(source,/settleMovedResidents\(moving\.moves\);\s*history\.push\(\.\.\.moving\.moves\);\s*moving=null;\s*updateField\(true\)/);
  assert.match(source,/destination\.element=resident\.element/);
  assert.match(source,/destination\.projectIndex=resident\.projectIndex/);
});
