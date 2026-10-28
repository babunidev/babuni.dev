import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REPOSITORY_DOCUMENTS,repositoryModules,composeProjectModules,documentPreview} from '../src/lib/repository-content.ts';
import {moduleHasContent,selectModules} from '../src/lib/project-modules.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {validateConnections,validateSnapshots,fetchSnapshot,syncSnapshots} from '../scripts/sync-repositories.mjs';
const read=path=>JSON.parse(readFileSync(new URL('../src/content/'+path,import.meta.url),'utf8'));
const connections=read('project-repositories.json'),snapshots=read('repository-documents.json'),catalog=read('project-modules.json');
const local=Object.fromEntries(REPOSITORY_DOCUMENTS.map(d=>[d.path,readFileSync(new URL('../'+d.path,import.meta.url),'utf8')]));
const commit='a'.repeat(40),connection={status:'connected',repository:'babunidev/example',branch:'master'};
const metadata={private:false,visibility:'public',full_name:'babunidev/example'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status});
test('all 53 tiles have explicit status; all public source snapshots match their mapping',()=>{
 assert.deepEqual(validateConnections(connections,demoProjects.map(p=>p.id)),[]);
 assert.deepEqual(validateSnapshots(connections,snapshots),[]);
 assert.equal(Object.values(connections).filter(c=>c.status==='connected').length,38);
 assert.equal(Object.keys(snapshots).length,36);
 for(const [id,c] of Object.entries(connections)){
  const source=repositoryModules(c,snapshots[c.repository],local);
  if(c.status!=='connected'){assert.deepEqual(source,[]);continue;}
  assert.ok(source.length>0,id);
  const merged=composeProjectModules(catalog[id]??[],source,c.repository);
  assert.equal(new Set(merged.map(m=>m.id)).size,merged.length);
  assert.equal(selectModules(merged).length,Math.min(8,merged.filter(moduleHasContent).length));
  for(const module of source){
   const doc=REPOSITORY_DOCUMENTS.find(d=>d.id===module.id);
   assert.equal(module.body,c.repository==='babunidev/babuni.dev'?local[doc.path]:snapshots[c.repository].documents.find(d=>d.path===doc.path).body);
   assert.ok(module.preview.trim());assert.ok(module.source.startsWith(`https://github.com/${c.repository}/blob/`));
  }
 }
});
test('source text replaces curated bodies; existing media and meaningful previews survive',()=>{
 const c=connections['babuni-dev'];const sourced=repositoryModules(c,undefined,local);
 const merged=composeProjectModules(catalog['babuni-dev'],sourced,c.repository);
 assert.equal(merged.find(m=>m.id==='overview').body,local['README.md']);
 assert.equal(merged.find(m=>m.id==='overview').preview,catalog['babuni-dev'].find(m=>m.id==='overview').preview);
 assert.deepEqual(merged.find(m=>m.id==='videos').videos,catalog['babuni-dev'].find(m=>m.id==='videos').videos);
 assert.equal(merged.filter(moduleHasContent).length,13);
 assert.ok(composeProjectModules(catalog['button-game'],repositoryModules(connections['button-game'],snapshots['babunidev/ButtonGame']), 'babunidev/ButtonGame').filter(moduleHasContent).length>5);
});
test('shared source selects only its explicit documents; missing docs do not create filler',()=>{
 const selected=repositoryModules(connections['human-ai-development-journal'],undefined,local);
 assert.deepEqual(selected.map(m=>m.id),['journal','decisions','collaboration']);
 const sparse={repository:connection.repository,branch:'master',commit,documents:[{path:'README.md',body:'# Example\n\nA real source introduction.'}]};
 assert.deepEqual(repositoryModules(connection,sparse).map(m=>m.id),['overview']);
 assert.equal(repositoryModules(connection,{...sparse,branch:'main'}).length,0);
 assert.equal(documentPreview('# Title\n\n**Author:** Babuni.dev\n\nActual introduction.\n\nMore text.'),'Actual introduction.');
});
test('manifest and snapshots reject unknown IDs, private mappings, unsafe paths and stale branches',()=>{
 assert.ok(validateConnections({x:{status:'private-review',repository:'babunidev/private'}},['x']).length);
 assert.ok(validateConnections({x:{...connection,paths:['AGENTS.md']}},['x']).length);
 assert.ok(validateConnections({x:{...connection,branch:'../bad'}},['x']).length);
 assert.ok(validateConnections({},['missing']).length);
 assert.ok(validateConnections({a:connection,b:{...connection,branch:'different'}},['a','b']).some(e=>e.includes('same branch')));
 const bad=structuredClone(snapshots);bad['babunidev/ButtonGame'].branch='different';
 assert.ok(validateSnapshots(connections,bad).some(e=>e.includes('ButtonGame')));
});
test('sync resolves one revision per public repo, allows missing files and uses only pinned raw URLs',async()=>{
 const calls=[];let resolutions=0;
 const snapshot=await fetchSnapshot(connection,{resolveCommit:async(repo,branch)=>{assert.equal(branch,'master');resolutions++;return commit;},now:()=> '2026-10-27T00:00:00Z',fetcher:async url=>{
  calls.push(url);if(url.startsWith('https://api.github.com/'))return json(metadata);
  return url.endsWith('/README.md')?new Response('# Real\n\nSource text.'):new Response('',{status:404});
 }});
 assert.equal(resolutions,1);assert.equal(snapshot.commit,commit);assert.deepEqual(snapshot.documents,[{path:'README.md',body:'# Real\n\nSource text.'}]);
 assert.ok(calls.slice(1).every(url=>url.includes('/'+commit+'/')));
});
test('private repositories and failed fetches never yield a publishable snapshot',async()=>{
 let resolved=false;
 await assert.rejects(()=>fetchSnapshot(connection,{fetcher:async()=>json({...metadata,private:true,visibility:'private'}),resolveCommit:async()=>{resolved=true;return commit;}}),/public visibility/);
 assert.equal(resolved,false);
 await assert.rejects(()=>fetchSnapshot(connection,{fetcher:async url=>url.includes('api.github.com')?json(metadata):new Response('',{status:429}),resolveCommit:async()=>commit}),/429/);
 await assert.rejects(()=>fetchSnapshot(connection,{fetcher:async url=>url.includes('api.github.com')?json(metadata):new Response('',{status:404}),resolveCommit:async()=>commit}),/no nonempty/);
});
test('refresh deduplicates shared repositories and excludes private/local projects',async()=>{
 const calls=[];
 const result=await syncSnapshots({a:connection,b:connection,c:{status:'private-review'},d:connections['babuni-dev']},{fetchOne:async c=>{calls.push(c.repository);return {repository:c.repository,branch:c.branch,commit,documents:[]};}});
 assert.deepEqual(calls,['babunidev/example']);assert.deepEqual(Object.keys(result),calls);
 await assert.rejects(()=>syncSnapshots({a:connection},{fetchOne:async()=>{throw new Error('offline');}}),/offline/);
});

