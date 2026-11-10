import {presentDocument} from './document-presentation.ts';
import {markdownExcerpt} from './markdown-excerpt.ts';
import {type ProjectModule} from './project-modules.ts';
import connectionMap from '../content/project-repositories.json' with {type:'json'};
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

export const ROAR_GUILD_REPOSITORY='babunidev/ROARguild';
export const ROAR_GUILD_DOCUMENTS=[
  {path:'guild/CHARTER.md',id:'charter',title:'Guild charter'},
  {path:'guild/COMMUNITY.md',id:'community',title:'Community principles'},
  {path:'guild/ACTIVITIES.md',id:'activities',title:'Activities and shared rituals'},
  {path:'guild/GOVERNANCE.md',id:'governance',title:'Governance and responsibilities'},
  {path:'events/sunday-campfires/README.md',id:'sunday-campfires',title:'Sunday road bonfires'},
  {path:'community-tools/ORACLE.md',id:'oracle',title:'The Oracle'},
] as const;
export type RepositoryDocument={path:string;id:string;title:string};
export function repositoryDocuments(repository:string):readonly RepositoryDocument[]{
  return repository===ROAR_GUILD_REPOSITORY
    ?[...REPOSITORY_DOCUMENTS,...ROAR_GUILD_DOCUMENTS]
    :REPOSITORY_DOCUMENTS;
}
/** The Buxbrew story's public lore folders are indexed, not individual bloom cards. */
export const CHARACTER_STORY_REPOSITORY='babunidev/AmberbrewStory';
export const CHARACTER_STORY_FOLDERS=['assets','character','docs','family','journal','lore','places','relationships','stories'] as const;
export const CHARACTER_STORY_ROOT_FILES=['AGENTS.md','CANON.md','TIMELINE.md','WRITING-GUIDE.md'] as const;
export function characterStoryDocumentPath(path:string):boolean {
  return (CHARACTER_STORY_ROOT_FILES as readonly string[]).includes(path)
    ||/^(?:assets|character|docs|family|journal|lore|places|relationships|stories)\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.md$/.test(path);
}
export interface RepositoryConnection {
  status:'connected'|'needs-repository'|'private-review'|'needs-confirmation';
  repository?:string;branch?:string;paths?:string[];note?:string;
  /** Top-level folders whose Markdown appears as folder modules (opt-in per repository). */
  folders?:string[];
}
export interface RepositorySnapshot {
  repository:string;branch:string;commit:string;syncedAt:string;
  documents:{path:string;body:string}[];
  /** Images paired with a folder document by name; stored as WebP under public/media/repositories/. */
  images?:{path:string;sha:string}[];
}
export const FOLDER_NAME=/^[A-Za-z0-9_-]+$/;
export const FOLDER_IMAGE_EXTENSIONS=['webp','png','jpg','jpeg'] as const;
/** Folders imported for a connection. AmberbrewStory keeps its reviewed folder list. */
export function connectionFolders(connection:{repository?:string;folders?:readonly string[]}|undefined):readonly string[]{
  if(connection?.repository===CHARACTER_STORY_REPOSITORY)return CHARACTER_STORY_FOLDERS;
  return connection?.folders??[];
}
/** A Markdown file inside one of the given folders (any depth, conservative names). */
export function folderDocumentPath(path:string,folders:readonly string[]):boolean {
  const top=path.split('/')[0];
  return folders.includes(top)&&/^[A-Za-z0-9_-]+\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.md$/.test(path);
}
/** Same folder, same name, image extension: `lore/HEARTH.png` belongs to `lore/HEARTH.md`. */
export function pairedImages(markdownPaths:readonly string[],imagePaths:readonly string[]):Map<string,string>{
  const byStem=new Map<string,string>();
  const rank=(path:string)=>FOLDER_IMAGE_EXTENSIONS.indexOf(path.slice(path.lastIndexOf('.')+1).toLowerCase() as typeof FOLDER_IMAGE_EXTENSIONS[number]);
  for(const image of imagePaths){
    if(rank(image)<0||!/^(?:[A-Za-z0-9_-]+\/)+[A-Za-z0-9_-]+\.[A-Za-z]+$/.test(image))continue;
    const stem=image.slice(0,image.lastIndexOf('.'));
    const current=byStem.get(stem);
    if(current===undefined||rank(image)<rank(current))byStem.set(stem,image);
  }
  const pairs=new Map<string,string>();
  for(const doc of markdownPaths){const image=byStem.get(doc.slice(0,-3));if(image)pairs.set(doc,image);}
  return pairs;
}
/** Deterministic public URL of a paired image's WebP derivative. */
export function repositoryImageUrl(repository:string,imagePath:string):string{
  if(!/^babunidev\/[\w.-]+$/.test(repository)||!/^(?:[A-Za-z0-9_-]+\/)+[A-Za-z0-9_-]+\.[A-Za-z]+$/.test(imagePath))
    throw new Error('Invalid repository image mapping');
  return '/media/repositories/'+repository.replace('/','--')+'/'+imagePath.slice(0,imagePath.lastIndexOf('.')).replaceAll('/','--')+'.webp';
}
/** Deterministic source excerpt, not an AI-authored factual summary. */
export function documentPreview(body:string):string {
  const lines=body.split(/\r?\n/);let fenced=false;const paragraph:string[]=[];
  for(const line of lines){
    if(/^\s*```/.test(line)){fenced=!fenced;continue;}
    if(fenced)continue;
    const text=line.trim();
    if(!text){if(paragraph.length)break;continue;}
    if(/^(?:#|\||>|[-*]\s|\d+\.\s|---|\*\*(?:Author|Owner|State|Status|Recorded|Origin|Edition))/i.test(text))continue;
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
  return repositoryDocuments(connection.repository).filter(doc=>!connection.paths||connection.paths.includes(doc.path)).flatMap(doc=>{
    const original=documents[doc.path];if(!original?.trim())return [];
    const body=presentDocument(original,doc.path);
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
export interface IndexedDocument {path:string;url:string;preview:string;intro:string;image?:string}
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
/** The folder modules refer exclusively to already snapshotted Markdown assets.
 * Root-level writing guides and canon live in Docs so no separate bloom tiles
 * are needed. Assets currently exposes its three empty image directories.
 */
export function indexedCharacterStoryFolders(
  connection:RepositoryConnection|undefined,index:IndexedRepository|undefined
):ProjectModule[]{
  if(connection?.status!=='connected'||connection.repository!==CHARACTER_STORY_REPOSITORY
     ||!index||index.repository!==connection.repository||index.branch!==connection.branch
     ||!/^[a-f0-9]{40}$/.test(index.commit??''))return [];
  return CHARACTER_STORY_FOLDERS.map(folder=>{
    const documents=index.documents.filter(doc=>
      doc.path.startsWith(folder+'/')||
      folder==='docs'&&(CHARACTER_STORY_ROOT_FILES as readonly string[]).includes(doc.path)
    ).sort((a,b)=>a.path.localeCompare(b.path));
    const source='https://github.com/'+CHARACTER_STORY_REPOSITORY+'/tree/'+index.commit+'/'+folder;
    const entries=documents.map(doc=>({
      title:doc.path.startsWith(folder+'/')?doc.path.slice(folder.length+1):doc.path,
      path:doc.path,bodyUrl:doc.url,...(doc.image?{image:doc.image}:{}),
      source:'https://github.com/'+CHARACTER_STORY_REPOSITORY+'/blob/'+index.commit+'/'+doc.path
    }));
    const links=folder==='assets'?['illustrations','references','screenshots'].map(name=>({
      label:name[0].toUpperCase()+name.slice(1),
      href:source+'/'+name
    })):[];
    const title=folder[0].toUpperCase()+folder.slice(1);
    const preview=entries.length
      ?entries.length+' Markdown '+(entries.length===1?'document':'documents')+' in '+title+'. Select a file to read its complete text.'
      :'Illustrations, references and screenshots. No Markdown files or published artwork in these folders yet.';
    return {
      id:'folder-'+folder,type:'document-list' as const,title,
      preview,intro:entries.length?'## '+title+' documents\n\n'+entries.map(e=>'- '+e.title).join('\n'):preview,
      documents:entries,links,source
    };
  });
}
/** Folder modules for any repository that opts in with `folders`. Each folder with
 * Markdown becomes one document list; a paired image is shown above its document.
 */
export function indexedFolderModules(
  connection:RepositoryConnection|undefined,index:IndexedRepository|undefined
):ProjectModule[]{
  if(connection?.status!=='connected'||!connection.repository||connection.repository===CHARACTER_STORY_REPOSITORY
     ||!connection.folders?.length||!index||index.repository!==connection.repository||index.branch!==connection.branch
     ||!/^[a-f0-9]{40}$/.test(index.commit??''))return [];
  const repository=connection.repository;
  return connection.folders.flatMap(folder=>{
    const documents=index.documents.filter(doc=>folderDocumentPath(doc.path,[folder])).sort((a,b)=>a.path.localeCompare(b.path));
    if(!documents.length)return [];
    const title=folder[0].toUpperCase()+folder.slice(1);
    const entries=documents.map(doc=>({
      title:doc.path.slice(folder.length+1),path:doc.path,bodyUrl:doc.url,...(doc.image?{image:doc.image}:{}),
      source:'https://github.com/'+repository+'/blob/'+index.commit+'/'+doc.path
    }));
    const preview=entries.length+' Markdown '+(entries.length===1?'document':'documents')+' in '+title+'. Select a file to read its complete text.';
    return [{
      id:'folder-'+folder.toLowerCase(),type:'document-list' as const,title,preview,
      intro:'## '+title+' documents\n\n'+entries.map(e=>'- '+e.title).join('\n'),
      documents:entries,source:'https://github.com/'+repository+'/tree/'+index.commit+'/'+folder
    }];
  });
}
const folderUrlPatterns=Object.values(connectionMap as Record<string,RepositoryConnection>)
  .filter(c=>c.status==='connected'&&c.repository&&c.repository!==CHARACTER_STORY_REPOSITORY&&c.folders?.length)
  .map(c=>new RegExp('^/_project-docs/'+c.repository!.replace('/','--').replace(/[.]/g,'\\.')+'/(?:'+c.folders!.join('|')+')(?:--[A-Za-z0-9_-]+)+\\.md$'));
/** The allowed source is local, generated and same-origin. Never fetch a
 * remote repository or follow Markdown-provided URLs to display its body.
 */
export async function loadIndexedBody(url:string,fetcher:typeof fetch=fetch,signal?:AbortSignal):Promise<string>{
  const standard=/^\/_project-docs\/babunidev--[\w.-]+\/(?:README\.md|CONCEPT\.md|CHANGELOG\.md|ROADMAP\.md|docs--[A-Z_]+\.md)$/;
  const story=/^\/_project-docs\/babunidev--AmberbrewStory\/(?:AGENTS|CANON|TIMELINE|WRITING-GUIDE|(?:assets|character|docs|family|journal|lore|places|relationships|stories)--[A-Za-z0-9_-]+(?:--[A-Za-z0-9_-]+)*)\.md$/;
  const roarGuild=/^\/_project-docs\/babunidev--ROARguild\/(?:guild--(?:CHARTER|COMMUNITY|ACTIVITIES|GOVERNANCE)\.md|events--sunday-campfires--README\.md|community-tools--ORACLE\.md)$/;
  if(!standard.test(url)&&!story.test(url)&&!roarGuild.test(url)&&!folderUrlPatterns.some(pattern=>pattern.test(url)))
    throw new Error('Invalid project document URL');
  const response=await fetcher(url,{signal});
  if(!response.ok)throw new Error('Document unavailable (HTTP '+response.status+')');
  return response.text();
}
