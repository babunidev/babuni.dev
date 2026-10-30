import {demoProjects,type DemoProject} from './demo-projects.ts';
import {recentlyUpdatedProjectIds} from './project-activity.ts';
import connections from '../content/project-repositories.json' with {type:'json'};
import activity from '../generated/project-activity.json' with {type:'json'};

/** New assortment every page load; semantic project IDs remain stable during shifts. */
export function shuffleProjects(projects:readonly DemoProject[],random:()=>number=Math.random):DemoProject[]{
  const first=projects.find(p=>p.id==='babuni-dev');
  if(!first)throw new Error('BABUNI.DEV must remain first');
  const others=projects.filter(p=>p.id!==first.id);
  for(let i=others.length-1;i>0;i--){
    const value=random();
    if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Random fraction out of bounds');
    const j=Math.floor(value*(i+1));
    [others[i],others[j]]=[others[j],others[i]];
  }
  return [first,...others];
}
export const gridProjects=shuffleProjects(demoProjects);
export const recentlyUpdatedIds=recentlyUpdatedProjectIds(demoProjects,connections,activity);
