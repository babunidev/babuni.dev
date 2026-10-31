import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {projectKeywordPools,WOW_ADDON_IDS,TOPIC_POINTS,topicLabelsForProject,chooseAmbientPoint} from '../src/lib/project-topics.ts';

function seeded(seed){seed=Math.imul(seed,2654435761)>>>0;return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};}
test('every project has nine distinct concise keywords',()=>{
  assert.deepEqual(Object.keys(projectKeywordPools).sort(),demoProjects.map(p=>p.id).sort());
  for(const project of demoProjects){
    const pool=projectKeywordPools[project.id];
    assert.equal(pool.length,9,project.name);
    assert.equal(new Set(pool).size,9,project.name);
    for(const label of pool)assert.ok(label.length>0&&label.length<=26,project.name+': '+label);
  }
});
test('reveals sample three distinct pool members and can reach all nine',()=>{
  for(const project of demoProjects){
    const seen=new Set(),combinations=new Set();
    for(let seed=1;seed<=200;seed++){
      const labels=topicLabelsForProject(project.id,seeded(seed));
      assert.deepEqual(Object.keys(labels),TOPIC_POINTS);
      const values=Object.values(labels);
      assert.equal(new Set(values).size,3,project.name);
      for(const value of values){assert.ok(projectKeywordPools[project.id].includes(value));seen.add(value);}
      combinations.add(values.join('|'));
    }
    assert.equal(seen.size,9,project.name);
    assert.ok(combinations.size>10,project.name);
  }
});
test('every add-on reveal includes exactly one explicit type cue in varying positions',()=>{
  for(const id of WOW_ADDON_IDS){
    assert.ok(demoProjects.some(p=>p.id===id),id);
    const positions=new Set();
    for(let seed=1;seed<=100;seed++){
      const labels=topicLabelsForProject(id,seeded(seed));
      assert.equal(Object.values(labels).filter(v=>v==='World of Warcraft add-on').length,1,id);
      positions.add(TOPIC_POINTS.find(p=>labels[p]==='World of Warcraft add-on'));
      assert.equal(Object.values(labels).filter(v=>/add.?on/i.test(v)).length,1,id);
    }
    assert.equal(positions.size,3,id);
  }
  for(const id of ['azeroth-moments','roar-guild-and-community','buxbrew-character-story','the-great-iceflow-relay','enchantvisuals','babuni-gaming'])assert.ok(!WOW_ADDON_IDS.includes(id));
});
test('unknown projects retain a safe distinct fallback',()=>{
  assert.equal(new Set(Object.values(topicLabelsForProject('unknown',seeded(1)))).size,3);
});

test('ambient marker choice cycles without repeating the previous point',()=>{
  for(const previous of TOPIC_POINTS){
    for(const fraction of [0,.25,.5,.75,1]){
      const point=chooseAmbientPoint(previous,fraction);
      assert.ok(TOPIC_POINTS.includes(point));
      assert.notEqual(point,previous);
    }
  }
  assert.equal(chooseAmbientPoint(null,0),'top');
  assert.equal(chooseAmbientPoint(null,.5),'left');
  assert.equal(chooseAmbientPoint(null,.99),'right');
});

test('portal reveal shuffles all three points and staggers each exactly once',async()=>{
  const {topicRevealPlan}=await import('../src/lib/project-topics.ts');
  const orders=new Set();
  for(const first of [.05,.45,.95])for(const second of [.05,.95]){
    const values=[first,second,.2,.8];
    const plan=topicRevealPlan(()=>values.shift()??.5);
    assert.deepEqual(plan.map(r=>r.point).sort(),['left','right','top']);
    assert.equal(plan[0].delay,0);
    for(let i=1;i<3;i++)assert.ok(plan[i].delay-plan[i-1].delay>=260&&plan[i].delay-plan[i-1].delay<=420);
    orders.add(plan.map(r=>r.point).join(','));
  }
  assert.equal(orders.size,6);
});
