import {presentDocument} from '../src/lib/document-presentation.ts';
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
test('all active tiles have explicit status; all public source snapshots match their mapping',()=>{
 assert.deepEqual(validateConnections(connections,demoProjects.map(p=>p.id)),[]);
 assert.deepEqual(validateSnapshots(connections,snapshots),[]);
 assert.equal(Object.values(connections).filter(c=>c.status==='connected').length,36);
 assert.equal(Object.keys(snapshots).length,35);
 for(const [id,c] of Object.entries(connections)){
  const source=repositoryModules(c,snapshots[c.repository],local);
  if(c.status!=='connected'){assert.deepEqual(source,[]);continue;}
  assert.ok(source.length>0,id);
  const merged=composeProjectModules(catalog[id]??[],source,c.repository);
  assert.equal(new Set(merged.map(m=>m.id)).size,merged.length);
  assert.equal(selectModules(merged).length,Math.min(8,merged.filter(moduleHasContent).length));
  for(const module of source){
   const doc=REPOSITORY_DOCUMENTS.find(d=>d.id===module.id);
   assert.equal(module.body,presentDocument(c.repository==='babunidev/babuni.dev'?local[doc.path]:snapshots[c.repository].documents.find(d=>d.path===doc.path).body,doc.path));
   assert.ok(module.preview.trim());assert.ok(module.source.startsWith(`https://github.com/${c.repository}/blob/`));
  }
 }
});
test('source text replaces curated bodies; existing media and meaningful previews survive',()=>{
 const c=connections['babuni-dev'];const sourced=repositoryModules(c,undefined,local);
 const merged=composeProjectModules(catalog['babuni-dev'],sourced,c.repository);
 assert.equal(merged.find(m=>m.id==='overview').body,presentDocument(local['README.md'],'README.md'));
 assert.equal(merged.find(m=>m.id==='overview').preview,catalog['babuni-dev'].find(m=>m.id==='overview').preview);
 assert.deepEqual(merged.find(m=>m.id==='videos').videos,catalog['babuni-dev'].find(m=>m.id==='videos').videos);
 assert.equal(merged.filter(moduleHasContent).length,13);
 assert.ok(composeProjectModules(catalog['button-game'],repositoryModules(connections['button-game'],snapshots['babunidev/ButtonGame']), 'babunidev/ButtonGame').filter(moduleHasContent).length>5);
});
test('explicit document subsets remain supported; missing docs do not create filler',()=>{
 const selected=repositoryModules({...connections['babuni-dev'],paths:['docs/DEVLOG.md','docs/DECISIONS.md','docs/AI_COLLABORATION.md']},undefined,local);
 assert.deepEqual(selected.map(m=>m.id),['journal','decisions','collaboration']);
 assert.equal(connections['human-ai-development-journal'],undefined);
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
 assert.ok(report.includes('Local AI'));
 assert.equal(Object.values(connections).filter(c=>c.status==='needs-repository').length,5);
 assert.ok(report.includes('AsnkarGrotzschnapf'));assert.ok(report.includes('| master |'));
 for(const name of ['Ethera','arcanitebrothers'])assert.doesNotMatch(report,new RegExp('https://github\\.com/babunidev/'+name+'(?:[)/#?\\s]|$)'));
 assert.ok(report.includes('https://github.com/babunidev/Ethera-docs'));
});

test('newly public projects use actual sources while Ethera retains its public edition',()=>{
 const editions={'ethera-the-stonewrought':'Ethera-docs','morkahja-rpg':'Morkahja','morkahjaworld':'MorkahjaWorld',arcanitebrothers:'babuni.admin'};
 for(const [id,name] of Object.entries(editions)){
  const c=connections[id];assert.equal(c.status,'connected');assert.equal(c.repository,'babunidev/'+name);
  const snapshot=snapshots[c.repository];assert.match(snapshot.commit,/^[a-f0-9]{40}$/);assert.equal(snapshot.documents.length,10);
  assert.equal(repositoryModules(c,snapshot).length,10);
 }
 for(const name of ['Ethera','Morkahja-docs','MorkahjaWorld-docs','babuni.admin-docs','arcanitebrothers'])assert.equal(snapshots['babunidev/'+name],undefined);
});

test('public edition previews describe the project rather than edition metadata',()=>{
 const c=connections['ethera-the-stonewrought'];
 const concept=repositoryModules(c,snapshots[c.repository]).find(m=>m.id==='concept');
 assert.ok(concept.preview.startsWith('Ethera is the current Grimnir chapter'));
 assert.ok(!concept.preview.includes('Curated public documentation'));
});

test('retired sources are absent while BABUNI journal material remains available',()=>{
 for(const id of ['wow-forever-talent-design-atlas','redridge-recipe-planner','human-ai-development-journal','morkahja-world-and-peoples','the-amberbrew-family','practical-templates-creator','warehouse-performance-model','dual-pc-streaming-setup','mech-arena','local-prompt-lab','morkahja-admin-console','fantasy-rpg-assets','fantasy-architecture','analubia'])assert.equal(connections[id],undefined);
 for(const repo of ['babunidev/wowforeverstuff','babunidev/Redridge-Recipe-Planner','babunidev/GuildChatAI'])assert.equal(snapshots[repo],undefined);
 const c=connections['babuni-dev'];const modules=composeProjectModules(catalog['babuni-dev'],repositoryModules(c,undefined,local),c.repository);
 for(const id of ['journal','decisions','collaboration'])assert.ok(modules.some(m=>m.id===id&&moduleHasContent(m)));
 const world=composeProjectModules(catalog['morkahjaworld'],repositoryModules(connections['morkahjaworld'],snapshots[connections['morkahjaworld'].repository]));
 assert.ok(world.some(m=>m.id==='scope-clarification'&&m.body.includes('worldbuilding project')));
});

