import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSignup,SIGNUP_SANDBOX} from '../src/scripts/module-signup.ts';
import {renderModulePreview,stopPlayers} from '../src/scripts/module-preview.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
// Fictional fixture: any allowed eo.page address behaves the same.
const signup={id:'news',type:'signup',title:'News',preview:'Hear about new things.',signup:{src:'https://example-account.eo.page/join',title:'Example sign-up'}};
const press=root=>nodes(root,'button')[0].listeners.get('click')();
test('both blooms show sign-up modules as text with no frame or frame button',t=>{
 documentDOM(t);
 for(const depth of ['small','big']){
  const panel=renderModulePreview(signup,'Example',()=>{},depth);
  assert.equal(nodes(panel,'iframe').length,0,depth);
  assert.deepEqual(nodes(panel,'button').map(b=>b.textContent),['Read more'],depth);
  assert.ok(panel.textContent.includes(signup.title),depth);
 }
});
test('the reader frame appears only after the button press, sandboxed and focused',t=>{
 documentDOM(t);
 const root=renderSignup(signup);
 assert.equal(nodes(root,'iframe').length,0);assert.equal(nodes(root,'button').length,1);
 press(root);
 const frames=nodes(root,'iframe');assert.equal(frames.length,1);
 const [frame]=frames;
 assert.equal(frame.src,'https://example-account.eo.page/join');assert.equal(frame.title,'Example sign-up');
 assert.equal(frame.attributes.sandbox,SIGNUP_SANDBOX);
 for(const flag of ['allow-top-navigation','allow-popups','allow-modals'])assert.ok(!SIGNUP_SANDBOX.includes(flag),flag);
 assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');
 assert.equal(nodes(root,'button').length,0);
});
test('a sign-up address outside the allow-list creates no frame',t=>{
 documentDOM(t);
 for(const src of ['https://example.com/join','http://example-account.eo.page/join','https://example-account.eo.page/join?x=1'])
  assert.equal(renderSignup({...signup,signup:{...signup.signup,src}}),null,src);
 assert.equal(renderSignup({...signup,signup:{...signup.signup,title:' '}}),null);
});
test('stopping players leaves the sign-up frame in place and resets video players',t=>{
 documentDOM(t);
 const root=renderSignup(signup);press(root);
 const [form]=nodes(root,'iframe');
 const video=document.createElement('iframe');video.dataset.player='video';
 let removed=false;video.closest=()=>null;video.remove=()=>{removed=true;};
 root.append(video);
 root.querySelectorAll=tag=>nodes(root,tag);
 stopPlayers(root);
 assert.equal(removed,true);
 assert.ok(nodes(root,'iframe').includes(form));
});
