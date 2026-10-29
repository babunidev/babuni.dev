import {readFileSync,writeFileSync,mkdirSync,rmSync,renameSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {REPOSITORY_DOCUMENTS,documentPreview} from '../src/lib/repository-content.ts';
import {moduleIntro} from '../src/lib/big-bloom.ts';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {prepareProjectActivity} from './sync-project-activity.mjs';
import {validateConnections,validateSnapshots} from './sync-repositories.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const LOCAL='babunidev/babuni.dev';
/** Deterministic, allowlisted URL names; no path from repository Markdown is used. */
export function documentAssetName(repository,path){
  if(!/^babunidev\/[\w.-]+$/.test(repository) || !REPOSITORY_DOCUMENTS.some(d=>d.path===path))
    throw new Error('Invalid public document asset mapping');
  return repository.replace('/','--')+'/'+path.replaceAll('/','--');
}
/** Pure indexing step; keep brief metadata in JS and Markdown outside JS.
 * Never modify, shorten or rewrite the actual document bodies.
 */
export function prepareDocumentAssets(connections,snapshots,localDocuments){
  const errors=[
    ...validateConnections(connections,demoProjects.map(p=>p.id)),
    ...validateSnapshots(connections,snapshots)
  ];
  if(errors.length)throw new Error(errors.join('\n'));
  const index={},assets=new Map();
  const connected=[...new Map(Object.values(connections)
    .filter(c=>c.status==='connected')
    .map(c=>[c.repository,c])).values()];
  for(const connection of connected){
    const repository=connection.repository;
    const local=repository===LOCAL;
    const snapshot=local?null:snapshots[repository];
    const source=local
      ?REPOSITORY_DOCUMENTS.map(d=>({path:d.path,body:localDocuments[d.path]}))
      :snapshot.documents;
    const documents=[];
    for(const {path,body} of source){
      if(!body?.trim())continue;
      const file=documentAssetName(repository,path);
      assets.set(file,body);
      documents.push({
        path,
        url:'/_project-docs/'+file,
        preview:documentPreview(body)||REPOSITORY_DOCUMENTS.find(d=>d.path===path).title,
        intro:moduleIntro({body,preview:''})
      });
    }
    index[repository]={
      repository,branch:connection.branch,commit:local?null:snapshot.commit,
      documents
    };
  }
  return {index,assets};
}
/** Build from checked-in snapshots only; no live GitHub calls or credentials.
 * Invoked by npm predev, pretest:grid and prebuild.
 */
export function writeDocumentAssets({base=root}={}){
  prepareProjectActivity({base});
  const readJson=path=>JSON.parse(readFileSync(join(base,path),'utf8'));
  const connections=readJson('src/content/project-repositories.json');
  const snapshots=readJson('src/content/repository-documents.json');
  const localDocuments=Object.fromEntries(REPOSITORY_DOCUMENTS.map(d=>[
    d.path,readFileSync(join(base,d.path),'utf8')
  ]));
  const {index,assets}=prepareDocumentAssets(connections,snapshots,localDocuments);
  const destination=join(base,'public/_project-docs');
  const temporary=destination+'.tmp';
  const manifest=join(base,'src/generated/document-index.json');
  rmSync(temporary,{recursive:true,force:true});
  mkdirSync(temporary,{recursive:true});
  for(const [name,body] of assets){
    const file=join(temporary,name);
    mkdirSync(dirname(file),{recursive:true});
    writeFileSync(file,body);
  }
  mkdirSync(dirname(manifest),{recursive:true});
  const staging=manifest+'.tmp';
  writeFileSync(staging,JSON.stringify(index)+'\n');
  rmSync(destination,{recursive:true,force:true});
  renameSync(temporary,destination);
  renameSync(staging,manifest);
  console.log('Prepared '+assets.size+' source documents in '+Object.keys(index).length+
    ' project repositories for on-demand reading.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  try{writeDocumentAssets();}catch(error){console.error(error.message);process.exitCode=1;}
