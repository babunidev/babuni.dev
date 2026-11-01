import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {validActivity} from '../src/lib/project-activity.ts';
const root=fileURLToPath(new URL('..',import.meta.url));
const repositoryPattern=/^babunidev\/[\w.-]+$/;
const run=promisify(execFile);
/** Resolve credentials in memory only. CI must explicitly supply its token;
 * local builds may reuse the existing github.com CLI login. */
export async function resolveActivityToken({env=process.env,readCliToken=async()=>{
  const {stdout}=await run('gh',['auth','token','--hostname','github.com'],{timeout:10000,maxBuffer:16384});
  return stdout;
}}={}){
  const explicit=env.GITHUB_TOKEN?.trim()||env.GH_TOKEN?.trim();
  if(explicit)return explicit;
  if(env.CI||env.GITHUB_ACTIONS)return '';
  try{return (await readCliToken()).trim();}catch{return '';}
}
function activityHttpError(response,context){
  const hints=[];
  if(response.headers.get('x-ratelimit-remaining')==='0')hints.push('GitHub API rate limit exhausted');
  else if(response.status===401)hints.push('GitHub authentication rejected; renew the configured token or gh login');
  else if(response.status===403)hints.push('GitHub denied access or applied a secondary rate limit');
  const reset=response.headers.get('x-ratelimit-reset');
  if(reset&&/^\d+$/.test(reset)){
    const date=new Date(Number(reset)*1000);
    if(Number.isFinite(date.getTime()))hints.push('rate-limit reset '+date.toISOString());
  }
  const retry=response.headers.get('retry-after');
  if(retry&&/^\d+$/.test(retry))hints.push('retry after '+retry+' seconds');
  // Never copy response bodies, request headers or tokens into public logs.
  return new Error(context+' ('+response.status+')'+(hints.length?': '+hints.join('; '):''));
}
/** Anonymous successful commit reads establish public access. With an optional CI
 * token, explicitly verify public visibility before requesting commit data.
 * Never save messages, author identity, credentials or implementation files.
 */
export async function latestPublicActivity(repository,branch,{fetcher=fetch,token='',now=()=>new Date().toISOString()}={}){
  if(!repositoryPattern.test(repository)||typeof branch!=='string'||!branch||branch.startsWith('-')||branch.includes('..'))throw new Error('Invalid activity source');
  const request=path=>fetcher('https://api.github.com/repos/'+repository+path,{
    redirect:'error',signal:AbortSignal.timeout(10000),headers:{Accept:'application/vnd.github+json','User-Agent':'babuni-dev-activity',...(token?{Authorization:'Bearer '+token}:{})}
  });
  if(token){
    const response=await request('');if(!response.ok)throw activityHttpError(response,'Public visibility check failed');
    const info=await response.json();
    if(info.private!==false||info.visibility!=='public'||info.full_name?.toLowerCase()!==repository.toLowerCase())throw new Error('Public visibility/identity not verified');
  }
  const response=await request('/commits?sha='+encodeURIComponent(branch)+'&per_page=1');
  if(!response.ok)throw activityHttpError(response,'Public commit date unavailable');
  const commits=await response.json(),commit=Array.isArray(commits)?commits[0]:null;
  const sha=commit?.sha;
  if(typeof commit?.html_url!=='string'||commit.html_url.toLowerCase()!==`https://github.com/${repository}/commit/${sha}`.toLowerCase())throw new Error('Commit repository identity not verified');
  const value={branch,sha,committedAt:commit.commit?.committer?.date,checkedAt:now()};
  if(!validActivity(value,branch))throw new Error('Invalid commit date or revision');
  return value;
}
/** Only explicit public content connections participate. Failed refreshes retain
 * matching last-good dates, never a guessed build/import timestamp.
 */
