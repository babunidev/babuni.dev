import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkWebp} from '../scripts/check-webp.mjs';
test('every published image is a WebP container',()=>{
 assert.deepEqual(checkWebp(new URL('../public',import.meta.url)),[]);
});
test('publication guard catches old formats and renamed fake WebP files recursively',t=>{
 const root=mkdtempSync(join(tmpdir(),'webp-assets-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'nested'));writeFileSync(join(root,'nested','capture.png'),'png');
 writeFileSync(join(root,'fake.webp'),'not a WebP image');writeFileSync(join(root,'movie.mp4'),'video fixture');
 const errors=checkWebp(root);
 assert.equal(errors.length,2);assert.ok(errors.some(e=>e.includes('capture.png')));assert.ok(errors.some(e=>e.includes('invalid WebP signature')));
});
