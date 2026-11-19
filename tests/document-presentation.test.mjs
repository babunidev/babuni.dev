import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {presentDocument,dropsDocumentTitle} from '../src/lib/document-presentation.ts';
import {documentPreview} from '../src/lib/repository-content.ts';
test('introductory facts move to the footer and the preview starts with actual content',()=>{
 const source='# Addon\n\n**Creator and project author:** Babuni.dev  \n**Current version:** 1.2  \n**Target declared by manifest:** 11200  \n**Primary files:** `Addon.lua`\n\nThis addon displays buffs.\n\n## Usage\n\nClick **Buffs**.\n';
 const out=presentDocument(source,'README.md');
 assert.ok(out.indexOf('This addon')<out.indexOf('**Creator'));
 assert.ok(out.indexOf('Click **Buffs**')<out.indexOf('## Document information'));
 assert.match(documentPreview(out),/^This addon/);assert.match(out,/\*\*Target declared by manifest:\*\* 11200/);
 assert.equal(presentDocument(out,'README.md'),out);
});
test('log entries sort newest first with nested content, fences, ties and undated sections preserved',()=>{
 const source='# Journal\n\nIntro.\n\n## 2025-01-01 — old\n\nOld entry.\n\n### Details\n\n```md\n## 2099-01-01\n```\n\n## Context\n\nUndated.\n\n## 2026-10-29 — latest\n\nLatest entry.\n\n## 2026-10-29 — second\n\nSame day.\n';
 const out=presentDocument(source,'docs/DEVLOG.md');
 assert.ok(out.indexOf('— latest')<out.indexOf('— second'));assert.ok(out.indexOf('— second')<out.indexOf('— old'));
 assert.ok(out.includes('### Details\n\n```md\n## 2099-01-01\n```'));
 assert.ok(out.includes('## Context\n\nUndated.'));assert.equal(presentDocument(source,'lore/NOTES.md'),source);
});
test('month names use only an unambiguous sibling year and never invent missing dates',()=>{
 const out=presentDocument('# Log\n\n## September 7, 2026\n\nFirst.\n\n## October 26\n\nLatest.\n','CHANGELOG.md');
 assert.ok(out.indexOf('October')<out.indexOf('September'));
 const unknown='# Log\n\n## September 7\n\nFirst.\n\n## October 26\n\nSecond.\n';assert.equal(presentDocument(unknown,'Example/CHANGELOG.md'),unknown);
});
test('every imported document retains all non-whitespace source characters across presentation',()=>{
 const snapshots=JSON.parse(readFileSync(new URL('../src/content/repository-documents.json',import.meta.url)));
 const characters=s=>[...s.replace(/\s/g,'')].sort().join('');
 for(const snapshot of Object.values(snapshots))for(const doc of snapshot.documents){
  const out=presentDocument(doc.body,doc.path);
  // Allowed: the duplicate H1 of a titled document, and the two headings presentation adds.
  const title=dropsDocumentTitle(doc.path)?doc.body.match(/^\s*#\s[^\n]*/)?.[0]??'':'';
  assert.equal(characters(out.replace('## Document information','').replace('## About this log','')),characters(doc.body.replace(title,'')),snapshot.repository+' '+doc.path);
 }
});

test('standard documents drop the H1 that repeats the module title',()=>{
 assert.equal(presentDocument('# Changelog\n\n## 2026-11-19\n\n- Change.\n','CHANGELOG.md'),'## 2026-11-19\n\n- Change.\n');
 assert.equal(presentDocument('# Concept\n\nIdea.\n','docs/CONCEPT.md'),'Idea.\n');
 assert.equal(presentDocument('# Lore note\n\nText.\n','lore/NOTE.md'),'# Lore note\n\nText.\n');
});
test('a log opens on its newest entry; its introduction moves to the end',()=>{
 const out=presentDocument('# Changelog\n\nWhat this file records.\n\n## 2026-01-01 — old\n\n- Old.\n\n## 2026-11-19 — new\n\n- New.\n','CHANGELOG.md');
 assert.ok(out.startsWith('## 2026-11-19 — new'));
 assert.ok(out.trimEnd().endsWith('## About this log\n\nWhat this file records.'));
});
