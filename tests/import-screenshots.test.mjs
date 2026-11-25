import test from 'node:test';
import assert from 'node:assert/strict';
import {screenshotName,screenshotUrls,blankBottomRows} from '../scripts/import-screenshots.mjs';
import {screenshotImage} from '../src/scripts/image-lightbox.ts';

test('screenshot names drop the folder date and become URL-safe',()=>{
 assert.equal(screenshotName('2026-01-02-Sample Übersicht_2.png','2026-01-02'),'sample-ubersicht-2');
 assert.equal(screenshotName('2026-01-03-other.png','2026-01-02'),'2026-01-03-other');
 assert.throws(()=>screenshotName('2026-01-02-.png','2026-01-02'));
});
test('published screenshot URLs are exactly what the reader embeds',()=>{
 const urls=screenshotUrls('sample-game','2026-01-02','phone-view');
 assert.deepEqual(screenshotImage('https://www.babuni.dev'+urls.src),urls);
});
test('only pure-white rows at the bottom count as empty, at most half the image',()=>{
 const image=(rows,channels=3)=>Uint8Array.from(rows.flatMap(value=>Array(2*channels).fill(value)));
 assert.equal(blankBottomRows(image([10,10,255,255]),2,4,3),2);
 assert.equal(blankBottomRows(image([10,244,244,244]),2,4,3),0,'light grey is page content');
 assert.equal(blankBottomRows(image([255,255,255,255]),2,4,3),2,'never more than half');
 const alpha=Uint8Array.from([10,10,10,0, 10,10,10,0, 255,255,255,0, 255,255,255,0]);
 assert.equal(blankBottomRows(alpha,1,4,4),2,'alpha is ignored');
});
