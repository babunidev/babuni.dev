import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderDocument,safeDocumentUrl} from '../src/scripts/document-reader.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
const snapshots=JSON.parse(readFileSync(new URL('../src/content/repository-documents.json',import.meta.url),'utf8'));
const source='https://github.com/babunidev/WorkThatGodBod/blob/abcdef/docs/CONTENT.md';

test('the reported WorkThatGodBod document renders emphasis, inline code, quotes and hard breaks',t=>{
 documentDOM(t);
 const body=snapshots['babunidev/WorkThatGodBod'].documents.find(d=>d.path==='docs/CONTENT.md').body;
 const reader=renderDocument(body,source);
 assert.ok(nodes(reader,'strong').some(n=>n.textContent==='Author:'));
 assert.ok(nodes(reader,'strong').some(n=>n.textContent.includes('99 unique English-language prompt strings')));
 assert.ok(nodes(reader,'code').some(n=>n.textContent==='EXERCISES'));
 assert.ok(nodes(reader,'blockquote').length>=3);
 assert.ok(nodes(reader,'em').some(n=>n.textContent==='invitation'));
 assert.ok(nodes(reader,'br').length>=1);
 assert.ok(!reader.textContent.includes('**Author:**'));
});
test('tables, nested ordered lists, tasks, strikeout and fenced code use semantic elements',t=>{
 documentDOM(t);
 const reader=renderDocument('3. First\n   - Nested **item**\n4. Second\n\n- [x] Done\n- [ ] Later\n\n| Name | Value |\n| --- | ---: |\n| **Count** | `99` |\n\n~~old~~\n\n```html\n<script>example()</script>\n```');
 assert.equal(nodes(reader,'ol')[0].attributes.start,'3');
 assert.ok(nodes(reader,'li').some(li=>nodes(li,'ul').length>0));
 assert.deepEqual(nodes(reader,'input').map(n=>[n.disabled,n.checked]),[[true,true],[true,false]]);
 assert.ok(!reader.textContent.includes('[x]'));
 assert.equal(nodes(reader,'th').length,2);assert.equal(nodes(reader,'td')[1].style.textAlign,'right');
 assert.equal(nodes(reader,'del')[0].textContent,'old');
 assert.equal(nodes(reader,'pre')[0].textContent,'<script>example()</script>');
});
test('relative and reference links resolve against the source; heading links scroll inside the reader',t=>{
 documentDOM(t);
 const reader=renderDocument('[Jump](#reading) · [Relative](../README.md) · [Reference][ref]\n\n## Reading\n\nText\n\n## Reading\n\n[Second](#reading-1)\n\n[ref]: https://example.com/path "Example"',source);
 const links=nodes(reader,'a'),headings=nodes(reader,'h3');
 assert.equal(links[1].href,'https://github.com/babunidev/WorkThatGodBod/blob/abcdef/README.md');
 assert.equal(links[2].href,'https://example.com/path');assert.equal(links[2].title,'Example');
 assert.equal(links[0].href,'#document-reading');assert.equal(links[3].href,'#document-reading-1');
 let prevented=false;links[0].listeners.get('click')({preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(headings[0].scrolled,true);
});
test('raw HTML stays literal, dangerous links stay inert, and image references do not auto-fetch',t=>{
 documentDOM(t);
 const reader=renderDocument('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29) [data](data:text/html,evil) [encoded](javascript&#58;alert%281%29)\n\n![Example](../image.webp)\n\nA &amp; B &lt;safe&gt; &#169;',source);
 assert.equal(nodes(reader,'script').length,0);assert.equal(nodes(reader,'img').length,0);
 assert.ok(reader.textContent.includes('<script>alert(1)</script>'));
 assert.ok(nodes(reader,'a').slice(0,3).every(n=>n.href===undefined));
 assert.ok(nodes(reader,'a')[3].href.endsWith('/image.webp'));
 assert.ok(reader.textContent.includes('A & B <safe> ©'));
 for(const url of ['javascript:alert(1)','java\nscript:alert(1)','data:text/html,x','https://name:secret@example.com'])assert.equal(safeDocumentUrl(url,source),null);
});
test('every imported document parses without introducing executable source elements',t=>{
 documentDOM(t);let count=0;
 for(const snapshot of Object.values(snapshots))for(const document of snapshot.documents){
  const reader=renderDocument(document.body,`https://github.com/${snapshot.repository}/blob/${snapshot.commit}/${document.path}`);
  assert.ok(reader.textContent.trim(),document.path);
  for(const tag of ['script','iframe','object','img','style'])assert.equal(nodes(reader,tag).length,0);
  count++;
 }
 assert.equal(count,316);
});
