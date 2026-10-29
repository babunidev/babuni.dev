import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {demoProjects} from '../demo-projects';
import {modulesForProject} from '../project-content';
import {moduleHasContent} from '../project-modules';
/** All current catalog projects are approved public by Babuni.dev, 2026-10-29.
 * Only connected public-source snapshots and existing curated modules are used. */
export const publicProjects=demoProjects.map(project=>({...project,modules:modulesForProject(project.id,project.shortSummary).filter(moduleHasContent)}));
export function moduleBody(module:{body?:string;bodyUrl?:string}):string {
 if(!module.bodyUrl)return module.body??'';
 if(!/^\/_project-docs\/babunidev--[\w.-]+\/(?:README\.md|CONCEPT\.md|CHANGELOG\.md|ROADMAP\.md|docs--[A-Z_]+\.md)$/.test(module.bodyUrl))throw new Error('Invalid generated document path');
 return readFileSync(fileURLToPath(new URL('../../../public'+module.bodyUrl,import.meta.url)),'utf8');
}
