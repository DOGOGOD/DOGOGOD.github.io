import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { getLqipGradient } from '../src/utils/getLqipColors.ts';

const directory = await mkdtemp(join(tmpdir(), 'blog-lqip-'));
const file = join(directory, 'image.png');
const original = sharp.prototype.toBuffer;
let decodes = 0;
sharp.prototype.toBuffer = function (...args) {
  decodes++;
  return original.apply(this, args);
};
try {
  await sharp({ create: { width: 100, height: 100, channels: 3, background: '#ff0000' } }).png().toFile(file);
  const first = await Promise.all(Array.from({ length: 12 }, () => getLqipGradient(file)));
  assert.equal(decodes, 1, 'concurrent requests share one decode');
  assert.ok(first.every(value => value === first[0]));
  assert.match(first[0], /rgb\(255, 0, 0\)/);
  await getLqipGradient(file);
  assert.equal(decodes, 1, 'unchanged image is cached');
  await sharp({ create: { width: 120, height: 120, channels: 3, background: '#0000ff' } }).png().toFile(file);
  assert.match(await getLqipGradient(file), /rgb\(0, 0, 255\)/);
  assert.equal(decodes, 2, 'replaced image invalidates the cache');
  await writeFile(file, 'temporarily incomplete image');
  const logError = console.error;
  console.error = () => {};
  try {
    assert.match(await getLqipGradient(file), /linear-gradient/);
    await getLqipGradient(file);
    assert.equal(decodes, 4, 'failed decodes are retried');
  } finally { console.error = logError; }
  console.log('LQIP cache: concurrent deduplication, cache reuse, replacement and failure retry passed.');
} finally {
  sharp.prototype.toBuffer = original;
  await rm(directory, { recursive: true, force: true });
}
