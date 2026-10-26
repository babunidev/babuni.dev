import {existsSync, readFileSync, realpathSync, statSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {moduleHasContent, safeEmbedUrl} from '../src/lib/project-modules.ts';

export const documentPaths = ['CONCEPT.md', 'docs/DEVLOG.md', 'CHANGELOG.md', 'docs/ARCHITECTURE.md', 'docs/AI_COLLABORATION.md'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const string = value => typeof value === 'string' && !!value.trim();
const http = value => {try {const u=new URL(value); return ['http:','https:'].includes(u.protocol) && !u.username && !u.password;} catch {return false;}};
export function validateContent(catalog, {projects=demoProjects, root=resolve(fileURLToPath(new URL('..', import.meta.url)))}={}) {
  const errors=[], counts=[];
  const fail=(at,message)=>errors.push(`${at}: ${message}`);
  const keys=(entry,allowed,at)=>Object.keys(entry).forEach(key=>{if(!allowed.includes(key))fail(`${at}.${key}`,'unknown field');});
  const asset=(value,at)=>{
    if(typeof value!=='string'||!value.startsWith('/')||value.startsWith('//')||/[?#\\%]/.test(value)||value.split('/').includes('..'))return fail(at,'use a public URL such as /media/project/image.jpg');
    const base=resolve(root,'public'), path=resolve(base,`.${value}`);
    if(!existsSync(path))return fail(at,`missing asset ${value}`);
    if(!statSync(path).isFile())fail(at,'expected a file');
    if(!realpathSync(path).startsWith(realpathSync(base)+sep))fail(at,'asset escapes public directory');
  };
  if(!object(catalog))return {errors:['catalog: expected an object keyed by project ID'],counts};
  for(const project of projects)if(project.portalArtwork)asset(project.portalArtwork,`${project.id}.portalArtwork`);
  for(const [project,entries] of Object.entries(catalog)) {
    if(!projects.some(p=>p.id===project))fail(project,'unknown project ID');
    if(!Array.isArray(entries)){fail(project,'expected module array');continue;}
    const ids=new Set(); let populated=0;
    entries.forEach((entry,index)=>{
      const at=`${project}[${index}]`, before=errors.length;
      if(!object(entry)){fail(at,'expected module object');return;}
      keys(entry,['id','type','title','preview','body','document','images','video','videos','links','source','credit'],at);
      for(const field of ['id','title'])if(!string(entry[field]))fail(`${at}.${field}`,'required nonempty text');
      if(string(entry.id)&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id))fail(`${at}.id`,'use lowercase words separated by hyphens');
      if(ids.has(entry.id))fail(`${at}.id`,'duplicate module ID');ids.add(entry.id);
      if(typeof entry.preview!=='string')fail(`${at}.preview`,'required text (may be empty for an empty module)');
      if(entry.source!==undefined&&!http(entry.source))fail(`${at}.source`,'expected HTTP(S) source URL');
      if(entry.credit!==undefined&&!string(entry.credit))fail(`${at}.credit`,'expected nonempty credit');
      const fields={text:['body','document'],gallery:['images'],video:['video','videos'],resources:['links']}[entry.type];
      if(!fields){fail(`${at}.type`,'expected text, gallery, video or resources');return;}
      for(const field of ['body','document','images','video','videos','links'])if(entry[field]!==undefined&&!fields.includes(field))fail(`${at}.${field}`,'field does not belong to this module type');
      if(entry.type==='text'){
        if(entry.body!==undefined&&typeof entry.body!=='string')fail(`${at}.body`,'expected text');
        if(entry.document!==undefined){
          if(entry.body!==undefined)fail(at,'choose body or document, not both');
          if(!documentPaths.includes(entry.document))fail(`${at}.document`,'document is not registered in project-content.ts');
          else if(!existsSync(resolve(root,entry.document)))fail(`${at}.document`,'missing document');
        }
      }
      const records=(field,allowed,check)=>{
        if(entry[field]===undefined)return;
        if(!Array.isArray(entry[field])){fail(`${at}.${field}`,'expected array');return;}
        entry[field].forEach((record,i)=>{const loc=`${at}.${field}[${i}]`;if(!object(record)){fail(loc,'expected object');return;}keys(record,allowed,loc);check(record,loc);});
      };
      records('images',['src','alt','caption'],(image,loc)=>{asset(image.src,`${loc}.src`);if(!string(image.alt))fail(`${loc}.alt`,'required descriptive alternative text');if(image.caption!==undefined&&!string(image.caption))fail(`${loc}.caption`,'expected nonempty text');});
      records('links',['label','href'],(link,loc)=>{if(!string(link.label))fail(`${loc}.label`,'required link label');if(!http(link.href))fail(`${loc}.href`,'expected HTTP(S) URL');});
      const video=(record,loc)=>{
        keys(record,['src','embed','poster','title'],loc);
        if(!string(record.title))fail(`${loc}.title`,'required video title');
        if((record.src!==undefined)===(record.embed!==undefined))fail(loc,'provide exactly one src or embed');
        if(record.src!==undefined)asset(record.src,`${loc}.src`);
        if(record.embed!==undefined&&(typeof record.embed!=='string'||!safeEmbedUrl(record.embed)))fail(`${loc}.embed`,'unsupported embed URL');
        if(record.poster!==undefined)asset(record.poster,`${loc}.poster`);
      };
      if(entry.video!==undefined){if(!object(entry.video))fail(`${at}.video`,'expected video object');else video(entry.video,`${at}.video`);}
      if(entry.video!==undefined&&entry.videos!==undefined)fail(at,'choose video or videos, not both');
      records('videos',['src','embed','poster','title'],video);
      if(errors.length===before){
        const resolved={...entry,body:entry.document?readFileSync(resolve(root,entry.document),'utf8'):entry.body};
        if(moduleHasContent(resolved)){populated++;if(!string(entry.preview))fail(`${at}.preview`,'populated module needs a preview');}
      }
    });
    counts.push({project,populated,empty:entries.length-populated});
  }
  return {errors,counts};
}
export function moduleTemplate(type,id){
  if(!['text','gallery','video','resources'].includes(type)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id??''))throw new Error('Usage: npm run content:template -- <text|gallery|video|resources> <module-id>');
  return {id,type,title:id.split('-').map(word=>word[0].toUpperCase()+word.slice(1)).join(' '),preview:'',...({text:{body:''},gallery:{images:[]},video:{videos:[]},resources:{links:[]}}[type])};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try {
    if(process.argv[2]==='template')console.log(JSON.stringify(moduleTemplate(process.argv[3],process.argv[4]),null,2));
    else {
      const catalog=JSON.parse(readFileSync(new URL('../src/content/project-modules.json',import.meta.url),'utf8'));
      const {errors,counts}=validateContent(catalog);
      for(const count of counts)console.log(`${count.project}: ${count.populated} populated, ${count.empty} empty`);
      if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Content validation passed. Local files and definitions checked; external destinations and factual accuracy require editorial review.');
    }
  } catch(error){console.error(error.message);process.exitCode=1;}
}
