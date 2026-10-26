import test from 'node:test';
import assert from 'node:assert/strict';
import {demoProjects} from '../src/lib/demo-projects.ts';
import {projectTopics,topicForProject} from '../src/lib/project-topics.ts';

test('each provisional project has exactly one concise first-bubble topic',()=>{
  assert.equal(demoProjects.length,53);
  assert.equal(Object.keys(projectTopics).length,53);
  assert.equal(new Set(Object.keys(projectTopics)).size,53);
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
  assert.equal(topicForProject('morkahja-world-and-peoples'),'Worldbuilding');
  assert.equal(topicForProject('buxbrewding'),'WoW addon');
  assert.equal(topicForProject('not-in-inventory'),'Creative work');
});
