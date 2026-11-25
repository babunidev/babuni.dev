import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSignup,createSignupFrame,signupScale,SIGNUP_SANDBOX,SIGNUP_FIT_SIZE} from '../src/scripts/module-signup.ts';
import {renderModulePreview,stopPlayers} from '../src/scripts/module-preview.ts';
import {documentDOM,nodes} from './helpers/document-dom.mjs';
// Fictional fixture: any allowed eo.page address behaves the same.
const signup={id:'news',type:'signup',title:'News',preview:'Hear about new things.',signup:{src:'https://example-account.eo.page/join',title:'Example sign-up'}};
const assertFrame=frame=>{
 assert.equal(frame.src,'https://example-account.eo.page/join');assert.equal(frame.title,'Example sign-up');
 assert.equal(frame.attributes.sandbox,SIGNUP_SANDBOX);assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');
 for(const flag of ['allow-top-navigation','allow-popups','allow-modals'])assert.ok(!SIGNUP_SANDBOX.split(' ').some(f=>f.startsWith(flag)),flag);
};
test('the small bloom shows a sign-up module as text with Read more and no frame',t=>{
 documentDOM(t);
 const panel=renderModulePreview(signup,'Example',()=>{},'small');
 assert.equal(nodes(panel,'iframe').length,0);
 assert.deepEqual(nodes(panel,'button').map(b=>b.textContent),['Read more']);
 assert.ok(panel.textContent.includes(signup.title)&&panel.textContent.includes(signup.preview));
});
test('the big bloom card is only the form, with a hidden keyboard stop that enters it',t=>{
 documentDOM(t);
 let readerOpened=false;
 const panel=renderModulePreview(signup,'Example',()=>{readerOpened=true;},'big');
 const frames=nodes(panel,'iframe');assert.equal(frames.length,1);assertFrame(frames[0]);
 assert.ok(!panel.textContent.includes(signup.preview),'no preview text on the card');
 assert.equal(nodes(panel,'h2').length,0,'no title on the card');
 const buttons=nodes(panel,'button');assert.equal(buttons.length,1);
 assert.ok(buttons[0].className.includes('bloom-read-more'),'grid keyboard and deep links find the card');
 let focused=false;frames[0].focus=()=>{focused=true;};
 buttons[0].listeners.get('click')({stopPropagation(){}});
 assert.equal(focused,true);assert.equal(readerOpened,false);
 assert.equal(panel.listeners.has('click'),false,'a tap on the card does not open the reader');
});
test('the reader shows the form directly, without a button',t=>{
 documentDOM(t);
 const root=renderSignup(signup);
 assert.equal(nodes(root,'button').length,0);
 const frames=nodes(root,'iframe');assert.equal(frames.length,1);assertFrame(frames[0]);
});
test('a sign-up address outside the allow-list creates no frame',t=>{
 documentDOM(t);
 for(const src of ['https://example.com/join','http://example-account.eo.page/join','https://example-account.eo.page/join?x=1']){
  const module={...signup,signup:{...signup.signup,src}};
  assert.equal(renderSignup(module),null,src);assert.equal(createSignupFrame(module),null,src);
  assert.equal(nodes(renderModulePreview(module,'Example',()=>{},'big'),'iframe').length,0,src);
 }
 assert.equal(createSignupFrame({...signup,signup:{...signup.signup,title:' '}}),null);
});
test('the form is scaled down only when its box is smaller than the fit size',()=>{
 assert.equal(signupScale(SIGNUP_FIT_SIZE+100,SIGNUP_FIT_SIZE+20),1);
 assert.equal(signupScale(SIGNUP_FIT_SIZE/2,SIGNUP_FIT_SIZE),.5);
 assert.equal(signupScale(SIGNUP_FIT_SIZE,SIGNUP_FIT_SIZE/4),.25);
 assert.equal(signupScale(0,0),1);
});
test('stopping players leaves the sign-up frame in place and resets video players',t=>{
 documentDOM(t);
 const root=renderSignup(signup);
 const [form]=nodes(root,'iframe');
 const video=document.createElement('iframe');video.dataset.player='video';
 let removed=false;video.closest=()=>null;video.remove=()=>{removed=true;};
 root.append(video);
 root.querySelectorAll=tag=>nodes(root,tag);
 stopPlayers(root);
 assert.equal(removed,true);
 assert.ok(nodes(root,'iframe').includes(form));
});
