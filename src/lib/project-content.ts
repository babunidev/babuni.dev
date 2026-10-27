import catalog from '../content/project-modules.json';
import connections from '../content/project-repositories.json';
import index from '../generated/document-index.json';
import {type ProjectModule} from './project-modules';
import {indexedRepositoryModules,composeProjectModules,type RepositoryConnection,
  type IndexedRepository} from './repository-content';
const indexes=index as Record<string,IndexedRepository>;
/** A compact, synchronous list of previews keeps every bloom animation and
 * module selection immediate. Full Markdown is fetched only inside detail.
 */
export function modulesForProject(projectId:string,summary:string):ProjectModule[]{
  const connection=(connections as Record<string,RepositoryConnection>)[projectId];
  const source=indexedRepositoryModules(connection,connection?.repository?indexes[connection.repository]:undefined);
  const local=indexes['babunidev/babuni.dev'];
  const entries=(catalog as Record<string,(ProjectModule&{document?:string})[]>)[projectId]??[];
  const curated=entries.map(({document,...entry})=>{
    if(!document)return entry;
    const resource=local?.documents.find(d=>d.path===document);
    return {...entry,body:'',intro:resource?.intro,bodyUrl:resource?.url};
  });
  const modules=composeProjectModules(curated,source,connection?.status==='connected'?connection.repository:undefined);
  return modules.length?modules:[{id:'overview',type:'text',title:'Overview',preview:summary,body:summary}];
}
