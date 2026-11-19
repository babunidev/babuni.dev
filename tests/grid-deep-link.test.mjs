import test from 'node:test';import assert from 'node:assert/strict';
import {parseGridDeepLink,gridDeepLinkHash} from '../src/lib/grid-deep-link.ts';
test('a project hash with a reader module opens the big bloom and that module',()=>{
 assert.deepEqual(parseGridDeepLink('#project=example-game&bloom=big&read=changes'),{project:'example-game',bloom:'big',read:'changes',doc:null});
 assert.deepEqual(parseGridDeepLink('#project=example-game&read=changes'),{project:'example-game',bloom:'big',read:'changes',doc:null});
});
test('a project alone opens its small bloom; bloom=big alone opens the big bloom',()=>{
 assert.deepEqual(parseGridDeepLink('#project=example-game'),{project:'example-game',bloom:'small',read:null,doc:null});
 assert.deepEqual(parseGridDeepLink('#project=example-game&bloom=big'),{project:'example-game',bloom:'big',read:null,doc:null});
 assert.deepEqual(parseGridDeepLink('project=example-game&bloom=tiny'),{project:'example-game',bloom:'small',read:null,doc:null});
});
test('unrelated or malformed hashes are ignored without an error',()=>{
 for(const hash of ['','#','#main','#read=changes','#project=','#project=../etc','#project=Example','#project=a%20b'])assert.equal(parseGridDeepLink(hash),null);
 assert.equal(parseGridDeepLink('#project=example-game&read=../x')?.read,null);
});
test('the hash builder round-trips through the parser',()=>{
 for(const link of [{project:'example-game',bloom:'big',read:'changes',doc:null},{project:'example-game',bloom:'small',read:null,doc:null},{project:'example-game',bloom:'big',read:null,doc:null}]){
  assert.deepEqual(parseGridDeepLink(gridDeepLinkHash(link)),link);
 }
 assert.equal(gridDeepLinkHash({project:'example-game',read:'changes',doc:null}),'#project=example-game&bloom=big&read=changes');
});
test('a big-bloom share link reopens that module through the homepage hash',async()=>{
 const {moduleShareUrl}=await import('../src/scripts/module-share.ts');
 const url=moduleShareUrl('example-game','changes',new URL('https://www.babuni.dev/?grid-profile#project=other'));
 assert.equal(url,'https://www.babuni.dev/#project=example-game&bloom=big&read=changes');
 assert.deepEqual(parseGridDeepLink(new URL(url).hash),{project:'example-game',bloom:'big',read:'changes',doc:null});
});
test('a folder document link opens one document of the folder reader',async()=>{
 const link=parseGridDeepLink('#project=example-story&bloom=big&read=folder-lore&doc=lore/HEARTH.md');
 assert.deepEqual(link,{project:'example-story',bloom:'big',read:'folder-lore',doc:'lore/HEARTH.md'});
 assert.equal(gridDeepLinkHash(link),'#project=example-story&bloom=big&read=folder-lore&doc=lore/HEARTH.md');
 assert.deepEqual(parseGridDeepLink(gridDeepLinkHash(link)),link);
 assert.equal(parseGridDeepLink('#project=example-story&read=folder-lore&doc=lore%2FHEARTH.md').doc,'lore/HEARTH.md');
 const {moduleShareUrl}=await import('../src/scripts/module-share.ts');
 assert.equal(moduleShareUrl('example-story','folder-lore',new URL('https://www.babuni.dev/'),'lore/HEARTH.md'),
  'https://www.babuni.dev/#project=example-story&bloom=big&read=folder-lore&doc=lore/HEARTH.md');
});
test('a document needs a reader module and a safe Markdown path',()=>{
 assert.equal(parseGridDeepLink('#project=example-story&doc=lore/HEARTH.md').doc,null);
 for(const doc of ['../secret.md','lore/../x.md','/etc/passwd','lore/HEARTH.txt','lore//x.md','lore/a b.md','javascript:alert(1)'])
  assert.equal(parseGridDeepLink('#project=example-story&read=folder-lore&doc='+encodeURIComponent(doc)).doc,null,doc);
});
