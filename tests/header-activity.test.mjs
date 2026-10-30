import test from 'node:test';import assert from 'node:assert/strict';
import {headerActivity} from '../src/lib/header-activity.ts';
test('actual shifts and queued opening statuses get gold emphasis and a clear explanation',()=>{
 for(const axis of ['Rows','Columns']){const result=headerActivity(axis+' are shifting · Exploring Ethera · small bloom');assert.equal(result.shift,true);assert.match(result.text,/Opening waits until the shift finishes/);assert.match(result.text,/Exploring Ethera/);}
 assert.deepEqual(headerActivity('Waiting for shift to finish · Ethera'),{text:'Waiting for shift to finish · Ethera',shift:true});
});
test('ordinary activity and document titles cannot leave the shift glow active',()=>{
 for(const message of ['Living grid','Centering Ethera','Exploring Ethera · big bloom','Reading Ethera · Columns are shifting','Switching projects · Ethera'])assert.deepEqual(headerActivity(message),{text:message,shift:false});
});
