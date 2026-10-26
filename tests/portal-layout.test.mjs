import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/pages/index.astro',import.meta.url),'utf8');
const grid=readFileSync(new URL('../src/scripts/grid.ts',import.meta.url),'utf8');

test('all projects use one 56%-width square portal regardless of name length',()=>{
  assert.match(css,/\.tile-portal-cluster\s*\{[^}]*width:56%;aspect-ratio:1/s);
  assert.match(css,/\.tile-portal\s*\{width:100%;height:100%;aspect-ratio:1;/);
  assert.doesNotMatch(css,/\.grid-tile--long-title\s+\.tile-portal\s*\{/);
  assert.equal((grid.match(/<div class="tile-portal-cluster">/g)||[]).length,1);
});

test('three diamonds share one radial gap measured from the circle',()=>{
  assert.match(css,/--marker-edge-gap:calc\(var\(--tile-size,240px\) \* \.06\)/);
  assert.match(css,/\.tile-mark--top\{left:calc\(50% - 3\.5px\);top:calc\(0px - var\(--marker-edge-gap\) - 7px\)\}/);
  assert.match(css,/\.tile-mark--left\{left:calc\(0px - var\(--marker-edge-gap\) - 7px\);top:calc\(50% - 3\.5px\)\}/);
  assert.match(css,/\.tile-mark--right\{left:calc\(100% \+ var\(--marker-edge-gap\)\);top:calc\(50% - 3\.5px\)\}/);
  for(const size of [144,156,172,200,240]){
    const portalRadius=size*.56/2;
    const radialDistance=portalRadius+size*.06+3.5;
    assert.ok(radialDistance>portalRadius+3.5,'marker must clear rim');
    assert.ok(size*.45-radialDistance>=7,'top square remains within the tile');
    assert.ok(size/2-radialDistance>=7,'left square remains within the tile');
  }
});

test('topic wings stay anchored to their own marker rather than old tile offsets',()=>{
  assert.match(css,/\.tile-topic--left\{bottom:calc\(50% \+ 3\.5px\);left:auto;right:calc\(100% \+ var\(--marker-edge-gap\) \+ 7px\)/);
  assert.match(css,/\.tile-topic--right\{bottom:calc\(50% \+ 3\.5px\);left:calc\(100% \+ var\(--marker-edge-gap\)\)/);
  assert.match(css,/\.tile-topic\{position:absolute;top:auto;bottom:calc\(100% \+ var\(--marker-edge-gap\) \+ 7px\);left:50%;/);
});
