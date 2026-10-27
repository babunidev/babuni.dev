import {markdownExcerpt} from './markdown-excerpt.ts';
import {type ProjectModule} from './project-modules.ts';
/** Public documentation contract; path overrides must select from this list. */
export const REPOSITORY_DOCUMENTS=[
  {path:'README.md',id:'overview',title:'Overview'},
  {path:'CONCEPT.md',id:'concept',title:'Concept'},
  {path:'docs/DEVLOG.md',id:'journal',title:'Development journal'},
  {path:'CHANGELOG.md',id:'changes',title:'Changelog'},
  {path:'docs/ARCHITECTURE.md',id:'architecture',title:'Architecture'},
  {path:'docs/DESIGN.md',id:'design',title:'Design'},
  {path:'docs/DECISIONS.md',id:'decisions',title:'Decisions'},
  {path:'docs/AI_COLLABORATION.md',id:'collaboration',title:'Human–AI collaboration'},
  {path:'ROADMAP.md',id:'roadmap',title:'Roadmap'},
  {path:'docs/CONTENT.md',id:'content',title:'Content'},
] as const;
export interface RepositoryConnection {
  status:'connected'|'needs-repository'|'private-review'|'needs-confirmation';
  repository?:string;branch?:string;paths?:string[];note?:string;
}
export interface RepositorySnapshot {
  repository:string;branch:string;commit:string;syncedAt:string;
  documents:{path:string;body:string}[];
}
/** Deterministic source excerpt, not an AI-authored factual summary. */
export function documentPreview(body:string):string {
  const lines=body.split(/\r?\n/);let fenced=false;const paragraph:string[]=[];
  for(const line of lines){
    if(/^\s*```/.test(line)){fenced=!fenced;continue;}
    if(fenced)continue;
    const text=line.trim();
    if(!text){if(paragraph.length)break;continue;}
    if(/^(?:#|\||>|[-*]\s|\d+\.\s|---|\*\*(?:Author|Owner|State|Status|Recorded|Origin))/i.test(text))continue;
    paragraph.push(text);
  }
  return markdownExcerpt(paragraph.join(' ')||body,180);
}
export function repositoryModules(connection:RepositoryConnection|undefined,snapshot:RepositorySnapshot|undefined,localDocuments:Record<string,string>={}):ProjectModule[]{
  if(connection?.status!=='connected'||!connection.repository||!connection.branch)return [];
  const local=connection.repository==='babunidev/babuni.dev';
  if(!local&&(!snapshot||snapshot.repository!==connection.repository||snapshot.branch!==connection.branch))return [];
  const documents=local?localDocuments:Object.fromEntries(snapshot!.documents.map(d=>[d.path,d.body]));
  const ref=local?connection.branch:snapshot!.commit;
  return REPOSITORY_DOCUMENTS.filter(doc=>!connection.paths||connection.paths.includes(doc.path)).flatMap(doc=>{
    const body=documents[doc.path];if(!body?.trim())return [];
    return [{id:doc.id,type:'text' as const,title:doc.title,preview:documentPreview(body)||doc.title,body,
      source:`https://github.com/${connection.repository}/blob/${ref}/${doc.path}`}];
  });
}
/** Source text replaces matching curated text; manually authored media stays intact. */
export function composeProjectModules(curated:ProjectModule[],sourced:ProjectModule[],repository?:string):ProjectModule[]{
  const result=curated.map(module=>{
    const source=sourced.find(item=>item.id===module.id);
    return source?{...module,...source,preview:module.preview.trim()||source.preview}:module;
  });
  for(const module of sourced)if(!result.some(item=>item.id===module.id))result.push(module);
  if(repository&&!result.some(module=>module.id==='source'))result.push({id:'source',type:'resources',title:'Project source',preview:'Read the project repository and its documentation.',links:[{label:'Repository',href:`https://github.com/${repository}`} ]});
  return result;
}

/** Compact, build-generated source metadata. The full Markdown is a separate
 * static asset fetched only if its detail reader is opened.
 */
export interface IndexedDocument {path:string;url:string;preview:string;intro:string}
export interface IndexedRepository {
  repository:string;branch:string;commit:string|null;documents:IndexedDocument[];
}
export function indexedRepositoryModules(
  connection:RepositoryConnection|undefined,index:IndexedRepository|undefined
):ProjectModule[]{
  if(connection?.status!=='connected'||!connection.repository||!connection.branch
    ||!index||index.repository!==connection.repository||index.branch!==connection.branch)
    return [];
  const local=connection.repository==='babunidev/babuni.dev';
  if(!local&&!/^[a-f0-9]{40}$/.test(index.commit??''))return [];
  return REPOSITORY_DOCUMENTS
    .filter(doc=>!connection.paths||connection.paths.includes(doc.path))
    .flatMap(doc=>{
      const document=index.documents.find(item=>item.path===doc.path);
      if(!document)return [];
      const source='https://github.com/'+connection.repository+'/blob/'+
        (local?connection.branch:index.commit)+'/'+doc.path;
      return [{
        id:doc.id,type:'text' as const,title:doc.title,preview:document.preview,
        intro:document.intro,body:'',bodyUrl:document.url,source
      }];
    });
}
/** The allowed source is local, generated and same-origin. Never fetch a
 * remote repository or follow Markdown-provided URLs to display its body.
 */
export async function loadIndexedBody(url:string,fetcher:typeof fetch=fetch,signal?:AbortSignal):Promise<string>{
  if(!/^\/_project-docs\/babunidev--[\w.-]+\/(?:README\.md|CONCEPT\.md|CHANGELOG\.md|ROADMAP\.md|docs--[A-Z_]+\.md)$/.test(url))
    throw new Error('Invalid project document URL');
  const response=await fetcher(url,{signal});
  if(!response.ok)throw new Error('Document unavailable (HTTP '+response.status+')');
  return response.text();
}
