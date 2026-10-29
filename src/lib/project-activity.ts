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
