import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderDocument,safeDocumentUrl} from '../src/scripts/document-reader.ts';
import {screenshotImage} from '../src/scripts/image-lightbox.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
const snapshots=JSON.parse(readFileSync(new URL('../src/content/repository-documents.json',import.meta.url),'utf8'));
const source='https://github.com/babunidev/WorkThatGodBod/blob/abcdef/docs/CONTENT.md';

test('markdown reader renders a fixed synthetic rich-text fixture',t=>{
 documentDOM(t);
 const body='# Sample\n\n**Author:** Sample  \nSecond line of the paragraph.\n\n> An *invitation* to explore\n\nUse `EXERCISES` and **highlight**.';
 const reader=renderDocument(body,source);
 assert.ok(nodes(reader,'strong').some(n=>n.textContent==='Author:'));
 assert.ok(nodes(reader,'strong').some(n=>n.textContent==='highlight'));
 assert.ok(nodes(reader,'code').some(n=>n.textContent==='EXERCISES'));
 assert.ok(nodes(reader,'blockquote').length>0);
 assert.ok(nodes(reader,'em').some(n=>n.textContent==='invitation'));
 assert.ok(nodes(reader,'br').length>=1);
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
  for(const tag of ['script','iframe','object','style'])assert.equal(nodes(reader,tag).length,0);
  const thumbs=nodes(reader,'button').filter(n=>n.className==='screenshot-thumb');
  assert.equal(nodes(reader,'img').length,thumbs.length,document.path+': only published screenshots may embed');
  count++;
 }
 assert.ok(count>=376,'the imported public Markdown baseline must remain available');
});
test('own /about-links/ thumbnails turn image + bold link + text into one card link; others do not',t=>{
 documentDOM(t);
 const reader=renderDocument('![](/about-links/sample.webp)\n**[Sample site](https://example.com/)**\nA short description.\n\n![](https://evil.example/x.webp)\n**[Other](https://example.com/other)**\nText.');
 const cards=nodes(reader,'a').filter(a=>a.className==='link-card');
 assert.equal(cards.length,1);
 assert.equal(cards[0].href,'https://example.com/');assert.equal(cards[0].target,'_blank');
 assert.equal(nodes(cards[0],'img')[0].src,'/about-links/sample.webp');
 assert.equal(nodes(cards[0],'strong')[0].textContent,'Sample site');
 assert.ok(cards[0].textContent.includes('A short description.'));
 assert.equal(nodes(reader,'img').length,1,'foreign images never load');
});
test('readers group text into one card per main section; previews stay unsectioned',t=>{
 documentDOM(t);
 const body='# Title\n\nIntro text.\n\n## One\n\nFirst.\n\n### Detail\n\nStill one.\n\n## Two\n\nSecond.';
 const sections=nodes(renderDocument(body),'section').filter(n=>n.className==='document-section');
 assert.equal(sections.length,3);
 assert.ok(sections[0].textContent.startsWith('Title'));
 assert.ok(sections[1].textContent.includes('Still one.'));
 assert.ok(sections[2].textContent.startsWith('Two'));
 assert.equal(nodes(renderDocument('Plain paragraph only.'),'section').length,1);
 assert.equal(nodes(renderDocument(body,undefined,false),'section').length,0);
 assert.equal(nodes(renderDocument('## A\n\nx\n\n## B\n\ny'),'section').length,2);
});
test('published development screenshots render as thumbnails; other images stay links',t=>{
 documentDOM(t);
 const body='Before the change.\n\n![Phone view](https://www.babuni.dev/screenshots/sample-game/2026-01-02/phone-view.webp) ![Desk](/screenshots/sample-game/2026-01-02/desk.webp)\n\nInline ![Inline shot](https://babuni.dev/screenshots/sample-game/2026-01-02/inline.webp) here.\n\n![Elsewhere](https://example.com/screenshots/sample-game/2026-01-02/x.webp) ![Wrong](/screenshots/sample-game/2026-01-02/x.png)';
 const reader=renderDocument(body,source);
 const thumbs=nodes(reader,'button').filter(n=>n.className==='screenshot-thumb');
 assert.equal(thumbs.length,3);
 assert.deepEqual(nodes(reader,'img').map(n=>n.src),['/screenshots/sample-game/2026-01-02/thumbs/phone-view.webp','/screenshots/sample-game/2026-01-02/thumbs/desk.webp','/screenshots/sample-game/2026-01-02/thumbs/inline.webp']);
 assert.equal(nodes(reader,'div').filter(n=>n.className==='screenshot-row').length,1);
 assert.equal(nodes(reader,'img')[0].alt,'Phone view');
 assert.equal(nodes(reader,'a').length,2,'foreign hosts and non-WebP files remain plain links');
 assert.equal(nodes(renderDocument(body,source,false),'img').length,0,'previews never fetch images');
 for(const bad of ['https://www.babuni.dev.evil.com/screenshots/a/2026-01-02/x.webp','/screenshots/a/2026-01-02/../x.webp','/screenshots/A/2026-01-02/x.webp','//babuni.dev/screenshots/a/2026-01-02/x.webp','/media/a/screenshots/2026-01-02/x.webp'])assert.equal(screenshotImage(bad),null,bad);
});
