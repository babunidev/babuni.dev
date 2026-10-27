import {readdirSync,readFileSync} from 'node:fs';
import {join,extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
/** Publishing guard: image extensions and file contents must agree. */
export function checkWebp(root){
 if(root instanceof URL)root=fileURLToPath(root);
 const errors=[];
 function visit(directory){
  for(const entry of readdirSync(directory,{withFileTypes:true})){
   const path=join(directory,entry.name);
   if(entry.isDirectory()){visit(path);continue;}
   const extension=extname(path).toLowerCase();
   if(['.png','.jpg','.jpeg','.gif','.apng','.avif','.bmp','.tif','.tiff','.ico','.svg'].includes(extension))errors.push(`${path}: publish a WebP derivative instead`);
   if(extension==='.webp'){
    const bytes=readFileSync(path);
    if(bytes.length<16||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||!['VP8 ','VP8L','VP8X'].includes(bytes.toString('ascii',12,16)))errors.push(`${path}: invalid WebP signature`);
   }
  }
 }
 visit(root);return errors;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const errors=checkWebp(fileURLToPath(new URL('../public',import.meta.url)));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Public image assets use verified WebP containers.');
}
