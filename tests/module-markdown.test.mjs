import test from 'node:test';
import assert from 'node:assert/strict';
import {renderModulePreview} from '../src/scripts/module-preview.ts';
import {markdownExcerpt} from '../src/lib/markdown-excerpt.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
for(const depth of ['small','big'])test(`${depth} bloom renders safe Markdown without navigating document links`,t=>{
 documentDOM(t);
 const markdown='**Bold** and *emphasis* with `code` and [source](https://example.com).\n\n> A quote\n\n- One\n- Two';
 const card=renderModulePreview({id:'test',type:'text',title:'Test',preview:markdown,body:markdown},'Project',undefined,depth);
 for(const tag of ['strong','em','code','blockquote','ul'])assert.equal(nodes(card,tag).length,1);
 assert.equal(nodes(card,'a').length,0);
 assert.equal(nodes(card,'img').length,0);
});
test('bounded excerpts retain inline formatting and complete blocks',()=>{
 const excerpt=markdownExcerpt('# Heading\n\n**'+ 'formatted words '.repeat(40).trim()+'**',180);
 assert.ok(excerpt.length<=180);assert.ok(excerpt.startsWith('**'));assert.ok(excerpt.endsWith('**…'));
 assert.equal(markdownExcerpt('# Title\n\n> Quote\n\n- First\n- Second',180),'> Quote\n\n- First\n- Second');
});
test('excerpts skip rows of images so previews read as text',()=>{
 const excerpt=markdownExcerpt('First paragraph.\n\n![Before view](/screenshots/sample/2026-01-02/a.webp) ![After view](/screenshots/sample/2026-01-02/b.webp)\n\nSecond paragraph.',400);
 assert.ok(!excerpt.includes('Before view')&&!excerpt.includes('!['),excerpt);
 assert.ok(excerpt.includes('First paragraph.')&&excerpt.includes('Second paragraph.'));
});