test('repository coverage report matches the map and never lists private repository URLs',async()=>{
 const {repositoryReport}=await import('../scripts/repository-report.mjs');
 const report=repositoryReport(demoProjects,connections,snapshots);
 assert.equal(report,readFileSync(new URL('../docs/REPOSITORY_CONNECTIONS.md',import.meta.url),'utf8'));
 assert.ok(report.includes('Local Prompt Lab'));
 assert.equal(Object.values(connections).filter(c=>c.status==='needs-repository').length,12);
 assert.ok(report.includes('AsnkarGrotzschnapf'));assert.ok(report.includes('| master |'));
 for(const name of ['Ethera','Morkahja','MorkahjaWorld','arcanitebrothers'])assert.doesNotMatch(report,new RegExp('https://github\\.com/babunidev/'+name+'(?:[)/#?\\s]|$)'));
 assert.ok(report.includes('https://github.com/babunidev/Ethera-docs'));
});

test('four documentation-only projects use pinned public editions rather than private implementations',()=>{
 const editions={'ethera-the-stonewrought':'Ethera-docs','morkahja-rpg':'Morkahja-docs','morkahjaworld':'MorkahjaWorld-docs',arcanitebrothers:'arcanitebrothers-docs'};
 for(const [id,name] of Object.entries(editions)){
  const c=connections[id];assert.equal(c.status,'connected');assert.equal(c.repository,'babunidev/'+name);
  const snapshot=snapshots[c.repository];assert.match(snapshot.commit,/^[a-f0-9]{40}$/);assert.equal(snapshot.documents.length,10);
  assert.equal(repositoryModules(c,snapshot).length,10);
 }
 for(const name of ['Ethera','Morkahja','MorkahjaWorld','arcanitebrothers'])assert.equal(snapshots['babunidev/'+name],undefined);
});

test('public edition previews describe the project rather than edition metadata',()=>{
 const c=connections['ethera-the-stonewrought'];
 const concept=repositoryModules(c,snapshots[c.repository]).find(m=>m.id==='concept');
 assert.ok(concept.preview.startsWith('Ethera is the current Grimnir chapter'));
 assert.ok(!concept.preview.includes('Curated public documentation'));
});
