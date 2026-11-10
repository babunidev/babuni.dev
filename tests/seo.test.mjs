import test from 'node:test';
import assert from 'node:assert/strict';
import {pageDescription,projectLastModified} from '../src/lib/seo.ts';

const fallback='Notes of Example Project: a fictional fixture used only in tests.';

test('descriptions skip headings, bylines and short fragments', () => {
  const doc='# Example notes\n\n**By:** Example Person  \n**Status:** fictional fixture metadata line.\n\nBy: Example Person\n\nUnreleased\n\nThis fictional paragraph is long enough to describe the page, with a [link](https://example.com) and *emphasis*.';
  assert.equal(pageDescription(doc,fallback),'This fictional paragraph is long enough to describe the page, with a link and emphasis.');
});

test('descriptions fall back when a document has no usable sentence', () => {
  assert.equal(pageDescription('# Title\n\nBy Example\n\nShort line.',fallback),fallback);
  assert.equal(pageDescription('',fallback),fallback);
});

test('long descriptions are shortened at a word boundary within the limit', () => {
  const text='word '.repeat(100);
  const result=pageDescription(text,fallback,160);
  assert.ok(result.length<=160);
  assert.ok(result.endsWith('…'));
  assert.ok(!/\s…$/.test(result));
});

test('last-modified dates come only from a connected repository with a valid date', () => {
  const connections={a:{status:'connected',repository:'example/a'},b:{status:'planned',repository:'example/b'},c:{status:'connected',repository:'example/c'}};
  const activity={'example/a':{committedAt:'2026-01-02T03:04:05Z'},'example/b':{committedAt:'2026-01-02T03:04:05Z'},'example/c':{committedAt:'not a date'}};
  assert.equal(projectLastModified('a',connections,activity),'2026-01-02');
  assert.equal(projectLastModified('b',connections,activity),undefined);
  assert.equal(projectLastModified('c',connections,activity),undefined);
  assert.equal(projectLastModified('missing',connections,activity),undefined);
});
