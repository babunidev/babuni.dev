import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateContent,moduleTemplate} from '../scripts/content-tools.mjs';
const projects=[{id:'example'}];
const check=entries=>validateContent({example:entries},{projects});
test('all blank templates remain valid and invisible until authored',()=>{
  for(const type of ['text','gallery','video','resources']){
    const result=check([moduleTemplate(type,'new-module')]);
    assert.deepEqual(result.errors,[]);assert.equal(result.counts[0].empty,1);
  }
  assert.throws(()=>moduleTemplate('unknown','bad'));assert.throws(()=>moduleTemplate('text','../bad'));
});
test('current content and portal assets validate',()=>{
  assert.deepEqual(validateContent(JSON.parse(readFileSync(new URL('../src/content/project-modules.json',import.meta.url)))).errors,[]);
});
test('malformed definitions produce locations instead of crashing',()=>{
  const bad=[null,{id:'duplicate',type:'gallery',title:'Gallery',preview:'Hello',images:[null,{src:'/missing.png',alt:''}]},
    {id:'duplicate',type:'text',title:'Text',preview:'',body:'Complete',typo:true},
    {id:'video',type:'video',title:'Video',preview:'Video',videos:[{title:'Unsafe',embed:'https://example.com/embed/id'}]},
    {id:'links',type:'resources',title:'Links',preview:'Links',links:[{label:'Bad',href:'javascript:alert(1)'}]}];
  const errors=check(bad).errors.join('\n');
  for(const expected of ['example[0]','missing asset','alternative text','duplicate module','unknown field','unsupported embed','HTTP(S)'])assert.ok(errors.includes(expected),expected);
});
test('document ambiguity, unsupported fields and escaping paths are rejected',()=>{
  const errors=check([{id:'text',type:'text',title:'Text',preview:'Text',body:'Body',document:'not-registered.md',images:[]},
    {id:'image',type:'gallery',title:'Image',preview:'Image',images:[{src:'/../secret',alt:'Description'}]}]).errors.join('\n');
  for(const expected of ['choose body or document','not registered','does not belong','public URL'])assert.ok(errors.includes(expected));
});
test('partial video records are errors rather than silently empty drafts',()=>{
  assert.ok(check([{...moduleTemplate('video','videos'),videos:[{title:'Unfinished'}]}]).errors.some(e=>e.includes('exactly one')));
});

test('populated content requires a preview',()=>{assert.ok(check([{...moduleTemplate('text','intro'),body:'Actual content'}]).errors.some(e=>e.includes('needs a preview')));});

test('Babuni Gaming contains populated context and all three supplied profile links',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../src/content/project-modules.json',import.meta.url)));
 const modules=catalog['babuni-gaming'];assert.equal(modules.length,4);
 assert.deepEqual(modules.find(m=>m.id==='channels').links.map(l=>l.href),[
  'https://www.youtube.com/@babunigamingg',
  'https://www.curseforge.com/members/babunigaming/projects',
  'https://www.instagram.com/babunigaming/'
 ]);
 assert.match(modules.find(m=>m.id==='overview').body,/all kinds of games/);
 assert.match(modules.find(m=>m.id==='gaming-and-addons').body,/Azeroth Moments/);
 const videos=modules.find(m=>m.id==='videos');
 assert.equal(videos.type,'video');
 assert.equal(videos.videos[0].embed,'https://www.youtube-nocookie.com/embed/9fnC1ZI1iSY');
 assert.equal(videos.videos.length,2);
 assert.equal(videos.videos[1].embed,'https://www.youtube-nocookie.com/embed/B2pMsZPQfCc');
 assert.ok(videos.videos.every(video=>video.src===undefined));
 assert.match(videos.preview,/not the first recording/);
 assert.ok(modules.every(m=>m.credit.includes('Babuni.dev')));
});
