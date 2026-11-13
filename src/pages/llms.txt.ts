import {publicProjects} from '../lib/server/public-projects';
import {SITE_URL,SITE_DESCRIPTION,projectPath} from '../lib/site';
/** llms.txt: a plain index for AI search tools, generated from the current catalog. */
export function GET(){
 const line=(s:string)=>s.replace(/\s+/g,' ').trim();
 const body=[
  '# Babuni.dev',
  '',
  `> ${line(SITE_DESCRIPTION)}`,
  '',
  'Online, I go by Babuni. In the project journals and decision records, I describe my creative direction and credit the AI work separately. Each project page links to its readable documents; the original Markdown is served under /_project-docs/.',
  '',
  '## Projects',
  '',
  ...publicProjects.map(p=>`- [${line(p.name)}](${SITE_URL}${projectPath(p.id)}): ${line(p.shortSummary)}`),
  '',
  '## Optional',
  '',
  `- [All projects](${SITE_URL}/projects/): overview of every project`,
  `- [Sitemap](${SITE_URL}/sitemap.xml): every public page`,
  '',
 ].join('\n');
 return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
