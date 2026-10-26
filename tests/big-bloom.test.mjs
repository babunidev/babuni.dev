import test from 'node:test';
import assert from 'node:assert/strict';
import {bigBloomLayout} from '../src/lib/big-bloom.ts';
import {seededRandom} from '../src/lib/grid-shifts.ts';
const modules=Array.from({length:27},(_,index)=>({id:'m'+index,type:'text',title:'Module '+index,body:'Content'}));
test('big bloom contains every populated module, selected at center, with nonoverlapping stable cells',()=>{
 for(let seed=0;seed<40;seed++){
  const layout=bigBloomLayout([...modules,{id:'empty',type:'text',body:''}],'m17',seededRandom(seed));
  assert.equal(layout.length,27);assert.equal(layout[0].module.id,'m17');
  assert.equal(layout[0].column,0);assert.equal(layout[0].row,0);
  assert.equal(new Set(layout.map(item=>item.module.id)).size,27);
  assert.equal(new Set(layout.map(item=>`${item.column},${item.row}`)).size,27);
  assert.deepEqual(layout,bigBloomLayout(modules,'m17',seededRandom(seed)));
 }
 assert.notDeepEqual(bigBloomLayout(modules,'m17',seededRandom(2)).slice(1),bigBloomLayout(modules,'m17',seededRandom(3)).slice(1));
});
test('empty collections and missing selection have safe fallbacks without modifying source order',()=>{
 assert.deepEqual(bigBloomLayout([],'missing'),[]);
 const ids=modules.map(m=>m.id);assert.equal(bigBloomLayout(modules,'missing')[0].module.id,'m0');
 assert.deepEqual(modules.map(m=>m.id),ids);
});
