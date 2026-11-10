import {publicProjects} from '../lib/server/public-projects';
import {SITE_URL,projectPath,modulePath} from '../lib/site';
import {projectLastModified} from '../lib/seo';
import connections from '../content/project-repositories.json';
import activity from '../generated/project-activity.json';
export function GET(){
 const entries:[string,string|undefined][]=publicProjects.flatMap(p=>{
  const lastmod=projectLastModified(p.id,connections,activity);
  return [[projectPath(p.id),lastmod],...p.modules.map(m=>[modulePath(p.id,m.id),lastmod] as [string,string|undefined])];
 });
 const latest=entries.map(([,d])=>d).filter(Boolean).sort().at(-1);
 const all:[string,string|undefined][]=[['/',latest],['/projects/',latest],...entries];
 const body='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+all.map(([path,lastmod])=>`<url><loc>${SITE_URL}${path}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}</url>`).join('')+'</urlset>';
 return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
