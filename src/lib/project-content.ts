import catalog from '../content/project-modules.json';
import concept from '../../CONCEPT.md?raw';
import journal from '../../docs/DEVLOG.md?raw';
import changes from '../../CHANGELOG.md?raw';
import architecture from '../../docs/ARCHITECTURE.md?raw';
import collaboration from '../../docs/AI_COLLABORATION.md?raw';
import {type ProjectModule} from './project-modules';
const documents:Record<string,string>={'CONCEPT.md':concept,'docs/DEVLOG.md':journal,
  'CHANGELOG.md':changes,'docs/ARCHITECTURE.md':architecture,'docs/AI_COLLABORATION.md':collaboration};
/** Content definitions remain independent of rendered project instances. */
export function modulesForProject(projectId:string,summary:string):ProjectModule[]{
  const entries=(catalog as Record<string,(ProjectModule&{document?:string})[]>)[projectId];
  if(!entries)return [{id:'overview',type:'text',title:'Overview',preview:summary,body:summary}];
  return entries.map(entry=>({...entry,body:entry.document?documents[entry.document]:entry.body}));
}
