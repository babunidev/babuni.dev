import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(process.argv[2]??'dist'),origin='https://www.babuni.dev';
const xml=readFileSync(root+'/sitemap.xml','utf8'),urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.ok(urls.length>42);assert.equal(new Set(urls).size,urls.length);
for(const url of urls){
 assert.ok(url.startsWith(origin+'/'));const path=url.slice(origin.length);const file=resolve(root,'.'+path,'index.html');
 assert.ok(file.startsWith(root+'/')&&existsSync(file),url);const html=readFileSync(file,'utf8');
 assert.ok(html.includes(`<link rel="canonical" href="${url}"`),url+' canonical');
 assert.match(html,/<title>[^<]+<\/title>/);assert.ok(html.includes('property="og:image"'));assert.ok(html.includes('name="description"'));
 if(path.startsWith('/projects/'))assert.match(html,/<h1[\s>]/);
 for(const match of html.matchAll(/href="(\/projects\/[^"#?]*)"/g))assert.ok(existsSync(resolve(root,'.'+match[1],'index.html')),url+' '+match[1]);
}
assert.ok(readFileSync(root+'/robots.txt','utf8').includes('Sitemap: '+origin+'/sitemap.xml'));
console.log('Verified '+urls.length+' canonical, metadata-equipped public URLs and their internal project links.');
