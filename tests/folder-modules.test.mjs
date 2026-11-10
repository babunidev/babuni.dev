import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,existsSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {
  folderDocumentPath,pairedImages,repositoryImageUrl,indexedFolderModules,loadIndexedBody,connectionFolders
} from '../src/lib/repository-content.ts';
import {validateConnections,validateSnapshots,storeRepositoryImages} from '../scripts/sync-repositories.mjs';
import {compareSnapshots} from '../scripts/pull-repository.mjs';

const SHA='a'.repeat(40),SHA2='b'.repeat(40);
const repository='babunidev/ExampleFixture';
const connection={status:'connected',repository,branch:'main',folders:['lore','notes']};

test('folder documents: only Markdown inside opted-in folders, with conservative names', () => {
  assert.ok(folderDocumentPath('lore/HEARTH.md',['lore']));
  assert.ok(folderDocumentPath('lore/deep/Old_Fire-2.md',['lore']));
  assert.ok(!folderDocumentPath('README.md',['lore']));
  assert.ok(!folderDocumentPath('other/HEARTH.md',['lore']));
  assert.ok(!folderDocumentPath('lore/../secret.md',['lore']));
  assert.ok(!folderDocumentPath('lore/HEARTH.txt',['lore']));
  assert.deepEqual(connectionFolders(undefined),[]);
});

test('an image pairs with the document of the same name in the same folder', () => {
  const pairs=pairedImages(
    ['lore/HEARTH.md','lore/FIRE.md','notes/HEARTH.md'],
    ['lore/HEARTH.png','lore/HEARTH.webp','lore/OTHER.png','notes/deep/HEARTH.png','lore/FIRE.gif'],
  );
  assert.deepEqual([...pairs],[['lore/HEARTH.md','lore/HEARTH.webp']]);
});

test('paired images get a deterministic WebP address', () => {
  assert.equal(repositoryImageUrl(repository,'lore/deep/HEARTH.png'),'/media/repositories/babunidev--ExampleFixture/lore--deep--HEARTH.webp');
  assert.throws(()=>repositoryImageUrl(repository,'../x.png'));
  assert.throws(()=>repositoryImageUrl('someone/else','lore/x.png'));
});

test('each opted-in folder becomes one document list; documents keep their paired image', () => {
  const index={repository,branch:'main',commit:SHA,documents:[
    {path:'README.md',url:'/_project-docs/babunidev--ExampleFixture/README.md',preview:'',intro:''},
    {path:'lore/HEARTH.md',url:'/_project-docs/babunidev--ExampleFixture/lore--HEARTH.md',preview:'',intro:'',image:'/media/repositories/babunidev--ExampleFixture/lore--HEARTH.webp'},
    {path:'lore/FIRE.md',url:'/_project-docs/babunidev--ExampleFixture/lore--FIRE.md',preview:'',intro:''},
  ]};
  const modules=indexedFolderModules(connection,index);
  assert.deepEqual(modules.map(m=>m.id),['folder-lore']); // empty "notes" folder is skipped
  const [lore]=modules;
  assert.equal(lore.type,'document-list');
  assert.deepEqual(lore.documents.map(d=>[d.title,d.image]),[['FIRE.md',undefined],['HEARTH.md','/media/repositories/babunidev--ExampleFixture/lore--HEARTH.webp']]);
  assert.ok(lore.documents.every(d=>d.source.includes('/blob/'+SHA+'/')));
  assert.deepEqual(indexedFolderModules({...connection,folders:undefined},index),[]);
  assert.deepEqual(indexedFolderModules(connection,{...index,commit:null}),[]);
});

test('folder settings are validated', () => {
  const ids=['a'];
  assert.deepEqual(validateConnections({a:connection},ids),[]);
  assert.equal(validateConnections({a:{...connection,folders:['docs']}},ids).length,1);
  assert.equal(validateConnections({a:{...connection,folders:['../up']}},ids).length,1);
  assert.equal(validateConnections({a:{...connection,folders:['lore','lore']}},ids).length,1);
  assert.equal(validateConnections({a:{status:'needs-repository',folders:['lore']}},ids).length,1);
});

