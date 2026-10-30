import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {projectsByActivity,recentlyUpdatedProjectIds} from '../src/lib/project-activity.ts';
import {latestPublicActivity,refreshProjectActivity,prepareProjectActivity,writeProjectActivity} from '../scripts/sync-project-activity.mjs';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {gridProjects,shuffleProjects} from '../src/lib/grid-projects.ts';
import {ProjectPlacement} from '../src/lib/project-placement.ts';
import {introSequence} from '../src/lib/grid-intro.ts';
const sha='a'.repeat(40),checkedAt='2026-10-29T10:00:00Z';
const value=(date,branch='main')=>({branch,sha,committedAt:date,checkedAt});
const connected=(repository,branch='main')=>({status:'connected',repository,branch});
const projects=['old','new','tie','unknown','private'].map(id=>({id}));
const connections={old:connected('babunidev/old'),new:connected('babunidev/new'),tie:connected('babunidev/tie'),unknown:{status:'needs-repository'},private:{status:'private-review'}};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status});
const commit=(repository='babunidev/example',date='2026-10-28T12:30:00Z')=>({sha,html_url:`https://github.com/${repository}/commit/${sha}`,commit:{committer:{date},author:{date:'2000-01-01T00:00:00Z'}}});
test('newest commit first, ties and undated entries stable; no catalog mutation',()=>{
 const before=projects.slice(),cache={'babunidev/old':value('2020-01-01T00:00:00Z'),'babunidev/new':value('2026-10-28T12:00:00Z'),'babunidev/tie':value('2026-10-28T12:00:00Z')};
 assert.deepEqual(projectsByActivity(projects,connections,cache).map(p=>p.id),['new','tie','old','unknown','private']);
 assert.deepEqual(projects,before);
 cache['babunidev/old'].checkedAt='2030-01-01T00:00:00Z';
 assert.equal(projectsByActivity(projects,connections,cache)[0].id,'new','check/build time is not project activity');
});
test('invalid dates and wrong-branch caches remain undated',()=>{
 const cache={'babunidev/new':value('not-a-date'),'babunidev/old':value('2030-01-01T00:00:00Z','retired')};
 assert.deepEqual(projectsByActivity(projects,connections,cache),projects);
});
test('public docs commit determines order independently of implementation identity',()=>{
 const p=[{id:'admin'},{id:'other'}],c={admin:connected('babunidev/babuni.admin-docs'),other:connected('babunidev/other')};
 const cache={'babunidev/babuni.admin-docs':value('2026-10-28T00:00:00Z'),'babunidev/other':value('2026-10-27T00:00:00Z'),'babunidev/babuni.admin':value('2030-01-01T00:00:00Z')};
 assert.equal(projectsByActivity(p,c,cache)[0].id,'admin');delete cache['babunidev/babuni.admin-docs'];
 assert.equal(projectsByActivity(p,c,cache)[0].id,'other','private activity is never used');
});
test('anonymous refresh reads one lean public commit response and uses committer date',async()=>{
 const calls=[];const result=await latestPublicActivity('babunidev/example','main',{now:()=>checkedAt,fetcher:async(url,options)=>{calls.push([url,options]);return json([commit()]);}});
 assert.equal(result.committedAt,'2026-10-28T12:30:00Z');assert.equal(result.sha,sha);
 assert.equal(calls.length,1);assert.equal(calls[0][0],'https://api.github.com/repos/babunidev/example/commits?sha=main&per_page=1');
 assert.equal(calls[0][1].headers.Authorization,undefined);assert.equal(calls[0][1].redirect,'error');
 assert.deepEqual(Object.keys(result).sort(),['branch','checkedAt','committedAt','sha']);
});
test('optional CI token verifies public visibility before commit reads; private repos stop at metadata',async()=>{
 const calls=[];await assert.rejects(()=>latestPublicActivity('babunidev/example','main',{token:'test-token',fetcher:async url=>{calls.push(url);return json({private:true,visibility:'private',full_name:'babunidev/example'});}}),/Public visibility/);
 assert.deepEqual(calls,['https://api.github.com/repos/babunidev/example']);
 const result=await latestPublicActivity('babunidev/example','main',{token:'test-token',now:()=>checkedAt,fetcher:async url=>json(url.includes('/commits?')?[commit()]:{private:false,visibility:'public',full_name:'babunidev/example'})});
 assert.equal(result.sha,sha);
});
test('HTTP failures, changed identity and malformed commit dates never produce fresh activity',async()=>{
 for(const status of [403,404,429,500])await assert.rejects(()=>latestPublicActivity('babunidev/example','main',{fetcher:async()=>json({},status)}),new RegExp(String(status)));
 await assert.rejects(()=>latestPublicActivity('babunidev/example','main',{fetcher:async()=>json([commit('babunidev/other')])}),/identity/);
 await assert.rejects(()=>latestPublicActivity('babunidev/example','main',{fetcher:async()=>json([commit('babunidev/example','invalid')])}),/Invalid commit/);
 await assert.rejects(()=>latestPublicActivity('other/private','main'),/Invalid activity source/);
});
test('refresh deduplicates public sources, excludes unresolved/private and prunes retired metadata',async()=>{
 const calls=[];const c={a:connected('babunidev/a'),b:connected('babunidev/a'),private:{status:'private-review',repository:'babunidev/private'},missing:{status:'needs-repository'}};
 const result=await refreshProjectActivity(c,{'babunidev/retired':value(checkedAt)},{fetchOne:async(repo,branch)=>{calls.push(repo);return value(checkedAt,branch);}});
 assert.deepEqual(calls,['babunidev/a']);assert.deepEqual(Object.keys(result.cache),['babunidev/a']);assert.equal(result.refreshed,1);
});
test('outage retains only matching verified dates; missing sources stay undated',async()=>{
 const previous={'babunidev/old':value('2020-01-01T00:00:00Z'),'babunidev/new':value(checkedAt,'wrong')};
 const result=await refreshProjectActivity(connections,previous,{fetchOne:async()=>{throw new Error('offline');}});
 assert.deepEqual(Object.keys(result.cache),['babunidev/old']);assert.equal(result.failures.length,3);
 assert.equal(result.failures.find(f=>f.repository==='babunidev/old').cached,true);
 assert.equal(result.failures.find(f=>f.repository==='babunidev/new').cached,false);
});
test('mixed refresh preserves failures while updating successful repositories',async()=>{
 const previous={'babunidev/old':value('2020-01-01T00:00:00Z')};
 const result=await refreshProjectActivity(connections,previous,{fetchOne:async repo=>{if(repo==='babunidev/old')throw new Error('429');return value(checkedAt);}});
 assert.equal(result.refreshed,2);assert.equal(result.cache['babunidev/old'].committedAt,'2020-01-01T00:00:00Z');
 await assert.rejects(()=>refreshProjectActivity({a:connected('babunidev/a'),b:connected('babunidev/a','other')},{}),/Conflicting/);
});
test('shuffled runtime assortment fills the initial spiral without changing IDs or intro timing',()=>{
 assert.equal(gridProjects[0].id,'babuni-dev');
 assert.deepEqual(gridProjects.map(p=>p.id).sort(),demoProjects.map(p=>p.id).sort());
 const cells=[];for(let y=-2;y<=2;y++)for(let x=-4;x<=4;x++)cells.push({column:x,row:y});
 const placement=new ProjectPlacement(gridProjects.length,3);placement.sync(cells,cells);
 const ordered=introSequence(cells,c=>c).map(c=>gridProjects[placement.get(c)]?.id);
 assert.deepEqual(ordered.filter(Boolean).slice(0,gridProjects.length),gridProjects.map(p=>p.id));
 assert.equal(ordered.filter(id=>id===undefined).length,Math.min(3,Math.max(0,cells.length-gridProjects.length)));
 const source=readFileSync(new URL('../src/scripts/grid.ts',import.meta.url),'utf8');
 assert.ok(source.includes("const isOrigin=project?.id==='babuni-dev'"),'branding follows semantic identity');
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.ok(pkg.scripts.prebuild.startsWith('npm run activity:sync'));
 assert.ok(!pkg.scripts.predev.includes('activity:sync'),'dev/test preparation stays offline');
});

