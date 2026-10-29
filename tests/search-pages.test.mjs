import test from 'node:test';import assert from 'node:assert/strict';
import {markdownHtml} from '../src/lib/server/markdown-html.ts';
import {readFileSync,existsSync} from 'node:fs';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {SITE_URL,projectPath,modulePath} from '../src/lib/site.ts';
test('static reading HTML escapes raw markup and rejects executable URL schemes',()=>{
 const html=markdownHtml('# Title\n\n**Readable** [unsafe](javascript:alert%281%29)\n\n<script>alert(1)</script>\n\n[relative](docs/CONTENT.md)\n\n![picture](https://example.com/image.webp)','https://github.com/babunidev/Repo/blob/main/README.md');
 assert.match(html,/<h2/);assert.match(html,/<strong>Readable<\/strong>/);assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href="javascript:'));assert.ok(html.includes('https://github.com/babunidev/Repo/blob/main/docs/CONTENT.md'));assert.ok(!html.includes('<img'));
});
test('prepared module collections cover exactly the approved current catalog',()=>{
 for(const project of demoProjects){const path=new URL('../public/_project-modules/'+project.id+'.json',import.meta.url);assert.ok(existsSync(path));const modules=JSON.parse(readFileSync(path));assert.ok(modules.length);assert.ok(modules.every(m=>m.id&&m.type));}
 assert.equal(SITE_URL,'https://www.babuni.dev');assert.equal(modulePath('lootfeed','changes'),'/projects/lootfeed/changes/');assert.equal(projectPath('lootfeed'),'/projects/lootfeed/');
});
