import {demoProjects} from './demo-projects.ts';
import order from '../generated/grid-order.json' with {type:'json'};
const byId=new Map(demoProjects.map(project=>[project.id,project]));
/** One fixed order per loaded bundle. Keep newly authored IDs if an old dev
 * order file has not been regenerated yet; ignore retired/duplicate IDs.
 */
export const gridProjects=[...new Set([...order,...demoProjects.map(project=>project.id)])]
  .flatMap(id=>{const project=byId.get(id);return project?[project]:[];});