test('normal refresh and offline preparation never dirty the checked-in fallback; explicit baseline save is separate',async()=>{
 const base=mkdtempSync(join(tmpdir(),'babuni-activity-'));
 try{
  mkdirSync(join(base,'src/content'),{recursive:true});
  writeFileSync(join(base,'src/content/project-repositories.json'),JSON.stringify({a:connected('babunidev/a')}));
  const baseline=JSON.stringify({'babunidev/a':value('2020-01-01T00:00:00Z')});
  writeFileSync(join(base,'src/content/project-activity.json'),baseline);
  const fresh={...value('2026-10-29T11:00:00Z'),checkedAt:'2026-10-29T12:00:00Z'};
  await writeProjectActivity({base,fetchOne:async()=>fresh});
  assert.equal(readFileSync(join(base,'src/content/project-activity.json'),'utf8'),baseline);
  assert.deepEqual(prepareProjectActivity({base})['babunidev/a'],fresh);
  await writeProjectActivity({base,saveBaseline:true,fetchOne:async()=>fresh});
  assert.deepEqual(JSON.parse(readFileSync(join(base,'src/content/project-activity.json'),'utf8'))['babunidev/a'],fresh);
 }finally{rmSync(base,{recursive:true,force:true});}
});
test('BABUNI.DEV stays first, other projects reshuffle without mutating catalog',()=>{
 const input=[{id:'a'},{id:'babuni-dev'},{id:'b'},{id:'c'}],before=input.map(x=>x.id);
 const one=shuffleProjects(input,()=>0).map(x=>x.id);
 const two=shuffleProjects(input,()=>.999).map(x=>x.id);
 assert.equal(one[0],'babuni-dev');assert.equal(two[0],'babuni-dev');
 assert.notDeepEqual(one,two);
 assert.deepEqual(one.slice(1).sort(),['a','b','c']);
 assert.deepEqual(two.slice(1).sort(),['a','b','c']);
 assert.deepEqual(input.map(x=>x.id),before);
});
test('recent markers use validated commit dates, not ordering, stale/private or future records',()=>{
 const p=['first','new','other','old','unlinked','future'].map(id=>({id}));
 const c={first:connected('babunidev/first'),new:connected('babunidev/new'),other:connected('babunidev/other'),old:connected('babunidev/old'),unlinked:{status:'needs-repository'},future:connected('babunidev/future')};
 const cache={'babunidev/first':value('2026-10-29T00:00:00Z'),'babunidev/new':value('2026-10-30T00:00:00Z'),'babunidev/other':value('2026-10-27T00:00:00Z'),'babunidev/old':value('2026-09-01T00:00:00Z'),'babunidev/future':value('2026-11-10T00:00:00Z')};
 const now=Date.parse('2026-10-30T23:00:00Z');
 assert.deepEqual([...recentlyUpdatedProjectIds(p,c,cache,now,2)],['new','first']);
 assert.deepEqual([...recentlyUpdatedProjectIds(p,c,cache,now,5)],['new','first','other']);
 cache['babunidev/new'].branch='wrong';
 assert.deepEqual([...recentlyUpdatedProjectIds(p,c,cache,now,5)],['first','other']);
 assert.deepEqual([...recentlyUpdatedProjectIds(p,c,cache,now+40*86400000)],[]);
});
