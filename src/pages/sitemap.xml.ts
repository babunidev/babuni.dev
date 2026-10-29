import {publicProjects} from '../lib/server/public-projects';
import {SITE_URL,projectPath,modulePath} from '../lib/site';
export function GET(){
 const paths=['/','/projects/',...publicProjects.flatMap(p=>[projectPath(p.id),...p.modules.map(m=>modulePath(p.id,m.id))])];
 const body='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>`<url><loc>${SITE_URL}${path}</loc></url>`).join('')+'</urlset>';
 return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
