import assert from 'node:assert/strict';
import test from 'node:test';
import { demoProjectIndex, gridWindow, logicalCell, positiveModulo, tileSizeForWidth } from '../src/lib/grid-math.ts';

test('approved approximate tile scale across screens', () => {
  assert.equal(tileSizeForWidth(1920), 240);
  assert.equal(tileSizeForWidth(768), 200);
  assert.equal(tileSizeForWidth(390), 156);
  assert.equal(tileSizeForWidth(320), 144);
});
test('initial tile is exactly at viewport center', () => {
  for (const [width, height] of [[1920,1080],[768,1024],[390,844]]) {
    const tileSize = tileSizeForWidth(width);
    const w = gridWindow({width,height,tileSize,panX:0,panY:0,bufferCells:2});
    assert.equal(w.originX + tileSize/2, width/2);
    assert.equal(w.originY + tileSize/2, height/2);
  }
});
test('bounded pool covers viewport and buffer across arbitrary pan positions', () => {
  for (const [width, height] of [[1920,1080],[768,1024],[390,844],[320,500]]) {
    const tileSize = tileSizeForWidth(width);
    for (const panX of [-9999,-701,-113,0,93,1808,40000]) {
      for (const panY of [-6666,-12,0,118,2197]) {
        const w = gridWindow({width,height,tileSize,panX,panY,bufferCells:2});
        const left = w.originX + w.firstColumn*tileSize;
        const top = w.originY + w.firstRow*tileSize;
        assert.ok(left <= -tileSize*2 + .00001);
        assert.ok(top <= -tileSize*2 + .00001);
        assert.ok(left + w.columns*tileSize >= width + tileSize*2);
        assert.ok(top + w.rows*tileSize >= height + tileSize*2);
      }
    }
  }
});
test('ring slot recycling reassigns exiting columns and rows', () => {
  assert.deepEqual(Array.from({length:9},(_,i)=>logicalCell(1,i,1,9)), [9,1,2,3,4,5,6,7,8]);
  assert.deepEqual(Array.from({length:9},(_,i)=>logicalCell(-1,i,positiveModulo(-1,9),9)), [0,1,2,3,4,5,6,7,-1]);
});
test('placeholder coordinate mapping remains deterministic', () => {
  const id=demoProjectIndex(-7,23,12);
  assert.equal(id,demoProjectIndex(-7,23,12));
  assert.ok(id>=0 && id<12);
});
