import {readFileSync,writeFileSync,renameSync,mkdirSync,existsSync,readdirSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {repositoryDocuments,CHARACTER_STORY_REPOSITORY,characterStoryDocumentPath,connectionFolders,folderDocumentPath,pairedImages,repositoryImageUrl,FOLDER_NAME,FOLDER_IMAGE_EXTENSIONS} from '../src/lib/repository-content.ts';
const run=promisify(execFile);
const root=fileURLToPath(new URL('..',import.meta.url));
export function validateConnections(connections,projectIds){
  const errors=[],branches=new Map();
  if(!connections||typeof connections!=='object'||Array.isArray(connections))return ['repository map must be an object'];
  for(const id of projectIds)if(!Object.hasOwn(connections,id))errors.push(`${id}: missing repository status`);
  for(const [id,entry] of Object.entries(connections)){
    if(!projectIds.includes(id))errors.push(`${id}: unknown project ID`);
    if(!entry||typeof entry!=='object'||Array.isArray(entry)){errors.push(`${id}: expected connection object`);continue;}
    for(const key of Object.keys(entry))if(!['status','repository','branch','paths','note','folders'].includes(key))errors.push(`${id}.${key}: unknown field`);
    if(!['connected','needs-repository','private-review','needs-confirmation'].includes(entry.status))errors.push(`${id}: unknown status`);
    if(entry.status!=='connected'){
      if(entry.repository||entry.branch||entry.paths||entry.folders)errors.push(`${id}: unresolved/private projects cannot publish repository data`);
      continue;
    }
    if(typeof entry.repository!=='string'||!/^babunidev\/[\w.-]+$/.test(entry.repository))errors.push(`${id}: expected a babunidev public repository`);
    if(branches.has(entry.repository)&&branches.get(entry.repository)!==entry.branch)errors.push(`${id}: shared repositories must use the same branch`);
    branches.set(entry.repository,entry.branch);
    if(typeof entry.branch!=='string'||!entry.branch.trim()||/[\s~^:?*\[\\]/.test(entry.branch)||entry.branch.includes('..')||entry.branch.startsWith('-'))errors.push(`${id}: invalid branch`);
    if(entry.paths!==undefined&&(!Array.isArray(entry.paths)||!entry.paths.length||new Set(entry.paths).size!==entry.paths.length||entry.paths.some(p=>!repositoryDocuments(entry.repository??'').some(d=>d.path===p))))errors.push(`${id}: paths must select unique standard documentation files`);
    if(entry.folders!==undefined&&(!Array.isArray(entry.folders)||!entry.folders.length||new Set(entry.folders).size!==entry.folders.length
      ||entry.folders.some(f=>typeof f!=='string'||!FOLDER_NAME.test(f)||f==='docs')||entry.repository===CHARACTER_STORY_REPOSITORY))
      errors.push(`${id}: folders must list unique top-level folder names (not docs)`);
  }
  return errors;
}
export function validateSnapshots(connections,snapshots){
  const errors=[];
  if(!snapshots||typeof snapshots!=='object'||Array.isArray(snapshots))return ['repository snapshots must be an object'];
  const expected=new Map(Object.values(connections).filter(c=>c?.status==='connected'&&c.repository!=='babunidev/babuni.dev').map(c=>[c.repository,c]));
  for(const [repository,connection] of expected){
    const branch=connection.branch,folders=connectionFolders(connection);
    const s=snapshots[repository];
    if(!s||s.repository!==repository||s.branch!==branch||!/^[a-f0-9]{40}$/.test(s.commit??'')||!Number.isFinite(Date.parse(s.syncedAt))){errors.push(`${repository}: missing or mismatched source snapshot`);continue;}
    if(!Array.isArray(s.documents)||!s.documents.length){errors.push(`${repository}: no source documents`);continue;}
    const seen=new Set();
    for(const d of s.documents){
      if(!d||!(repositoryDocuments(repository).some(doc=>doc.path===d.path)||(repository===CHARACTER_STORY_REPOSITORY?characterStoryDocumentPath(d.path):folderDocumentPath(d.path,folders)))||seen.has(d.path)||typeof d.body!=='string'||!d.body.trim())errors.push(`${repository}: invalid, empty or duplicate document`);
      seen.add(d?.path);
    }
    if(s.images!==undefined){
      const pairs=Array.isArray(s.images)?pairedImages([...seen].filter(p=>folderDocumentPath(p,folders)),s.images.map(i=>i?.path)):new Map();
      const paired=new Set(pairs.values());
      if(!Array.isArray(s.images)||s.images.some(i=>!paired.has(i?.path)||!/^[a-f0-9]{40}$/.test(i?.sha??''))||paired.size!==s.images.length)
        errors.push(`${repository}: images must pair one-to-one with imported folder documents`);
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
  for(const {path} of repositoryDocuments(repository)){
    if(connection.paths&&!connection.paths.includes(path))continue;
    const response=await request(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);
    if(response.status===404)continue;
    if(!response.ok)throw new Error(`${repository}/${path}: fetch failed (${response.status})`);
    const body=await responseText(response);if(body.trim())documents.push({path,body});
  }
  const folders=connectionFolders(connection);
  let images=[];
  if(folders.length){
    // Read GitHub's tree at the same pinned revision as the standard docs.
    // Only approved Markdown folders (and, for AmberbrewStory, its root-level
    // writing references) enter the public cache. Never follow document links.
    // Images are listed only when paired by name with an imported document.
    const allowed=path=>repository===CHARACTER_STORY_REPOSITORY?characterStoryDocumentPath(path):folderDocumentPath(path,folders);
    const listing=await request(`https://api.github.com/repos/${repository}/git/trees/${commit}?recursive=1`);
    if(!listing.ok)throw new Error(`${repository}: public file inventory unavailable (${listing.status})`);
    const inventory=await listing.json();
    if(inventory.truncated||!Array.isArray(inventory.tree))throw new Error(`${repository}: incomplete file inventory`);
    const known=new Set(documents.map(doc=>doc.path));
    const extra=inventory.tree.filter(file=>file.type==='blob'&&allowed(file.path)
      &&!known.has(file.path)).map(file=>file.path).sort();
    if(extra.length>200)throw new Error(`${repository}: too many Markdown documents for reviewed import`);
    for(const path of extra){
      const response=await request(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);
      if(!response.ok)throw new Error(`${repository}/${path}: inventory document unavailable (${response.status})`);
      const body=await responseText(response);
      if(body.trim())documents.push({path,body});
    }
    const blobs=inventory.tree.filter(file=>file.type==='blob'&&folders.includes(file.path.split('/')[0]));
    const pairs=pairedImages(documents.map(d=>d.path).filter(p=>folderDocumentPath(p,folders)),blobs.map(file=>file.path));
    const shas=new Map(blobs.map(file=>[file.path,file.sha]));
    images=[...pairs.values()].sort().map(path=>({path,sha:shas.get(path)}));
    if(images.length>200)throw new Error(`${repository}: too many paired images for reviewed import`);
  }
  if(!documents.length)throw new Error(`${repository}: no nonempty standard documents found`);
  return {repository,branch,commit,syncedAt:now(),documents,...(images.length?{images}:{})};
}
const IMAGE_LIMIT=8*1024*1024;
/** WebP derivative of a repository image: lossless for PNG and WebP, high quality for JPEG,
 * at most 1600 pixels on its longest side. Uses sharp, which ships with Astro.
 */
export async function toWebp(bytes,path){
  const {default:sharp}=await import('sharp');
  const extension=path.slice(path.lastIndexOf('.')+1).toLowerCase();
  return sharp(bytes,{limitInputPixels:40e6}).rotate()
    .resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true})
    .webp(extension==='jpg'||extension==='jpeg'?{quality:90}:{lossless:true}).toBuffer();
}
/** Writes the WebP files for a snapshot's paired images and removes stale ones for that repository.
 * Unchanged images (same Git blob as before) with an existing file are not downloaded again.
 */
export async function storeRepositoryImages(snapshot,previous,{base=root,fetcher=fetch}={}){
  const directory=join(base,'public/media/repositories',snapshot.repository.replace('/','--'));
  const images=snapshot.images??[];
  const keep=new Set();
  const before=new Map((previous?.images??[]).map(i=>[i.path,i.sha]));
  for(const image of images){
    const file=join(base,'public',repositoryImageUrl(snapshot.repository,image.path));
    keep.add(file);
    if(before.get(image.path)===image.sha&&existsSync(file))continue;
    const response=await fetcher(`https://raw.githubusercontent.com/${snapshot.repository}/${snapshot.commit}/${image.path}`,{redirect:'error',signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw new Error(`${snapshot.repository}/${image.path}: image unavailable (${response.status})`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length>IMAGE_LIMIT)throw new Error(`${snapshot.repository}/${image.path}: image exceeds size limit`);
    mkdirSync(directory,{recursive:true});
    writeFileSync(file+'.tmp',await toWebp(bytes,image.path));renameSync(file+'.tmp',file);
  }
  if(existsSync(directory)){
    for(const name of readdirSync(directory))if(!keep.has(join(directory,name)))rmSync(join(directory,name),{force:true});
    if(!readdirSync(directory).length)rmSync(directory,{recursive:true,force:true});
  }
}
export async function syncSnapshots(connections,{fetchOne=fetchSnapshot,onProgress=()=>{},concurrency=4}={}){
  const unique=[...new Map(Object.values(connections).filter(c=>c.status==='connected'&&c.repository!=='babunidev/babuni.dev').map(c=>[`${c.repository}@${c.branch}`,c])).values()];
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
  const target=resolve(root,'src/content/repository-documents.json'),temporary=target+'.tmp';
  const previous=JSON.parse(readFileSync(target,'utf8'));
  for(const snapshot of Object.values(snapshots))await storeRepositoryImages(snapshot,previous[snapshot.repository]);
  // All-or-nothing refresh: network errors never replace the last good snapshot.
  writeFileSync(temporary,JSON.stringify(snapshots,null,2)+'\n');renameSync(temporary,target);
  console.log(`Refreshed ${Object.keys(snapshots).length} public repositories. Build and review before publishing.`);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
