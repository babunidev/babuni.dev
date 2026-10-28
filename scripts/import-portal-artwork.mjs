import {copyFileSync,renameSync,existsSync,mkdirSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {basename,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {demoProjects} from '../src/lib/demo-projects.ts';

const repositoryRoot=fileURLToPath(new URL('..',import.meta.url));
export const PORTAL_WEBP_ASSETS=[...new Map(demoProjects
  .filter(project=>Boolean(project.portalArtwork))
  .map(project=>[basename(project.portalArtwork),{projectId:project.id,filename:basename(project.portalArtwork)}])).values()];

/** Linux file managers may show spaces or alternate capitalization. Keep
 * the original WebP bytes; only standardize names in the repository.
 */
export function normalizePortalFilename(name){
  return name.normalize('NFKD').toLowerCase().replace(/\.webp$/i,'').replace(/[^a-z0-9]/g,'');
}
export function importPortalArtwork(sourceDir,{destination=join(repositoryRoot,'public/portal-content')}={}){
  const directory=resolve(sourceDir);
  if(!existsSync(directory)||!statSync(directory).isDirectory())
    throw new Error('No such source folder: '+directory);
  const sources=readdirSync(directory).filter(name=>/\.webp$/i.test(name));
  const lookup=new Map();
  for(const name of sources){
    const key=normalizePortalFilename(name);
    if(lookup.has(key))throw new Error('Ambiguous WebP filenames: '+lookup.get(key)+' and '+name);
    lookup.set(key,name);
  }
  const matches=[];
  const missing=[];
  for(const expected of PORTAL_WEBP_ASSETS){
    const sourceName=lookup.get(normalizePortalFilename(expected.filename));
    if(!sourceName){missing.push(expected.filename);continue;}
    const from=join(directory,sourceName);
    const signature=readFileSync(from).subarray(0,12);
    if(signature.length<12||signature.toString('ascii',0,4)!=='RIFF'
      ||signature.toString('ascii',8,12)!=='WEBP')
      throw new Error(sourceName+' is not a valid WebP container');
    matches.push({from,to:join(destination,expected.filename),projectId:expected.projectId,filename:expected.filename});
  }
  if(missing.length)throw new Error('Missing '+missing.length+' WebP(s): '+missing.join(', '));
  mkdirSync(destination,{recursive:true});
  for(const file of matches){
    if(resolve(file.from)===resolve(file.to))continue;
    if(resolve(directory)===resolve(destination))renameSync(file.from,file.to);
    else copyFileSync(file.from,file.to);
  }
  return matches;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const directory=process.argv[2];
  if(!directory){
    console.error('Usage: npm run artwork:import -- "/absolute/path/to/your/WebP-folder"');
    process.exitCode=1;
  }else try{
    const files=importPortalArtwork(directory);
    for(const file of files)console.log(file.projectId+' -> public/portal-content/'+file.filename);
    console.log('Prepared '+files.length+' original WebP images. Next: git add -A public/portal-content');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
