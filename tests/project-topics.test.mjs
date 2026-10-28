import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {projectTopics,topicForProject,TOPIC_POINTS,supplementalTopics,topicLabelsForProject,chooseAmbientPoint} from '../src/lib/project-topics.ts';

test('each provisional project has exactly one concise first-bubble topic',()=>{
  assert.equal(demoProjects.length,47);
  assert.equal(Object.keys(projectTopics).length,47);
  assert.equal(new Set(Object.keys(projectTopics)).size,47);
  for(const project of demoProjects){
    const topic=topicForProject(project.id);
    assert.equal(projectTopics[project.id],topic,project.name);
    assert.match(topic,/^[\p{L}\p{N} -]+$/u);
    assert.ok(topic.length<=24,project.name+': '+topic);
    assert.notEqual(topic,project.shortSummary);
  }
});
test('a bubble offers just a subject, not a description or release claim',()=>{
  assert.equal(topicForProject('babuni-dev'),'Interactive portfolio');
  assert.equal(topicForProject('button-game'),'Reaction game');
  assert.equal(topicForProject('morkahjaworld'),'Worldbuilding');
  assert.equal(topicForProject('buxbrewding'),'WoW addon');
  assert.equal(topicForProject('not-in-inventory'),'Creative work');
});

test('each of the 47 retained tiles has three short, distinct, evidence-grounded flavor snippets',()=>{
  assert.deepEqual(TOPIC_POINTS,['top','left','right']);
  assert.equal(Object.keys(supplementalTopics).length,demoProjects.length);
  for(const project of demoProjects){
    const topics=topicLabelsForProject(project.id);
    assert.deepEqual(Object.keys(topics),TOPIC_POINTS,project.name);
    assert.equal(topics.top,topicForProject(project.id),project.name);
    assert.equal(new Set(Object.values(topics)).size,3,project.name);
    for(const point of TOPIC_POINTS){
      assert.ok(topics[point].length>0&&topics[point].length<=24,
        project.name+' '+point+': '+topics[point]);
      assert.notEqual(topics[point],project.shortSummary);
    }
  }
});
test('three markers carry different kinds of tiny project information',()=>{
  assert.deepEqual(topicLabelsForProject('button-game'),{
    top:'Reaction game',left:'Android game',right:'Local multiplayer'
  });
  assert.deepEqual(topicLabelsForProject('anskar-grotzschnapf'),{
    top:'Generative art',left:'Poetry',right:'Digital prints'
  });
  assert.deepEqual(topicLabelsForProject('morkahjaworld'),{
    top:'Worldbuilding',left:'Elemental peoples',right:'Fantasy places'
  });
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