test('Babuni Admin links its actual public repository and publication decisions are imported',()=>{
 assert.equal(demoProjects.find(p=>p.id==='arcanitebrothers').name,'Babuni Admin');
 const c=connections.arcanitebrothers;assert.equal(c.repository,'babunidev/babuni.admin');
 const modules=composeProjectModules(catalog.arcanitebrothers,repositoryModules(c,snapshots[c.repository]),c.repository);
 const source=modules.find(m=>m.id==='source');assert.equal(source.title,'Project source');
 assert.match(source.preview,/previously listed as Arcanitebrothers/);
 assert.deepEqual(source.links.map(l=>l.href),['https://github.com/babunidev/babuni.admin']);
 for(const name of ['Morkahja','MorkahjaWorld','babuni.admin']){
  for(const path of ['docs/DECISIONS.md','docs/DEVLOG.md']){
   const document=snapshots['babunidev/'+name].documents.find(d=>d.path===path);
   assert.match(document.body,/Babuni.dev decided to make the actual project repository publicly accessible/);
  }
 }
 assert.equal(snapshots['babunidev/babuni.admin-docs'],undefined);
});

test('ActionEmotes #1 uses its renamed public source while preserving semantic identity and artwork',()=>{
 const project=demoProjects.find(p=>p.id==='buxbrewcharge');
 assert.equal(project.name,'ActionEmotes #1');assert.equal(project.portalArtwork,'/portal-content/BuxbrewCharge.webp');
 assert.equal(connections.buxbrewcharge.repository,'babunidev/ActionEmotes-1');
 assert.equal(snapshots['babunidev/BuxbrewCharge'],undefined);
 const snapshot=snapshots['babunidev/ActionEmotes-1'];assert.equal(snapshot.documents.length,10);
 assert.match(snapshot.documents.find(d=>d.path==='README.md').body,/first World of Warcraft addon/);
 const modules=repositoryModules(connections.buxbrewcharge,snapshot);
 assert.ok(modules.every(m=>m.source.startsWith('https://github.com/babunidev/ActionEmotes-1/blob/')));
});


test('Action Emotes final documentation baseline preserves the unresolved installation concern',()=>{
 const snapshot=snapshots['babunidev/ActionEmotes-1'];
 assert.equal(snapshot.commit,'e475a45108753c9eda8de1e774e2ba95058d65c0');
 assert.match(snapshot.documents.find(d=>d.path==='README.md').body,/BuxbreCharge\.toc/);
 assert.match(snapshot.documents.find(d=>d.path==='docs/DEVLOG.md').body,/BuxbreCharge\.toc/);
 const source=catalog.buxbrewcharge.find(m=>m.id==='source');
 assert.ok(source.links.some(l=>l.href==='https://github.com/babunidev/ActionEmotes-1/pull/1'));
 assert.match(source.preview,/requires an installation check/);
});


test('GuildChatBridge restoration preserves identity and its documented paused status',()=>{
 const project=demoProjects.find(p=>p.id==='guildchatai');
 assert.equal(project.name,'GuildChatBridge');assert.match(project.shortSummary,/Paused/);
 const c=connections.guildchatai;assert.equal(c.repository,'babunidev/GuildChatBridge');
 assert.equal(snapshots['babunidev/GuildChatAI'],undefined);
 const snapshot=snapshots[c.repository];assert.equal(snapshot.documents.length,10);
 const overview=snapshot.documents.find(d=>d.path==='README.md');
 assert.match(overview.body,/Paused experiment/);assert.match(overview.body,/No autonomous response loop is implemented/);
 assert.ok(snapshot.documents.some(d=>d.path==='docs/DEVLOG.md'));
 assert.ok(snapshot.documents.some(d=>d.path==='docs/DECISIONS.md'));
});


test('StealthEmotes replaces Amazin without duplicating the project or its artwork',()=>{
 const project=demoProjects.find(p=>p.id==='amazin');
 assert.equal(project.name,'StealthEmotes');assert.equal(project.portalArtwork,'/portal-content/Amazin.webp');
 assert.equal(demoProjects.filter(p=>p.name==='StealthEmotes').length,1);
 assert.ok(!demoProjects.some(p=>p.name==='Amazin'));
 const c=connections.amazin;assert.equal(c.repository,'babunidev/StealthEmotes');
 assert.equal(snapshots['babunidev/amazin'],undefined);
 const snapshot=snapshots[c.repository];assert.equal(snapshot.documents.length,10);
 assert.match(snapshot.documents.find(d=>d.path==='README.md').body,/does not detect successful Stealth/);
 const source=composeProjectModules(catalog.amazin,repositoryModules(c,snapshot),c.repository).find(m=>m.id==='source');
 assert.deepEqual(source.links.map(l=>l.href),['https://github.com/babunidev/StealthEmotes']);
});
