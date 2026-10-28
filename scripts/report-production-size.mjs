import {readdirSync,readFileSync} from 'node:fs';
import {join,extname,resolve,relative} from 'node:path';
import {gzipSync,brotliCompressSync} from 'node:zlib';
/** Artifact sizes, not an assertion about server compression or client transfer. */
export function productionSizeReport(directory){
 const files=[];
 function visit(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,entry.name);if(entry.isDirectory())visit(path);
  else if(entry.isFile()&&!entry.name.startsWith('__production-probe')){
   const body=readFileSync(path);files.push({path:relative(directory,path),bytes:body.length,extension:extname(path)});
  }
 }}visit(directory);
 const groups={};for(const file of files){const group=groups[file.extension]??{files:0,bytes:0};group.files++;group.bytes+=file.bytes;groups[file.extension]=group;}
 const javascript=files.filter(file=>file.extension==='.js').map(file=>{
  const body=readFileSync(join(directory,file.path));return {...file,gzip:gzipSync(body).length,brotli:brotliCompressSync(body).length};
 });
 return {files:files.length,bytes:files.reduce((sum,file)=>sum+file.bytes,0),groups,javascript,largest:files.sort((a,b)=>b.bytes-a.bytes).slice(0,8)};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname)
 console.log(JSON.stringify(productionSizeReport(resolve(process.argv[2]??'dist')),null,2));
