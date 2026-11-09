import test from 'node:test';
import assert from 'node:assert/strict';
import {githubApiFetcher} from '../scripts/pull-repository.mjs';

test('the GitHub token is sent to api.github.com only', async () => {
  const seen=[];
  const fetcher=githubApiFetcher('example-token',async(url,options)=>{seen.push([url,options.headers?.Authorization]);return {};});
  const headers={Accept:'application/vnd.github+json'};
  await fetcher('https://api.github.com/repos/example/fixture',{headers});
  await fetcher('https://raw.githubusercontent.com/example/fixture/abc/README.md',{headers});
  await fetcher('https://api.github.com.example.net/repos/example/fixture',{headers});
  assert.deepEqual(seen,[
    ['https://api.github.com/repos/example/fixture','Bearer example-token'],
    ['https://raw.githubusercontent.com/example/fixture/abc/README.md',undefined],
    ['https://api.github.com.example.net/repos/example/fixture',undefined],
  ]);
  assert.equal(headers.Authorization,undefined,'caller headers are not mutated');
});
