import test from 'node:test';import assert from 'node:assert/strict';
import {headerActivity} from '../src/lib/header-activity.ts';
test('ordinary row and column shifts retain their status without inventing an opening wait',()=>{
 for(const axis of ['Rows','Columns'])for(const suffix of ['', ' · Exploring Ethera · small bloom']){
  const message=axis+' are shifting'+suffix;
  assert.deepEqual(headerActivity(message),{text:message,shift:true});
  assert.doesNotMatch(headerActivity(message).text,/Opening waits|Waiting for/);
 }
});
test('real queued transition waits retain their text and gold emphasis',()=>{
 for(const message of ['Waiting for shift to finish','Waiting for shift to finish · Ethera'])assert.deepEqual(headerActivity(message),{text:message,shift:true});
});
test('ordinary activity and document titles cannot leave the shift glow active',()=>{
 for(const message of ['Living grid','Centering Ethera','Exploring Ethera · big bloom','Reading Ethera · Columns are shifting','Switching projects · Ethera','Opening Ethera · small bloom','Closing Ethera bloom'])assert.deepEqual(headerActivity(message),{text:message,shift:false});
});
