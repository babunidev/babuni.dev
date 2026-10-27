import catalog from '../content/project-modules.json';
import connections from '../content/project-repositories.json';
import snapshots from '../content/repository-documents.json';
import overview from '../../README.md?raw';
import concept from '../../CONCEPT.md?raw';
import journal from '../../docs/DEVLOG.md?raw';
import changes from '../../CHANGELOG.md?raw';
import architecture from '../../docs/ARCHITECTURE.md?raw';
import collaboration from '../../docs/AI_COLLABORATION.md?raw';
import design from '../../docs/DESIGN.md?raw';
import decisions from '../../docs/DECISIONS.md?raw';
import roadmap from '../../ROADMAP.md?raw';
import content from '../../docs/CONTENT.md?raw';
import {type ProjectModule} from './project-modules';
import {repositoryModules,composeProjectModules,type RepositoryConnection,type RepositorySnapshot} from './repository-content';
const documents:Record<string,string>={'README.md':overview,'CONCEPT.md':concept,'docs/DEVLOG.md':journal,
  'CHANGELOG.md':changes,'docs/ARCHITECTURE.md':architecture,'docs/AI_COLLABORATION.md':collaboration,
  'docs/DESIGN.md':design,'docs/DECISIONS.md':decisions,'ROADMAP.md':roadmap,'docs/CONTENT.md':content};
/** Stable project identity selects repository documents, independently of visual tiles. */
export function modulesForProject(projectId:string,summary:string):ProjectModule[]{
  const connection=(connections as Record<string,RepositoryConnection>)[projectId];
  const snapshot=connection?.repository?(snapshots as Record<string,RepositorySnapshot>)[connection.repository]:undefined;
  const entries=(catalog as Record<string,(ProjectModule&{document?:string})[]>)[projectId]??[];
  const curated=entries.map(({document,...entry})=>({...entry,body:document?documents[document]:entry.body}));
  const sourced=repositoryModules(connection,snapshot,documents);
  const modules=composeProjectModules(curated,sourced,connection?.status==='connected'?connection.repository:undefined);
  return modules.length?modules:[{id:'overview',type:'text',title:'Overview',preview:summary,body:summary}];
}
