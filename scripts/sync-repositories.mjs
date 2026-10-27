import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {REPOSITORY_DOCUMENTS} from '../src/lib/repository-content.ts';
const run=promisify(execFile);
const root=fileURLToPath(new URL('..',import.meta.url));
export function validateConnections(connections,projectIds){
  const errors=[],branches=new Map();
  if(!connections||typeof connections!=='object'||Array.isArray(connections))return ['repository map must be an object'];
  for(const id of projectIds)if(!Object.hasOwn(connections,id))errors.push(`${id}: missing repository status`);
  for(const [id,entry] of Object.entries(connections)){
    if(!projectIds.includes(id))errors.push(`${id}: unknown project ID`);
    if(!entry||typeof entry!=='object'||Array.isArray(entry)){errors.push(`${id}: expected connection object`);continue;}
    for(const key of Object.keys(entry))if(!['status','repository','branch','paths','note'].includes(key))errors.push(`${id}.${key}: unknown field`);
    if(!['connected','needs-repository','private-review','needs-confirmation'].includes(entry.status))errors.push(`${id}: unknown status`);
    if(entry.status!=='connected'){
      if(entry.repository||entry.branch||entry.paths)errors.push(`${id}: unresolved/private projects cannot publish repository data`);
      continue;
    }
    if(typeof entry.repository!=='string'||!/^babunidev\/[\w.-]+$/.test(entry.repository))errors.push(`${id}: expected a babunidev public repository`);
    if(branches.has(entry.repository)&&branches.get(entry.repository)!==entry.branch)errors.push(`${id}: shared repositories must use the same branch`);
    branches.set(entry.repository,entry.branch);
    if(typeof entry.branch!=='string'||!entry.branch.trim()||/[\s~^:?*\[\\]/.test(entry.branch)||entry.branch.includes('..')||entry.branch.startsWith('-'))errors.push(`${id}: invalid branch`);
    if(entry.paths!==undefined&&(!Array.isArray(entry.paths)||!entry.paths.length||new Set(entry.paths).size!==entry.paths.length||entry.paths.some(p=>!REPOSITORY_DOCUMENTS.some(d=>d.path===p))))errors.push(`${id}: paths must select unique standard documentation files`);
  }
  return errors;
}
export function validateSnapshots(connections,snapshots){
  const errors=[];
  if(!snapshots||typeof snapshots!=='object'||Array.isArray(snapshots))return ['repository snapshots must be an object'];
  const expected=new Map(Object.values(connections).filter(c=>c?.status==='connected'&&c.repository!=='babunidev/babuni.dev').map(c=>[c.repository,c.branch]));
  for(const [repository,branch] of expected){
    const s=snapshots[repository];
    if(!s||s.repository!==repository||s.branch!==branch||!/^[a-f0-9]{40}$/.test(s.commit??'')||!Number.isFinite(Date.parse(s.syncedAt))){errors.push(`${repository}: missing or mismatched source snapshot`);continue;}
    if(!Array.isArray(s.documents)||!s.documents.length){errors.push(`${repository}: no source documents`);continue;}
    const seen=new Set();
    for(const d of s.documents){
      if(!d||!REPOSITORY_DOCUMENTS.some(doc=>doc.path===d.path)||seen.has(d.path)||typeof d.body!=='string'||!d.body.trim())errors.push(`${repository}: invalid, empty or duplicate document`);
      seen.add(d?.path);
    }
  }
  for(const repository of Object.keys(snapshots))if(!expected.has(repository))errors.push(`${repository}: unconnected snapshot must not be published`);
  return errors;
}
async function publicCommit(repository,branch){
  const {stdout}=await run('git',['-c','credential.helper=','ls-remote',`https://github.com/${repository}.git`,`refs/heads/${branch}`],{timeout:20000,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}});
  return stdout.trim().split(/\s+/)[0];
}
async function responseText(response,max=512*1024){
  if(Number(response.headers.get('content-length'))>max)throw new Error('document exceeds size limit');
  const reader=response.body.getReader();let size=0;const chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('document exceeds size limit');}chunks.push(value);}
  return new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks));
}
/** Anonymous requests only: a private repository can never silently enter a public cache. */
export async function fetchSnapshot(connection,{fetcher=fetch,resolveCommit=publicCommit,now=()=>new Date().toISOString()}={}){
  const {repository,branch}=connection;
  const request=url=>fetcher(url,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{Accept:'application/vnd.github+json','User-Agent':'babuni-dev-content-sync'}});
  const metadata=await request(`https://api.github.com/repos/${repository}`);
  if(!metadata.ok)throw new Error(`${repository}: public repository metadata unavailable (${metadata.status})`);
  const info=await metadata.json();
  if(info.private!==false||info.visibility!=='public'||info.full_name?.toLowerCase()!==repository.toLowerCase())throw new Error(`${repository}: public visibility/identity not verified`);
  const commit=await resolveCommit(repository,branch);
  if(!/^[a-f0-9]{40}$/.test(commit))throw new Error(`${repository}: invalid commit`);
  const documents=[];
  for(const {path} of REPOSITORY_DOCUMENTS){
    if(connection.paths&&!connection.paths.includes(path))continue;
    const response=await request(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);
    if(response.status===404)continue;
    if(!response.ok)throw new Error(`${repository}/${path}: fetch failed (${response.status})`);
    const body=await responseText(response);if(body.trim())documents.push({path,body});
  }
  if(!documents.length)throw new Error(`${repository}: no nonempty standard documents found`);
  return {repository,branch,commit,syncedAt:now(),documents};
}
export async function syncSnapshots(connections,{fetchOne=fetchSnapshot,onProgress=()=>{},concurrency=4}={}){
  const unique=[...new Map(Object.values(connections).filter(c=>c.status==='connected'&&c.repository!=='babunidev/babuni.dev').map(c=>[`${c.repository}@${c.branch}`,{repository:c.repository,branch:c.branch}])).values()];
  const snapshots={};let cursor=0;
  await Promise.all(Array.from({length:Math.min(concurrency,unique.length)},async()=>{
    while(cursor<unique.length){const connection=unique[cursor++];const snapshot=await fetchOne(connection);snapshots[connection.repository]=snapshot;onProgress(snapshot);}
  }));
  return Object.fromEntries(Object.entries(snapshots).sort(([a],[b])=>a.localeCompare(b)));
}
async function main(){
  const connections=JSON.parse(readFileSync(resolve(root,'src/content/project-repositories.json'),'utf8'));
  const {demoProjects}=await import('../src/lib/demo-projects.ts');
  const errors=validateConnections(connections,demoProjects.map(p=>p.id));if(errors.length)throw new Error(errors.join('\n'));
  const snapshots=await syncSnapshots(connections,{
    onProgress:s=>console.log(`${s.repository}: ${s.documents.length} documents at ${s.commit.slice(0,8)}`)
  });
  // All-or-nothing refresh: network errors never replace the last good snapshot.
  const target=resolve(root,'src/content/repository-documents.json'),temporary=target+'.tmp';
  writeFileSync(temporary,JSON.stringify(snapshots,null,2)+'\n');renameSync(temporary,target);
  console.log(`Refreshed ${Object.keys(snapshots).length} public repositories. Build and review before publishing.`);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