test('snapshot images must pair one-to-one with imported folder documents', () => {
  const base={repository,branch:'main',commit:SHA,syncedAt:'2026-01-01T00:00:00Z',documents:[
    {path:'README.md',body:'Fixture'},{path:'lore/HEARTH.md',body:'Fixture lore'}]};
  const connections={a:connection};
  assert.deepEqual(validateSnapshots(connections,{[repository]:{...base,images:[{path:'lore/HEARTH.png',sha:SHA2}]}}),[]);
  assert.equal(validateSnapshots(connections,{[repository]:{...base,images:[{path:'lore/OTHER.png',sha:SHA2}]}}).length,1);
  assert.equal(validateSnapshots(connections,{[repository]:{...base,images:[{path:'lore/HEARTH.png',sha:'nope'}]}}).length,1);
});

test('the pull compares images as well as documents', () => {
  const docs=[{path:'README.md',body:'same'}];
  const changes=compareSnapshots(
    {documents:docs,images:[{path:'lore/A.png',sha:SHA},{path:'lore/B.png',sha:SHA}]},
    {documents:docs,images:[{path:'lore/A.png',sha:SHA2},{path:'lore/C.png',sha:SHA}]},
  );
  assert.deepEqual(changes,[{path:'lore/A.png',kind:'CHANGED'},{path:'lore/C.png',kind:'NEW'},{path:'lore/B.png',kind:'REMOVED'}]);
});

test('paired images are stored as WebP, reused when unchanged and removed when gone', async () => {
  const {default:sharp}=await import('sharp');
  const png=await sharp({create:{width:32,height:20,channels:3,background:'#c98a4b'}}).png().toBuffer();
  const base=mkdtempSync(join(tmpdir(),'folder-images-'));
  try{
    let requests=0;
    const fetcher=async url=>{requests++;assert.ok(url.startsWith('https://raw.githubusercontent.com/'+repository+'/'+SHA+'/'));return new Response(png);};
    const snapshot={repository,commit:SHA,images:[{path:'lore/HEARTH.png',sha:SHA2}]};
    await storeRepositoryImages(snapshot,undefined,{base,fetcher});
    const file=join(base,'public',repositoryImageUrl(repository,'lore/HEARTH.png'));
    const bytes=readFileSync(file);
    assert.equal(bytes.toString('ascii',0,4),'RIFF');
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
    await storeRepositoryImages(snapshot,snapshot,{base,fetcher});
    assert.equal(requests,1,'an unchanged image is not downloaded again');
    await storeRepositoryImages({...snapshot,images:[]},snapshot,{base,fetcher});
    assert.ok(!existsSync(file));
  }finally{rmSync(base,{recursive:true,force:true});}
});

test('the reader opens folder documents only for connected repositories and their folders', async () => {
  const connections=JSON.parse(readFileSync(new URL('../src/content/project-repositories.json',import.meta.url),'utf8'));
  const echo=async url=>new Response(url);
  for(const c of Object.values(connections).filter(c=>c.status==='connected'&&c.folders)){
    const prefix='/_project-docs/'+c.repository.replace('/','--')+'/';
    for(const folder of c.folders){
      assert.equal(await loadIndexedBody(prefix+folder+'--FIXTURE.md',echo),prefix+folder+'--FIXTURE.md');
      await assert.rejects(loadIndexedBody('/_project-docs/babunidev--NotConnectedFixture/'+folder+'--FIXTURE.md',echo));
    }
    await assert.rejects(loadIndexedBody(prefix+'unlisted--FIXTURE.md',echo));
    await assert.rejects(loadIndexedBody(prefix+c.folders[0]+'--..--FIXTURE.md',echo));
  }
});