export async function refreshProjectActivity(connections,previous,{fetchOne=latestPublicActivity,concurrency=3}={}){
  const sources=new Map();
  for(const c of Object.values(connections))if(c?.status==='connected'&&repositoryPattern.test(c.repository??'')&&c.branch){
    if(sources.has(c.repository)&&sources.get(c.repository)!==c.branch)throw new Error('Conflicting activity branches');
    sources.set(c.repository,c.branch);
  }
  const entries=[...sources],cache={},failures=[];let cursor=0,refreshed=0;
  await Promise.all(Array.from({length:Math.min(concurrency,entries.length)},async()=>{
    while(cursor<entries.length){
      const [repository,branch]=entries[cursor++];
      try{
        const value=await fetchOne(repository,branch);
        if(!validActivity(value,branch))throw new Error('Invalid refreshed activity');
        cache[repository]=value;refreshed++;
      }catch(error){
        if(validActivity(previous[repository],branch))cache[repository]=previous[repository];
        failures.push({repository,cached:!!cache[repository],reason:error.message});
      }
    }
  }));
  return {cache:Object.fromEntries(Object.entries(cache).sort(([a],[b])=>a.localeCompare(b))),refreshed,failures};
}
function readCache(path){
  try{const value=JSON.parse(readFileSync(path,'utf8'));return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}
}
function cachedActivity(base,connections){
  const baseline=readCache(resolve(base,'src/content/project-activity.json'));
  const generated=readCache(resolve(base,'src/generated/project-activity.json')),cache={};
  for(const c of Object.values(connections))if(c?.status==='connected'&&repositoryPattern.test(c.repository??'')&&c.branch){
    const candidates=[baseline[c.repository],generated[c.repository]].filter(value=>validActivity(value,c.branch));
    candidates.sort((a,b)=>Date.parse(b.checkedAt)-Date.parse(a.checkedAt));
    if(candidates[0])cache[c.repository]=candidates[0];
  }
  return Object.fromEntries(Object.entries(cache).sort(([a],[b])=>a.localeCompare(b)));
}
function writeCache(target,cache){
  const body=JSON.stringify(cache,null,2)+'\n';
  try{if(readFileSync(target,'utf8')===body)return;}catch{}
  mkdirSync(dirname(target),{recursive:true});
  const temporary=target+'.tmp';writeFileSync(temporary,body);renameSync(temporary,target);
}
/** Offline dev/test preparation keeps the newest matching last-good cache.
 * Normal builds modify only ignored generated files, never tracked sources.
 */
export function prepareProjectActivity({base=root}={}){
  const connections=JSON.parse(readFileSync(resolve(base,'src/content/project-repositories.json'),'utf8'));
  const cache=cachedActivity(base,connections);
  writeCache(resolve(base,'src/generated/project-activity.json'),cache);
  return cache;
}
export async function writeProjectActivity({base=root,token=process.env.GITHUB_TOKEN??process.env.GH_TOKEN??'',saveBaseline=false,requireFresh=false,fetchOne}={}){
  if(requireFresh&&!token&&!fetchOne)throw new Error('Production build requires GitHub authentication. Run gh auth login --hostname github.com locally, or supply GITHUB_TOKEN/GH_TOKEN in the build environment. Never put tokens in source files.');
  const connections=JSON.parse(readFileSync(resolve(base,'src/content/project-repositories.json'),'utf8'));
  const result=await refreshProjectActivity(connections,cachedActivity(base,connections),{fetchOne:fetchOne??((repository,branch)=>latestPublicActivity(repository,branch,{token}))});
  console.log(`Project activity: ${result.refreshed}/${Object.values(connections).filter(c=>c.status==='connected').length} public repository dates refreshed.`);
  for(const failure of result.failures)console.warn(`Activity warning: ${failure.repository}: ${failure.reason}; ${requireFresh?'production build stopped':failure.cached?'using last verified date':'no verified date; retaining undated catalog order'}.`);
  if(requireFresh&&result.failures.length)throw new Error('Fresh activity required: '+result.failures.length+' public source(s) could not be refreshed. Existing activity files were left unchanged; production build stopped.');
  writeCache(resolve(base,'src/generated/project-activity.json'),result.cache);
  if(saveBaseline)writeCache(resolve(base,'src/content/project-activity.json'),result.cache);
  return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv.includes('--offline'))prepareProjectActivity();
  else resolveActivityToken().then(token=>writeProjectActivity({token,requireFresh:process.argv.includes('--require-fresh'),saveBaseline:process.argv.includes('--save-baseline')})).catch(error=>{console.error(error.message);process.exitCode=1;});
}
