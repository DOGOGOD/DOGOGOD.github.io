import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { fastStart } from './optimize-audio.mjs';

function dataBoxes(buffer) {
  const data = [];
  for (let at = 0; at < buffer.length;) {
    const size = buffer.readUInt32BE(at);
    assert.ok(size >= 8);
    if (buffer.toString('ascii', at + 4, at + 8) === 'mdat') {
      data.push(buffer.subarray(at + 8, at + size));
    }
    at += size;
  }
  return data;
}

for (const file of (await readdir(new URL('../public/audio/', import.meta.url))).filter((name) => name.endsWith('.m4a'))) {
  test(`${file}: index first, all audio bytes preserved, idempotent`, async () => {
    const original = await readFile(new URL(`../public/audio/${file}`, import.meta.url));
    const optimized = fastStart(original);
    assert.equal(optimized.length, original.length);
    assert.ok(optimized.indexOf('moov') < optimized.indexOf('mdat'));
    assert.deepEqual(dataBoxes(optimized), dataBoxes(original));
    assert.deepEqual(fastStart(optimized), optimized);
    // Every sample's chunk pointer must still address exactly the same bytes.
    for (let at = original.indexOf('stco'); at !== -1; at = original.indexOf('stco', at + 4)) {
      const newAt = optimized.indexOf('stco');
      const count = original.readUInt32BE(at + 8);
      for (let i = 0; i < count; i++) {
        const oldOffset = original.readUInt32BE(at + 12 + i * 4);
        const newOffset = optimized.readUInt32BE(newAt + 12 + i * 4);
        assert.deepEqual(optimized.subarray(newOffset, newOffset + 32), original.subarray(oldOffset, oldOffset + 32));
      }
    }
  });
}

test('malformed input is rejected before any output is written', () => {
  assert.throws(() => fastStart(Buffer.from('broken')));
});
