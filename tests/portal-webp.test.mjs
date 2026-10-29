import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {PORTAL_WEBP_ASSETS,normalizePortalFilename,importPortalArtwork} from '../scripts/import-portal-artwork.mjs';

test('all supplied portal artworks are mapped to direct WebP paths',()=>{
  assert.equal(PORTAL_WEBP_ASSETS.length,32);
  assert.equal(new Set(PORTAL_WEBP_ASSETS.map(x=>x.filename)).size,32);
  const items=demoProjects.filter(x=>x.portalArtwork);
  assert.equal(items.length,32);
  for(const project of items){
    assert.match(project.portalArtwork,/^\/portal-content\/[A-Za-z0-9]+\.webp$/);
    assert.ok(existsSync(new URL('../public'+project.portalArtwork,import.meta.url)),project.id);
  }
  for(const [id,name] of [['elixior','Elexior.webp'],['mighty-morkah','MightyMorkah.webp'],['amazin','Amazin.webp'],['buxbrewding','BuxbrewDing.webp'],['meleestartattack','MeleeStartAttack.webp'],['roarguild','RoarGuildAddon.webp'],['buxbrew','BuxbrewAddon.webp'],['buxbrewcharge','BuxbrewCharge.webp'],['enchantvisuals','EnchantVisuals.webp'],['babuni-gaming','BabuniGaming.webp'],['totemtimers','TotemTimers.webp'],['morkahja-rpg','Morkahja.webp'],['buxbrew-character-story','BuxbrewCharacter.webp'],['arcanitebrothers','ArcaniteBrothers.webp'],['battlereport','BattleReport.webp'],['ethera-the-stonewrought','Ethera.webp'],['roar-guild-and-community','ROARGuild.webp'],['warriorstartattack','WarriorStartAttack.webp'],['roarr','ROARR.webp'],['the-great-iceflow-relay','TheGreatIceflowRelay.webp'],['workthatgodbod','WorkThatGodBod.webp']])
    assert.equal(demoProjects.find(p=>p.id===id).portalArtwork,'/portal-content/'+name);
  assert.equal(demoProjects.find(x=>x.id==='buxbrewresist').portalArtwork,
    '/portal-content/BuxbrewResist.webp');
});
test('file manager names with spaces and capitals map to stable filenames',()=>{
  assert.equal(normalizePortalFilename('Anskar Grotzschnapf.webp'),'anskargrotzschnapf');
  assert.equal(normalizePortalFilename('PortalContent BabuniDev.webp'),'portalcontentbabunidev');
  assert.equal(normalizePortalFilename('Local AAIWorkstation.webp'),'localaaiworkstation');
  assert.equal(normalizePortalFilename('BuxbrewResist.webp'),'buxbrewresist');
});
test('WebP import preserves original bytes and creates all mapped paths',()=>{
  const tmp=mkdtempSync(join(tmpdir(),'babuni-webp-test-'));
  try{
    const src=join(tmp,'source'),dest=join(tmp,'public','portal-content');
    mkdirSync(src,{recursive:true});
    const bytes=Buffer.concat([Buffer.from('RIFF'),Buffer.alloc(4),Buffer.from('WEBP'),Buffer.from('VP8 ')]);
    for(const asset of PORTAL_WEBP_ASSETS){
      const sourceName=asset.filename==='AnskarGrotzschnapf.webp'
        ?'Anskar Grotzschnapf.webp'
        :asset.filename==='PortalContentBabuniDev.webp'
        ?'PortalContent BabuniDev.webp'
        :asset.filename;
      writeFileSync(join(src,sourceName),bytes);
    }
    const imported=importPortalArtwork(src,{destination:dest});
    assert.equal(imported.length,32);
    for(const asset of PORTAL_WEBP_ASSETS)
      assert.deepEqual(readFileSync(join(dest,asset.filename)),bytes);
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
test('missing WebPs fail before copying, protecting previous artwork',()=>{
  const tmp=mkdtempSync(join(tmpdir(),'babuni-webp-missing-'));
  try{
    assert.throws(()=>importPortalArtwork(tmp,{destination:join(tmp,'out')}),/Missing 32 WebP/);
    assert.equal(existsSync(join(tmp,'out')),false);
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
test('renderer uses the direct image path without a PNG fallback',()=>{
  const source=readFileSync(new URL('../src/scripts/grid.ts',import.meta.url),'utf8');
  assert.match(source,/image\.src=project\.portalArtwork!/);
  assert.doesNotMatch(source,/portalArtworkWebp/);
});

test('community and addon have distinct supplied guild artworks',()=>{
 assert.equal(demoProjects.find(p=>p.id==='roar-guild-and-community').portalArtwork,'/portal-content/ROARGuild.webp');
 assert.equal(PORTAL_WEBP_ASSETS.filter(p=>p.filename==='ROARGuild.webp').length,1);
 assert.equal(demoProjects.find(p=>p.id==='roarguild').portalArtwork,'/portal-content/RoarGuildAddon.webp');
});
