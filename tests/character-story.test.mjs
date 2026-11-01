import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {modulesForProject} from '../src/lib/project-content.ts';
import {moduleHasContent,selectModules} from '../src/lib/project-modules.ts';
import {
  CHARACTER_STORY_REPOSITORY,CHARACTER_STORY_FOLDERS,CHARACTER_STORY_ROOT_FILES,
  indexedCharacterStoryFolders,loadIndexedBody,characterStoryDocumentPath
} from '../src/lib/repository-content.ts';
import {documentAssetName} from '../scripts/build-document-assets.mjs';

const json=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const connections=json('src/content/project-repositories.json');
const snapshots=json('src/content/repository-documents.json');
const index=json('src/generated/document-index.json');

test('Buxbrew folder modules cover all imported Markdown and preserve the 42-project catalog',()=>{
  const connection=connections['amberbrew-story'];
  assert.equal(CHARACTER_STORY_REPOSITORY,'babunidev/AmberbrewStory');
  assert.equal(connection.repository,CHARACTER_STORY_REPOSITORY);
  assert.equal(connections['buxbrew-character-story'],undefined);
  assert.equal(snapshots['babunidev/BuxbrewCharacterStory'],undefined);
  const snapshot=snapshots[CHARACTER_STORY_REPOSITORY];
  assert.match(snapshot.commit,/^[a-f0-9]{40}$/);
  assert.ok(snapshot.documents.length>=40);
  const folders=indexedCharacterStoryFolders(connection,index[CHARACTER_STORY_REPOSITORY]);
  assert.deepEqual(folders.map(x=>x.id),CHARACTER_STORY_FOLDERS.map(x=>'folder-'+x));
  assert.ok(folders.every(moduleHasContent));
  const all=new Set(folders.flatMap(module=>module.documents.map(d=>d.path)));
  for(const file of snapshot.documents){
    assert.ok(file.body.trim(),file.path);
    assert.ok(file.path.startsWith('docs/')||all.has(file.path)||['README.md','CONCEPT.md','CHANGELOG.md','ROADMAP.md'].includes(file.path),
      'missing indexed source: '+file.path);
    assert.ok(existsSync(new URL('../public/_project-docs/'+documentAssetName(CHARACTER_STORY_REPOSITORY,file.path),import.meta.url)));
  }
  assert.ok(folders.find(x=>x.id==='folder-character').documents.length>=9);
  assert.ok(folders.find(x=>x.id==='folder-family').documents.length>=6);
  assert.ok(folders.find(x=>x.id==='folder-docs').documents.length>=8);
  for(const file of CHARACTER_STORY_ROOT_FILES)
    assert.ok(folders.find(x=>x.id==='folder-docs').documents.some(d=>d.path===file),file);
  const assets=folders.find(x=>x.id==='folder-assets');
  assert.ok(Array.isArray(assets.documents)); // Empty today; may contain public Markdown after a later source sync.
  assert.deepEqual(assets.links.map(x=>x.label),['Illustrations','References','Screenshots']);
  const modules=modulesForProject('amberbrew-story','Buxbrew roleplaying story');
  assert.ok(modules.length>=18); // Standard docs can grow without changing the folder index count.
  assert.equal(new Set(modules.map(x=>x.id)).size,modules.length);
  assert.equal(modules.filter(x=>x.type==='document-list').length,9);
  assert.ok(modules.some(x=>x.id==='source'));
  assert.equal(selectModules(modules,()=>.5).length,8);
});

test('every folder file opens through a pinned, same-origin reader URL',async()=>{
  const folders=indexedCharacterStoryFolders(connections['amberbrew-story'],index[CHARACTER_STORY_REPOSITORY]);
  const paths=new Set();
  for(const folder of folders)for(const item of folder.documents){
    assert.ok(characterStoryDocumentPath(item.path));
    assert.equal(item.bodyUrl,'/_project-docs/'+documentAssetName(CHARACTER_STORY_REPOSITORY,item.path));
    assert.ok(item.source.includes('/blob/'+index[CHARACTER_STORY_REPOSITORY].commit+'/'));
    paths.add(item.path);
    const text=await loadIndexedBody(item.bodyUrl,async url=>new Response(url));
    assert.equal(text,item.bodyUrl);
  }
  assert.ok(paths.has('CANON.md'));
  assert.ok(paths.has('journal/TEMPLATE.md'));
  for(const path of [
    '/_project-docs/babunidev--AnotherRepo/character--backstory.md',
    '/_project-docs/babunidev--AmberbrewStory/..--secret.md',
    '/_project-docs/babunidev--BuxbrewCharacterStory/character--backstory.md',
    '/_project-docs/babunidev--AmberbrewStory/assets--photo.webp',
    'https://github.com/babunidev/AmberbrewStory'
  ])await assert.rejects(()=>loadIndexedBody(path),/Invalid project document URL/);
});
