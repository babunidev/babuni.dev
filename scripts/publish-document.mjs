import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {presentDocument} from '../src/lib/document-presentation.ts';
import {moduleIntro} from '../src/lib/big-bloom.ts';
import {markdownHtml} from '../src/lib/server/markdown-html.ts';
import {documentAssetName} from './build-document-assets.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const LOCAL='babunidev/babuni.dev';
const STYLES=[[undefined,''],[undefined,'\n'],[2,''],[2,'\n']];
const ARTICLE=/(<article[^>]*>)[\s\S]*?(<\/article>)/;

function parseJson(text,name){
  const data=JSON.parse(text);
  const style=STYLES.find(([indent,end])=>JSON.stringify(data,null,indent)+end===text);
  if(!style)throw new Error('Unrecognized JSON formatting: '+name);
  return {data,style};
}

/** Pure step: returns relative path -> new content for every file one document feeds. */
export function renderDocumentUpdate({site,repository,path,body}){
  if(repository!==LOCAL)throw new Error('Only '+LOCAL+' documents are supported until snapshot updates exist');
  const url='/_project-docs/'+documentAssetName(repository,path);
  const presented=presentDocument(body,path);
  const files=new Map([[url.slice(1),presented]]);
  const modulesDir=join(site,'_project-modules');
  for(const name of readdirSync(modulesDir).filter(n=>n.endsWith('.json')).sort()){
    const projectId=name.slice(0,-5);
    const {data,style}=parseJson(readFileSync(join(modulesDir,name),'utf8'),name);
    const list=Array.isArray(data)?data:data.modules;
    if(!Array.isArray(list))throw new Error('Unsupported module file shape: '+name);
    let touched=false;
    for(const module of list){
      if(module.bodyUrl!==url)continue;
      touched=true;
      module.intro=moduleIntro({body:presented,preview:''});
      if(module.type!=='text')continue;
      const pagePath=join('projects',projectId,module.id,'index.html');
      const page=readFileSync(join(site,pagePath),'utf8');
      if(!ARTICLE.test(page))throw new Error('Article not found in '+pagePath);
      const html=markdownHtml(presented,module.source);
      files.set(pagePath,page.replace(ARTICLE,(_,open,close)=>open+html+close));
    }
    if(touched)files.set(join('_project-modules',name),JSON.stringify(data,null,style[0])+style[1]);
  }
  return files;
}

function main(){
  const args={};
  const argv=process.argv.slice(2);
  for(let i=0;i<argv.length;i++)if(argv[i].startsWith('--'))args[argv[i].slice(2)]=argv[++i];
  const {site,out,repo,path}=args;
  if(!site||!out||!repo||!path)throw new Error('Usage: publish-document.mjs --site <dir> --out <dir> --repo <owner/name> --path <file> [--from <file>]');
  const body=readFileSync(args.from||join(root,path),'utf8');
  const files=renderDocumentUpdate({site:resolve(site),repository:repo,path,body});
  for(const [rel,content] of files){
    const target=join(resolve(out),rel);
    mkdirSync(dirname(target),{recursive:true});
    writeFileSync(target,content);
    console.log(rel.padEnd(72),Buffer.byteLength(content),'bytes');
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{main();}catch(error){console.error(error.message);process.exitCode=1;}
}
