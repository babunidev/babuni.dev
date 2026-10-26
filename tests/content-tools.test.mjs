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
