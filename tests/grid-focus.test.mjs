import test from 'node:test';
import assert from 'node:assert/strict';
import {centeredPan,bloomModuleCell,shiftsForBloom,interpolateCenter,CENTER_DURATION_MS,BLOOM_SHIFT_DURATION_MS,ambientWait,AMBIENT_VISIBLE_MS} from '../src/lib/grid-focus.ts';
const c=(column,row)=>({column,row});
test('any clicked tile centers with no snapping to original grid',()=>{
  for(const cell of [c(0,0),c(-5,3),c(20,-14),c(1,1)]){
    const pan=centeredPan(cell,240);
    assert.equal(cell.column*240+pan.x,0);
    assert.equal(cell.row*240+pan.y,0);
  }
});
test('centering eases between camera offsets and reaches its target exactly',()=>{
  assert.deepEqual(interpolateCenter({x:200,y:-30},{x:-480,y:960},0),{x:200,y:-30});
  assert.deepEqual(interpolateCenter({x:200,y:-30},{x:-480,y:960},1),{x:-480,y:960});
  assert.deepEqual(interpolateCenter({x:200,y:-30},{x:-480,y:960},.5),{x:-140,y:465});
  assert.ok(CENTER_DURATION_MS>0);
});
test('a right-side bloom frees exactly the adjacent cell without overlapping neighbors',()=>{
  const selected=c(-3,5),module=bloomModuleCell(selected);
  assert.deepEqual(module,c(-2,5));
  for(let col=-8;col<8;col++){
    const tile=c(col,5),moved=shiftsForBloom(tile,selected);
    const finalColumn=tile.column+Number(moved);
    assert.notEqual(finalColumn,module.column);
    if(col>selected.column)assert.equal(finalColumn,col+1);
  }
  assert.ok(BLOOM_SHIFT_DURATION_MS>0);
});
test('only the selected row is displaced, never other neighboring rows',()=>{
  const selected=c(4,-3);
  assert.equal(shiftsForBloom(c(5,-3),selected),true);
  assert.equal(shiftsForBloom(c(4,-3),selected),false);
  assert.equal(shiftsForBloom(c(3,-3),selected),false);
  assert.equal(shiftsForBloom(c(8,-2),selected),false);
});
test('ambient hint cadence is infrequent and visibility short',()=>{
  assert.equal(ambientWait(0),6500);
  assert.equal(ambientWait(1),10500);
  assert.ok(AMBIENT_VISIBLE_MS<ambientWait(0));
});
