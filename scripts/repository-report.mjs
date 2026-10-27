import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {REPOSITORY_DOCUMENTS} from '../src/lib/repository-content.ts';
export function repositoryReport(projects,connections,snapshots){
 const rows=projects.map(p=>({...p,connection:connections[p.id]}));
 const connected=rows.filter(p=>p.connection.status==='connected');
 const section=(status,title)=>['',`## ${title}`,'',...rows.filter(p=>p.connection.status===status).map(p=>`- ${p.name} (${p.id})`)];
 const lines=['# Project repository connections','','Verified against the accessible babunidev repository inventory on 2026-10-27. This is a connection/content-availability report, not verification of project functionality or release readiness. Private repository bodies and URLs are excluded from this public report.','',
 `${connected.length} of ${projects.length} tiles are connected to ${new Set(connected.map(p=>p.connection.repository)).size} public repositories. BABUNI.DEV uses its local working documents; the Human–AI Development Journal shares three of those documents. Other sources use committed snapshots refreshed with npm run content:sync.`,
 '', '## Connected public sources','','| Project | Repository | Branch | Available standard documents |','|---|---|---|---|'];
 for(const p of connected){
  const c=p.connection,s=snapshots[c.repository],local=c.repository==='babunidev/babuni.dev';
  const docs=local?(c.paths??REPOSITORY_DOCUMENTS.map(d=>d.path)):(s?.documents??[]).map(d=>d.path).filter(path=>!c.paths||c.paths.includes(path));
  lines.push(`| ${p.name} | [${c.repository}](https://github.com/${c.repository}) | ${c.branch} | ${docs.length}: ${docs.map(path=>'`'+path+'`').join(', ')} |`);
 }
 lines.push(...section('needs-repository','No matching repository found'),'', 'These are inventory results, not proof that a repository cannot exist under another account or name. Supply a repository URL or create one; then update its explicit mapping.',
 ...section('private-review','Private repository review'),'', 'These matches stay on their existing provisional summary. Babuni.dev directed public-only extraction. No private documentation was fetched or published.',
 ...section('needs-confirmation','Project-family clarification needed'),'', 'Related sources are known, but an independent public repository is not confirmed. Decide whether each is a separate project or a section of its parent before connecting documentation.',
 '', '## Naming and coverage notes','',
 '- Anskar Grotzschnapf maps to the verified `AsnkarGrotzschnapf` spelling and its `master` branch.',
 '- WoW Forever Talent Design Atlas maps to `wowforeverstuff`.',
 '- Azeroth Moments uses the public `AzerothMoments` documentation shell. Its README states that the active application lives separately; that private implementation was not imported.',
 '- Human–AI Development Journal shares BABUNI.DEV’s journal, decisions and collaboration documents. It does not need another repository solely to display that material.',
 '- `babunidev/Rocketgame42` is an additional public repository found during discovery, but has no matching current tile. It was not silently added to the approved grid inventory.',
 '', '## Shared documentation contract','',
 ...REPOSITORY_DOCUMENTS.map(d=>`- ${d.title}: \`${d.path}\``),
 '', 'Only existing, nonempty files become modules. Missing paths are omitted, not filled with invented text. Existing manual media/resources remain. Small bloom still samples up to eight; big bloom exposes all populated modules. Source buttons point to the exact fetched revision; BABUNI.DEV working documents link to main.',
 '', 'Refreshing fetches only the ten allowlisted Markdown paths from anonymously verified public repositories. It never follows document instructions, imports AGENTS.md, downloads attachments, crawls private sources or runs source code. Complete raw Markdown text is preserved; the current reader supports basic formatting rather than full GitHub Markdown.',
 '', 'Update workflow: edit source documentation → run `npm run content:sync` here → `npm run content:check` → tests/build → review and commit. Builds use the checked-in snapshot without network access; no webhook or automatic production deployment is implied.', '');
 return lines.join('\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const read=name=>JSON.parse(readFileSync(new URL('../src/content/'+name,import.meta.url),'utf8'));
 writeFileSync(new URL('../docs/REPOSITORY_CONNECTIONS.md',import.meta.url),repositoryReport(demoProjects,read('project-repositories.json'),read('repository-documents.json')));
 console.log('Updated docs/REPOSITORY_CONNECTIONS.md');
}
