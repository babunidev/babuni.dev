import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {fetchSnapshot,validateSnapshots,storeRepositoryImages} from './sync-repositories.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const LOCAL='babunidev/babuni.dev';

/** Sends the token to api.github.com only; raw.githubusercontent.com and every other host stay anonymous. */
export function githubApiFetcher(token,fetcher=fetch){
  return (url,options={})=>new URL(url).origin==='https://api.github.com'
    ?fetcher(url,{...options,headers:{...options.headers,Authorization:'Bearer '+token}})
    :fetcher(url,options);
}

/** Pure: replaces updated repositories, adds newly connected ones and drops repositories
 * that are no longer connected (when `connected` is given); all others stay untouched.
 */
export function mergeSnapshots(snapshots,updates,connected){
  const kept=connected?Object.fromEntries(Object.entries(snapshots).filter(([repository])=>connected.has(repository))):snapshots;
  return {...kept,...updates};
}

/** Pure: which documents differ between the committed snapshot and a fresh one. */
export function compareSnapshots(committed,fresh){
  const before=new Map((committed?.documents??[]).map(d=>[d.path,d.body]));
  const after=new Map(fresh.documents.map(d=>[d.path,d.body]));
  const changes=[];
  for(const [path,body] of after){
    if(!before.has(path))changes.push({path,kind:'NEW'});
    else if(before.get(path)!==body)changes.push({path,kind:'CHANGED'});
  }
  for(const path of before.keys())if(!after.has(path))changes.push({path,kind:'REMOVED'});
  const oldImages=new Map((committed?.images??[]).map(i=>[i.path,i.sha]));
  const newImages=new Map((fresh.images??[]).map(i=>[i.path,i.sha]));
  for(const [path,sha] of newImages){
    if(!oldImages.has(path))changes.push({path,kind:'NEW'});
    else if(oldImages.get(path)!==sha)changes.push({path,kind:'CHANGED'});
  }
  for(const path of oldImages.keys())if(!newImages.has(path))changes.push({path,kind:'REMOVED'});
  return changes;
}

async function main(){
  const args=process.argv.slice(2);
  const write=args.includes('--write');
  const all=args.includes('--all');
  const targets=args.filter(a=>!a.startsWith('--')).map(a=>a.toLowerCase());
  if(!all&&!targets.length)throw new Error('Usage: pull-repository.mjs <owner/name | name ...> | --all [--write]');
  const connections=JSON.parse(readFileSync(resolve(root,'src/content/project-repositories.json'),'utf8'));
  const file=resolve(root,'src/content/repository-documents.json');
  const text=readFileSync(file,'utf8');
  const snapshots=JSON.parse(text);
  if(JSON.stringify(snapshots,null,2)+'\n'!==text)throw new Error('Snapshot formatting is not reproducible; refusing to continue');
  const unique=[...new Map(Object.values(connections)
    .filter(c=>c.status==='connected'&&c.repository!==LOCAL)
    .map(c=>[c.repository,c])).values()];
  const matches=t=>c=>{const name=c.repository.toLowerCase();return name===t||name==='babunidev/'+t;};
  const unknown=targets.filter(t=>!unique.some(matches(t)));
  if(unknown.length)throw new Error('Not a connected public source: '+unknown.join(', '));
  const wanted=all?unique:unique.filter(c=>targets.some(t=>matches(t)(c)));
  let token;
  try{token=execFileSync('gh',['auth','token'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
  catch{throw new Error('No GitHub login: run gh auth login first');}
  if(!token)throw new Error('No GitHub login: run gh auth login first');
  const fetcher=githubApiFetcher(token);
  const fresh={};let cursor=0;
  await Promise.all(Array.from({length:Math.min(4,wanted.length)},async()=>{
    while(cursor<wanted.length){const c=wanted[cursor++];fresh[c.repository]=await fetchSnapshot(c,{fetcher});}
  }));
  const updates={};let total=0;
  for(const c of wanted){
    const f=fresh[c.repository],old=snapshots[c.repository];
    const changes=compareSnapshots(old,f);
    const head=(old?.commit??'none').slice(0,8)+' -> '+f.commit.slice(0,8);
    if(!changes.length){
      console.log('same      '+c.repository.padEnd(34)+(old?.commit===f.commit?'':'(head moved '+head+', documents identical)'));
      continue;
    }
    total++;updates[c.repository]=f;
    console.log('CHANGED   '+c.repository.padEnd(34)+head);
    for(const change of changes)console.log('            '+change.kind.padEnd(8)+change.path);
  }
  const connected=new Set(unique.map(c=>c.repository));
  const stale=Object.keys(snapshots).filter(repository=>!connected.has(repository));
  for(const repository of stale){console.log('DROPPED   '+repository.padEnd(34)+'(no longer connected)');total++;}
  if(!total){console.log('No document changes.');return;}
  if(!write){console.log(total+' repository(ies) have document changes. Add --write to update the snapshot.');return;}
  const dirty=execFileSync('git',['status','--porcelain','--','src/content/repository-documents.json'],{cwd:root,encoding:'utf8'}).trim();
  if(dirty)throw new Error('repository-documents.json has uncommitted changes; commit or stash them first');
  const merged=mergeSnapshots(snapshots,updates,connected);
  const errors=validateSnapshots(connections,merged);
  if(errors.length)throw new Error(errors.join('\n'));
  for(const [repository,snapshot] of Object.entries(updates))await storeRepositoryImages(snapshot,snapshots[repository]);
  const temporary=file+'.tmp';
  writeFileSync(temporary,JSON.stringify(merged,null,2)+'\n');renameSync(temporary,file);
  console.log('Snapshot updated for '+total+' repository(ies). Review with git diff, then commit and publish.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
