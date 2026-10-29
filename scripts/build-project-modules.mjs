import {mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {modulesForProject} from '../src/lib/project-content.ts';
const output=new URL('../public/_project-modules/',import.meta.url);
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
for(const project of demoProjects)writeFileSync(new URL(project.id+'.json',output),JSON.stringify(modulesForProject(project.id,project.shortSummary))+'\n');
console.log('Prepared '+demoProjects.length+' on-demand public project module collections.');
