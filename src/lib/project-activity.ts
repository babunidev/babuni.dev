import {type DemoProject} from './demo-projects.ts';
export interface ActivityConnection {status:string;repository?:string;branch?:string}
export interface ProjectActivity {branch:string;sha:string;committedAt:string;checkedAt:string}
export type ActivityCache=Record<string,ProjectActivity>;
export function validActivity(value:unknown,branch:string):value is ProjectActivity {
  const v=value as ProjectActivity|undefined;
  return !!v&&typeof v==='object'&&Object.keys(v).every(key=>['branch','sha','committedAt','checkedAt'].includes(key))&&v.branch===branch&&/^[a-f0-9]{40}$/.test(v.sha)
    &&typeof v.committedAt==='string'&&Number.isFinite(Date.parse(v.committedAt))
    &&typeof v.checkedAt==='string'&&Number.isFinite(Date.parse(v.checkedAt));
}
/** Newest branch-head commit first. Ties and undated projects retain catalog order.
 * Never mutate the catalog or use snapshot-import/build timestamps as activity.
 */
export function projectsByActivity(projects:readonly DemoProject[],connections:Record<string,ActivityConnection>,cache:ActivityCache):DemoProject[]{
  const time=(project:DemoProject)=>{
    const c=connections[project.id];
    if(c?.status!=='connected'||!c.repository||!c.branch)return null;
    const value=cache[c.repository];return validActivity(value,c.branch)?Date.parse(value.committedAt):null;
  };
  return projects.map((project,index)=>({project,index,time:time(project)}))
    .sort((a,b)=>a.time===b.time?a.index-b.index:a.time===null?1:b.time===null?-1:b.time-a.time)
    .map(item=>item.project);
}
/** Recent badge candidates from public, validated branch-head commits only.
 * Maximum five projects, updated within fourteen days (provisional UI defaults).
 * Update order never changes placement order.
 */
export function recentlyUpdatedProjectIds(
  projects:readonly DemoProject[],connections:Record<string,ActivityConnection>,
  cache:ActivityCache,now=Date.now(),limit=5,days=14
):ReadonlySet<string>{
  if(!Number.isFinite(now)||!Number.isInteger(limit)||limit<0||!Number.isFinite(days)||days<0)throw new RangeError('Invalid activity window');
  const period=days*86400000;
  const candidates=projects.flatMap((project,index)=>{
    const c=connections[project.id];
    if(c?.status!=='connected'||!c.repository||!c.branch)return [];
    const a=cache[c.repository];
    if(!validActivity(a,c.branch))return [];
    const t=Date.parse(a.committedAt),age=now-t;
    return age>=0&&age<=period?[{id:project.id,index,time:t}]:[];
  });
  candidates.sort((a,b)=>b.time-a.time||a.index-b.index);
  return new Set(candidates.slice(0,limit).map(p=>p.id));
}
