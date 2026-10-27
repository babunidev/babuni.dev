import test from 'node:test';
import assert from 'node:assert/strict';
import {readerScrollMetrics} from '../src/scripts/reader-scroll.ts';
test('reader thumb maps top, middle and bottom over full scroll range',()=>{
 const top=readerScrollMetrics(400,2000,0),mid=readerScrollMetrics(400,2000,800),end=readerScrollMetrics(400,2000,1600);
 assert.equal(top.range,1600);assert.equal(top.top,8);assert.equal(mid.top,8+top.travel/2);assert.equal(end.top+end.size,392);
 assert.equal(readerScrollMetrics(400,2000,9999).top,end.top);
});
test('short documents need no handle and long documents retain a usable thumb',()=>{
 assert.equal(readerScrollMetrics(400,200,0).range,0);
 assert.equal(readerScrollMetrics(400,100000,0).size,36);
 assert.equal(readerScrollMetrics(0,0,0).travel,0);
});
