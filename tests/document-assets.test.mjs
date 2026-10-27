import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {prepareDocumentAssets,documentAssetName} from '../scripts/build-document-assets.mjs';
import {REPOSITORY_DOCUMENTS,indexedRepositoryModules,composeProjectModules,loadIndexedBody} from '../src/lib/repository-content.ts';
import {moduleHasContent,selectModules} from '../src/lib/project-modules.ts';
import {moduleIntro} from '../src/lib/big-bloom.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
const fromRoot=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const connections=JSON.parse(fromRoot('src/content/project-repositories.json'));
const snapshots=JSON.parse(fromRoot('src/content/repository-documents.json'));
const published=JSON.parse(fromRoot('src/generated/document-index.json'));
const local=Object.fromEntries(REPOSITORY_DOCUMENTS.map(d=>[d.path,fromRoot(d.path)]));
test('on-demand bundle manifest includes only connected public source documents',()=>{
  const {index,assets}=prepareDocumentAssets(connections,snapshots,local);
  assert.deepEqual(index,published);
  const repoNames=new Set(Object.values(connections).filter(c=>c.status==='connected').map(c=>c.repository));
  assert.deepEqual(new Set(Object.keys(index)),repoNames);
  for(const c of Object.values(connections)){
    if(c.status!=='connected')assert.equal(index[c.repository],undefined);
  }
  assert.ok(assets.size>200,'expect the checked-in public documentation set');
  for(const [name,body] of assets){
    assert.equal(fromRoot('public/_project-docs/'+name),body);
    assert.ok(body.trim());
  }
  assert.equal(documentAssetName('babunidev/ButtonGame','docs/DEVLOG.md'),
    'babunidev--ButtonGame/docs--DEVLOG.md');
  assert.throws(()=>documentAssetName('anyone/private','AGENTS.md'));
  assert.throws(()=>documentAssetName('babunidev/ButtonGame','../secret.md'));
});
test('document index carries short previews but not whole Markdown bodies',()=>{
  for(const entry of Object.values(published)){
    for(const document of entry.documents){
      assert.ok(document.preview.length<=180);
      assert.ok(document.intro.length<=1601);
      assert.ok(document.url.startsWith('/_project-docs/babunidev--'));
      assert.ok(existsSync(new URL('../public'+document.url,import.meta.url)));
    }
  }
  assert.ok(fromRoot('src/content/repository-documents.json').length>
    fromRoot('src/generated/document-index.json').length);
});
test('synchronous previews and big bloom intro retain exact source attribution',()=>{
  for(const project of demoProjects){
    const connection=connections[project.id];
    const metadata=connection.repository?published[connection.repository]:undefined;
    const source=indexedRepositoryModules(connection,metadata);
    if(connection.status!=='connected'){assert.deepEqual(source,[]);continue;}
    assert.ok(source.length>0,project.id);
    for(const module of source){
      const path=REPOSITORY_DOCUMENTS.find(d=>d.id===module.id).path;
      const body=connection.repository==='babunidev/babuni.dev'
        ?local[path]:snapshots[connection.repository].documents.find(d=>d.path===path).body;
      assert.equal(moduleIntro(module),moduleIntro({body,preview:module.preview}));
      assert.equal(module.body,'');
      assert.equal(moduleHasContent(module),true);
      assert.match(module.bodyUrl,/^\/_project-docs\//);
    }
    const merged=composeProjectModules([],source,connection.repository);
    assert.equal(selectModules(merged,()=>.5).length,Math.min(8,merged.filter(moduleHasContent).length));
  }
});
test('reader accepts only published same-origin paths and handles failed requests',async()=>{
  const url='/_project-docs/babunidev--ButtonGame/docs--DEVLOG.md';
  let requested='';
  const fetched=await loadIndexedBody(url,async (path)=>{requested=path;return new Response('full original Markdown');});
  assert.equal(requested,url);
  assert.equal(fetched,'full original Markdown');
  await assert.rejects(()=>loadIndexedBody('https://example.com/evil.md'),/Invalid/);
  await assert.rejects(()=>loadIndexedBody('/_project-docs/babunidev--repo/AGENTS.md'),/Invalid/);
  await assert.rejects(()=>loadIndexedBody(url,async()=>new Response('',{status:404})),/404/);
});
test('interactive browser bundle no longer imports full snapshots or raw Markdown',()=>{
  const content=fromRoot('src/lib/project-content.ts');
  const reader=fromRoot('src/scripts/module-detail.ts');
  assert.doesNotMatch(content,/import snapshots from|repository-documents\.json|\?raw/);
  assert.match(content,/generated\/document-index\.json/);
  assert.match(reader,/createDocumentBody\(/);
  const body=fromRoot('src/scripts/document-body.ts');
  assert.match(body,/loadIndexedBody\(/);
  assert.match(body,/Retry document/);
});
