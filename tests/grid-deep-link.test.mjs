import test from 'node:test';import assert from 'node:assert/strict';
import {parseGridDeepLink,gridDeepLinkHash} from '../src/lib/grid-deep-link.ts';
test('a project hash with a reader module opens the big bloom and that module',()=>{
 assert.deepEqual(parseGridDeepLink('#project=example-game&bloom=big&read=changes'),{project:'example-game',bloom:'big',read:'changes'});
 assert.deepEqual(parseGridDeepLink('#project=example-game&read=changes'),{project:'example-game',bloom:'big',read:'changes'});
});
test('a project alone opens its small bloom; bloom=big alone opens the big bloom',()=>{
 assert.deepEqual(parseGridDeepLink('#project=example-game'),{project:'example-game',bloom:'small',read:null});
 assert.deepEqual(parseGridDeepLink('#project=example-game&bloom=big'),{project:'example-game',bloom:'big',read:null});
 assert.deepEqual(parseGridDeepLink('project=example-game&bloom=tiny'),{project:'example-game',bloom:'small',read:null});
});
test('unrelated or malformed hashes are ignored without an error',()=>{
 for(const hash of ['','#','#main','#read=changes','#project=','#project=../etc','#project=Example','#project=a%20b'])assert.equal(parseGridDeepLink(hash),null);
 assert.equal(parseGridDeepLink('#project=example-game&read=../x')?.read,null);
});
test('the hash builder round-trips through the parser',()=>{
 for(const link of [{project:'example-game',bloom:'big',read:'changes'},{project:'example-game',bloom:'small',read:null},{project:'example-game',bloom:'big',read:null}]){
  assert.deepEqual(parseGridDeepLink(gridDeepLinkHash(link)),link);
 }
 assert.equal(gridDeepLinkHash({project:'example-game',read:'changes'}),'#project=example-game&bloom=big&read=changes');
});
