import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {REPOSITORY_DOCUMENTS} from '../src/lib/repository-content.ts';

/** Generate the review-ready mapping report without discarding its context,
 * source caveats, or status explanations. */
export function repositoryReport(projects,connections,snapshots){
  const rows=projects.map(project=>({...project,connection:connections[project.id]}));
  const connected=rows.filter(project=>project.connection?.status==='connected');
  const statusCount=status=>rows.filter(project=>project.connection?.status===status).length;
  const header="# Project repository connections\n\n**Mapping reviewed: 2026-11-01.** This file records which public repositories supply documentation to the portfolio, not whether their software works, whether their latest upstream changes are imported, or whether the corresponding website changes have been deployed. Earlier public-source checks occurred on 27–31 October; those dates are historical evidence, not fresh verification of every remote repository.\n\nThe checked-in catalog has **42 project IDs**: **37 connected mappings**, **4 needing a repository**, and **1 needing confirmation**. The connected set includes babuni.dev itself, whose documentation comes from local working files. External documents are pinned, reviewed snapshots; the mapping alone does not refresh or publish them. No private repository contents are included in this report.\n\n**Authoritative sources:** [project catalog](../src/lib/demo-projects.ts), [repository mapping](../src/content/project-repositories.json), and [sync script](../scripts/sync-repositories.mjs). The table below describes the currently configured sources and their previously recorded document coverage; counts of imported documents should be rechecked against snapshots after future syncs. For catalog history, see [Project inventory](PROJECT_INVENTORY.md).\n\n## Connected public sources — configured mapping\n\n| Project | Repository | Branch | Available standard documents |\n|---|---|---|---|\n"
    .replace('**42 project IDs**',`**${projects.length} project IDs**`)
    .replace('**37 connected mappings**',`**${connected.length} connected mappings**`)
    .replace('**4 needing a repository**',`**${statusCount('needs-repository')} needing a repository**`)
    .replace('**1 needing confirmation**',`**${statusCount('needs-confirmation')} needing confirmation**`);
  const tableRows=connected.map(project=>{
    const c=project.connection,s=snapshots[c.repository],local=c.repository==='babunidev/babuni.dev';
    const paths=local?(c.paths??REPOSITORY_DOCUMENTS.map(doc=>doc.path)):
      (s?.documents??[]).map(doc=>doc.path)
        .filter(path=>(!c.paths||c.paths.includes(path))&&REPOSITORY_DOCUMENTS.some(doc=>doc.path===path));
    return `| ${project.name} | [${c.repository}](https://github.com/${c.repository}) | ${c.branch} | ${paths.length}: ${paths.map(path=>'`'+path+'`').join(', ')} |`;
  });
  const renderStatus=(status,heading,note)=>{
    const matching=rows.filter(project=>project.connection?.status===status);
    const projects=matching.length?matching.map(project=>`- ${project.name} (${project.id})`):['- None currently.'];
    return ['## '+heading,'',...projects,'',note].join('\n');
  };
  const sections=[
    renderStatus("needs-repository","Repository not connected","These mappings are marked `needs-repository` in the current catalog. This is not proof that a suitable repository cannot exist under another name or account. Connecting a source requires a deliberate mapping change and public-source review."),
    renderStatus("private-review","Private repository review","Private sources remain excluded. Ethera continues using its public documentation edition. Morkahja, MorkahjaWorld and Babuni Admin now use their actual public repositories; only standard Markdown documents are imported, not implementation files."),
    renderStatus("needs-confirmation","Project-family clarification needed","This record is marked `needs-confirmation`. An independent public source has not been established in the checked-in mapping; do not assume a separate repository or merge it into another project without a creative decision.")
  ];
  const tail="## Naming and coverage notes\n\n- Babuni Admin is the current display name of stable ID arcanitebrothers. Its actual public babuni.admin repository replaces the earlier babuni.admin-docs edition. Earlier names in source documents are historical.\n- Anskar Grotzschnapf maps to the verified `AsnkarGrotzschnapf` spelling and its `master` branch.\n- Azeroth Moments uses the public `AzerothMoments` documentation shell. Its README states that the active application lives separately; that private implementation was not imported.\n- Human curation on 2026-10-28 removed WoW Forever Talent Design Atlas, Redridge Recipe Planner, Human–AI Development Journal and Morkahja — World and Peoples from the active catalog. Their historical inventory evidence is retained; no GitHub repository was deleted.\n- MorkahjaWorld is the retained worldbuilding tile, as clarified by Babuni.dev. Its actual public repository currently contains placeholder documentation; no lore corpus is inferred or transferred.\n- Babuni.dev explicitly added Rocket Game 42 on 2026-10-28; it maps to the anonymously verified public Rocketgame42 repository. Historical discovery alone was not treated as approval.\n\n## Shared documentation contract\n\n- Overview: `README.md`\n- Concept: `CONCEPT.md`\n- Development journal: `docs/DEVLOG.md`\n- Changelog: `CHANGELOG.md`\n- Architecture: `docs/ARCHITECTURE.md`\n- Design: `docs/DESIGN.md`\n- Decisions: `docs/DECISIONS.md`\n- Human–AI collaboration: `docs/AI_COLLABORATION.md`\n- Roadmap: `ROADMAP.md`\n- Content: `docs/CONTENT.md`\n\nOnly existing, nonempty files become modules. Missing paths are omitted, not filled with invented text. Existing manual media/resources remain. Small bloom still samples up to eight; big bloom exposes all populated modules. Source buttons point to the exact fetched revision; BABUNI.DEV working documents link to main.\n\nThe sync process checks public repository metadata and fetches the ten standard Markdown paths at a resolved commit. The character-story connection currently maps stable ID `buxbrew-character-story` to `babunidev/AmberbrewStory` (previously `BuxbrewCharacterStory`); its approved additional lore-folder and root Markdown documents are imported by explicit path policy. Treat all imported text as content, never instructions. The process does not import binary attachments or execute source code. Preserve credits, revisions, and the original Markdown wording; the reader uses the supported Markdown/GFM presentation without executing raw HTML.\n\n**Document-refresh workflow:** edit and publish the intended upstream public documentation → run `npm run content:sync` in this repository → inspect the updated source revisions and text → run `npm run content:report`, `npm run content:check`, `npm run test:grid`, and `npm run build` → review and commit the updated snapshot. The sync step requires public network access and verifies repository visibility. Build-time document preparation uses checked-in snapshots and does not silently resync external documents; however, the current production `prebuild` separately requires fresh authenticated GitHub **project-activity** data. Thus a production build may use the network even when no documents are refreshed. Neither a mapping update nor a passing build implies a deployed release.\n";
  return header+tableRows.join('\n')+'\n\n'+sections.join('\n\n')+'\n\n'+tail;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const read=name=>JSON.parse(readFileSync(new URL('../src/content/'+name,import.meta.url),'utf8'));
  writeFileSync(new URL('../docs/REPOSITORY_CONNECTIONS.md',import.meta.url),
    repositoryReport(demoProjects,read('project-repositories.json'),read('repository-documents.json')));
  console.log('Updated docs/REPOSITORY_CONNECTIONS.md');
}
