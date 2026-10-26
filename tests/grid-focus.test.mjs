import test from 'node:test';
import assert from 'node:assert/strict';
import {centeredPan,bloomModuleCell,shiftsForBloom,interpolateCenter,CENTER_DURATION_MS,BLOOM_SHIFT_DURATION_MS,AMBIENT_INTERVAL_MS,AMBIENT_RETRY_MS,AMBIENT_VISIBLE_MS,ambientInsets,ambientTileIsEligible,ambientPollDelay,shiftTouchesSelection,shiftAvoidsBloom,permittedBloomShifts,selectionShiftAction} from '../src/lib/grid-focus.ts';
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
test('both reserved rows displace runs, other rows stay fixed',()=>{
  const selected=c(4,-3);
  assert.equal(shiftsForBloom(c(5,-3),selected),true);
  assert.equal(shiftsForBloom(c(4,-3),selected),false);
  assert.equal(shiftsForBloom(c(3,-3),selected),false);
  assert.equal(shiftsForBloom(c(8,-2),selected),true);
});
test('ambient topic hints keep a five-second interval and a brief appearance',()=>{
  assert.equal(AMBIENT_INTERVAL_MS,5000);
  assert.ok(AMBIENT_VISIBLE_MS<2000);
  assert.ok(AMBIENT_RETRY_MS<1000);
});
test('blocked shift retries quickly rather than losing the five-second deadline',()=>{
  const deadline=5000;
  assert.equal(ambientPollDelay(0,deadline,false),5000);
  assert.equal(ambientPollDelay(5400,deadline,true),AMBIENT_RETRY_MS);
  assert.equal(ambientPollDelay(5600,deadline,false),0);
  assert.equal(ambientPollDelay(2000,deadline,false),3000);
});
test('ambient candidates need their entire face inside safe margins',()=>{
  const viewport={left:0,top:0,right:1920,bottom:1080};
  const insets=ambientInsets(240,52,42);
  assert.equal(ambientTileIsEligible({left:840,top:420,right:1080,bottom:660},viewport,insets),true);
  assert.equal(ambientTileIsEligible({left:-10,top:300,right:230,bottom:540},viewport,insets),false);
  assert.equal(ambientTileIsEligible({left:1690,top:300,right:1930,bottom:540},viewport,insets),false);
  assert.equal(ambientTileIsEligible({left:120,top:20,right:360,bottom:260},viewport,insets),false);
  assert.equal(ambientTileIsEligible({left:120,top:940,right:360,bottom:1180},viewport,insets),false);
  assert.equal(ambientTileIsEligible({left:40,top:420,right:280,bottom:660},viewport,insets),false);
});
test('central tile still qualifies for a small phone-sized viewport',()=>{
  const viewport={left:0,top:0,right:390,bottom:844};
  const tile={left:117,top:344,right:273,bottom:500};
  assert.equal(ambientTileIsEligible(tile,viewport,ambientInsets(156,52,46)),true);
  assert.equal(ambientTileIsEligible({...tile,left:0,right:156},viewport,ambientInsets(156,52,46)),false);
});

test('moving selected or first bloom-neighbor line must finish before selection',()=>{
  const chosen={column:2,row:-1};
  assert.equal(shiftTouchesSelection({axis:'row',line:-1,direction:1},chosen),true);
  assert.equal(shiftTouchesSelection({axis:'row',line:1,direction:1},chosen),false);
  assert.equal(shiftTouchesSelection({axis:'column',line:2,direction:-1},chosen),true);
  assert.equal(shiftTouchesSelection({axis:'column',line:3,direction:1},chosen),true);
  assert.equal(shiftTouchesSelection({axis:'column',line:4,direction:1},chosen),true);
});
test('all unrelated rows and columns can continue around an open bloom',()=>{
  const chosen={column:2,row:-1};
  const candidates=[
    {axis:'row',line:-1,direction:1},
    {axis:'row',line:-2,direction:-1},
    {axis:'row',line:0,direction:1},
    {axis:'column',line:1,direction:-1},
    {axis:'column',line:2,direction:1},
    {axis:'column',line:3,direction:-1},
    {axis:'column',line:6,direction:1}
  ];
  assert.deepEqual(permittedBloomShifts(candidates,chosen),[candidates[1],candidates[3],candidates[6]]);
  assert.equal(shiftAvoidsBloom({axis:'column',line:0,direction:1},chosen),true);
  assert.equal(shiftAvoidsBloom({axis:'column',line:3,direction:1},chosen),false);
  assert.equal(shiftAvoidsBloom({axis:'column',line:8,direction:1},chosen),true);
  assert.equal(shiftAvoidsBloom({axis:'row',line:-1,direction:1},chosen),false);
});

test('selection waits for every active line, including unrelated lines',()=>{
  const cell=c(2,0);
  assert.equal(selectionShiftAction([],cell),'pause');
  assert.equal(selectionShiftAction([{axis:'row',line:0,direction:1}],cell),'wait');
  assert.equal(selectionShiftAction([{axis:'column',line:3,direction:1}],cell),'wait');
  assert.equal(selectionShiftAction([{axis:'row',line:-2,direction:1}],cell),'wait');
  assert.equal(selectionShiftAction([{axis:'column',line:1,direction:1}],cell),'wait');
  assert.equal(selectionShiftAction([{axis:'column',line:6,direction:-1}],cell),'wait');
  assert.equal(selectionShiftAction([
    {axis:'row',line:-1,direction:1},{axis:'row',line:0,direction:-1}
  ],cell),'wait');
});
