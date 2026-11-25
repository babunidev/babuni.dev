// Screenshots are not kept in Git. Their WebP files live in public/screenshots/ on Babuni's computer
// (ignored by Git) and in /var/www/babuni.dev/shared/screenshots/ on the server, which nginx serves
// at /screenshots/. src/content/server-media.json lists every file with its size and SHA-256 so
// content checks and the upload script can confirm what exists without the files themselves.
//   node scripts/server-media.mjs update   add or refresh entries for every local file
import {readFileSync,writeFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
export const MANIFEST='src/content/server-media.json';
export const LOCAL_DIR='public/screenshots';
const SLUG='[a-z0-9]+(?:-[a-z0-9]+)*';
/** /screenshots/<project>/<date or folder>/[thumbs/]<name>.webp */
export const SERVER_MEDIA_URL=new RegExp(`^/screenshots/${SLUG}/${SLUG}/(?:thumbs/)?${SLUG}\\.webp$`);

export function readManifest(base=root){
  const path=join(base,MANIFEST);
  return existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
}
export function writeManifest(manifest,base=root){
  const sorted=Object.fromEntries(Object.keys(manifest).sort().map(key=>[key,manifest[key]]));
  writeFileSync(join(base,MANIFEST),JSON.stringify(sorted,null,1)+'\n');
}
/** Adds or refreshes local files; entries without a local copy stay, because the server keeps them. */
export function updateManifest(base=root){
  const manifest=readManifest(base),dir=join(base,LOCAL_DIR);let changed=0;
  const visit=folder=>{for(const entry of readdirSync(folder,{withFileTypes:true})){
    const path=join(folder,entry.name);
    if(entry.isDirectory()){visit(path);continue;}
    const url='/screenshots/'+relative(dir,path).split(sep).join('/');
    if(!SERVER_MEDIA_URL.test(url))throw new Error(`${url}: not a valid server media path`);
    const bytes=readFileSync(path);
    const record={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
    if(manifest[url]?.sha256!==record.sha256){manifest[url]=record;changed++;}
  }};
  if(existsSync(dir))visit(dir);
  writeManifest(manifest,base);
  return {manifest,changed};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv[2]!=='update'){console.error('Usage: node scripts/server-media.mjs update');process.exit(1);}
  const {manifest,changed}=updateManifest();
  const total=Object.values(manifest).reduce((s,r)=>s+r.bytes,0);
  console.log(`${MANIFEST}: ${Object.keys(manifest).length} files, ${Math.round(total/1024)} KB; ${changed} added or changed.`);
}
