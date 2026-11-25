// Usage: npm run screenshots:import -- <source-folder> <project-id> [--only name,name] [--skip name,name]
// Turns dated development screenshots (<source>/<YYYY-MM-DD>/*.png) into web-sized WebP
// files and thumbnails under public/screenshots/<project-id>/<date>/ (ignored by Git), then
// records them in src/content/server-media.json. Upload with scripts/publish-screenshots.sh.
// Originals are only read. Existing outputs are never overwritten.
import {readdirSync,existsSync,mkdirSync,statSync} from 'node:fs';
import {join,resolve,basename,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {updateManifest} from './server-media.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const DATE=/^\d{4}-\d{2}-\d{2}$/;
export const FULL={size:1600,quality:85},THUMB={size:480,quality:75};

/** `2026-11-13-Public Server.png` in folder 2026-11-13 → `public-server`. */
export function screenshotName(file,date){
  let stem=basename(file,extname(file));
  if(stem.startsWith(date+'-'))stem=stem.slice(date.length+1);
  const name=stem.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase()
    .replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(!name)throw new Error(`${file}: no usable name`);
  return name;
}
/** Public URLs of a screenshot and its thumbnail. */
export function screenshotUrls(project,date,name){
  const base=`/screenshots/${project}/${date}/`;
  return {src:base+name+'.webp',thumb:base+'thumbs/'+name+'.webp'};
}

/** Pure-white rows at the bottom edge: the captured page was shorter than the browser window.
 * At most half the image; any other colour ends the count, so real white content stays. */
export function blankBottomRows(pixels,width,height,channels){
  let rows=0;
  for(let y=height-1;y>=height/2;y--){
    const start=y*width*channels;
    for(let i=start;i<start+width*channels;i++)if(i%channels<3&&pixels[i]<250)return rows;
    rows++;
  }
  return rows;
}
async function encode(sharp,input,output,{size,quality}){
  const {data,info:raw}=await sharp(input,{limitInputPixels:60e6}).raw().toBuffer({resolveWithObject:true});
  const blank=blankBottomRows(data,raw.width,raw.height,raw.channels);
  const image=sharp(input,{limitInputPixels:60e6});
  if(blank>0)image.extract({left:0,top:0,width:raw.width,height:raw.height-blank});
  const info=await image
    .resize({width:size,height:size,fit:'inside',withoutEnlargement:true})
    .webp({quality,effort:6}).toFile(output);
  return {...info,croppedRows:blank};
}

export async function importScreenshots(source,project,{only=null,skip=new Set(),base=root}={}){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project))throw new Error('Project ID must be kebab-case');
  const {default:sharp}=await import('sharp');
  const results=[],seen=new Set();
  for(const date of readdirSync(source).filter(d=>DATE.test(d)).sort()){
    for(const file of readdirSync(join(source,date)).filter(f=>/\.(png|jpe?g|webp)$/i.test(f)).sort()){
      const name=screenshotName(file,date);
      if(only&&!only.has(name)||skip.has(name))continue;
      const key=date+'/'+name;
      if(seen.has(key))throw new Error(`${key}: two source files map to the same name`);
      seen.add(key);
      const urls=screenshotUrls(project,date,name);
      const full=join(base,'public',urls.src),thumb=join(base,'public',urls.thumb);
      mkdirSync(join(full,'..','thumbs'),{recursive:true});
      const input=join(source,date,file);
      if(statSync(input).size===0){console.warn(`skipped  ${date}/${file}: empty file`);continue;}
      let width,height,croppedRows=0,skipped=existsSync(full)&&existsSync(thumb);
      if(!skipped){
        if(!existsSync(full))({width,height,croppedRows}=await encode(sharp,input,full,FULL));
        if(!existsSync(thumb))await encode(sharp,input,thumb,THUMB);
      }
      if(width===undefined)({width,height}=await sharp(full).metadata());
      results.push({date,name,...urls,width,height,croppedRows,
        originalBytes:statSync(input).size,bytes:statSync(full).size,thumbBytes:statSync(thumb).size,skipped});
    }
  }
  return results;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  const onlyAt=args.indexOf('--only');
  const only=onlyAt>=0?new Set(args.splice(onlyAt,2)[1].split(',')):null;
  const skipAt=args.indexOf('--skip');
  const skip=new Set(skipAt>=0?args.splice(skipAt,2)[1].split(','):[]);
  const [source,project]=args;
  if(!source||!project){console.error('Usage: npm run screenshots:import -- <source-folder> <project-id> [--only name,name] [--skip name,name]');process.exit(1);}
  const results=await importScreenshots(resolve(source),project,{only,skip});
  const kb=n=>Math.round(n/1024)+' KB';
  for(const r of results)console.log(`${r.skipped?'kept   ':'created'} ${r.src}  ${r.width}×${r.height}  ${kb(r.originalBytes)} → ${kb(r.bytes)} (+${kb(r.thumbBytes)} thumb)${r.croppedRows?`, ${r.croppedRows} empty rows cropped`:''}`);
  const sum=k=>results.reduce((s,r)=>s+r[k],0);
  console.log(`${results.length} screenshots: ${kb(sum('originalBytes'))} original → ${kb(sum('bytes')+sum('thumbBytes'))} published`);
  const {changed}=updateManifest();
  console.log(`src/content/server-media.json: ${changed} entries added or changed. Next: scripts/publish-screenshots.sh`);
}
