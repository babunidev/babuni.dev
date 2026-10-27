import {readdirSync,readFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
import {gzipSync} from 'node:zlib';

export function javascriptBuildReport(directory){
  const files=[];
  function visit(dir){
    for(const entry of readdirSync(dir,{withFileTypes:true})){
      const path=join(dir,entry.name);
      if(entry.isDirectory())visit(path);
      else if(entry.isFile()&&entry.name.endsWith('.js')){
        const source=readFileSync(path);
        files.push({path:relative(directory,path),bytes:source.length,gzip:gzipSync(source).length});
      }
    }
  }
  visit(directory);
  return files.sort((a,b)=>b.bytes-a.bytes);
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){
  const files=javascriptBuildReport(resolve('dist/_astro'));
  const size=n=>(n/1024).toFixed(1)+' KiB';
  console.log('Client JavaScript payloads (raw and gzip; not transfer measurements):');
  for(const file of files.slice(0,10))console.log(size(file.bytes)+' raw / '+size(file.gzip)+' gzip  '+file.path);
  console.log('Total: '+size(files.reduce((n,f)=>n+f.bytes,0))+' raw / '+
    size(files.reduce((n,f)=>n+f.gzip,0))+' gzip across '+files.length+' JS files');
}
