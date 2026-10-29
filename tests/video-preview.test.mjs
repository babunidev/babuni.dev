import test from 'node:test';
import assert from 'node:assert/strict';
import {renderVideo} from '../src/scripts/module-preview.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
test('YouTube embeds expose a lazy full player preview without a load button or autoplay',t=>{
 documentDOM(t);
 const root=renderVideo({embed:'https://www.youtube-nocookie.com/embed/9fnC1ZI1iSY',title:'Stream test'});
 const frames=nodes(root,'iframe');assert.equal(frames.length,1);
 assert.equal(frames[0].src,'https://www.youtube-nocookie.com/embed/9fnC1ZI1iSY');
 assert.equal(frames[0].loading,'lazy');assert.equal(frames[0].title,'Stream test');
 assert.equal(nodes(root,'button').length,0);assert.ok(!frames[0].src.includes('autoplay'));
});
test('unsafe video embeds still cannot create external players',t=>{
 documentDOM(t);assert.equal(nodes(renderVideo({embed:'https://example.com/embed/bad',title:'Invalid'}),'iframe').length,0);
});
