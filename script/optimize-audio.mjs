import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function boxes(buffer, start = 0, end = buffer.length) {
  const result = [];
  for (let offset = start; offset < end;) {
    if (offset + 8 > end) throw new Error('Truncated MP4 box');
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const header = size === 1 ? 16 : 8;
    if (size === 1) {
      if (offset + 16 > end) throw new Error('Truncated extended MP4 box');
      size = Number(buffer.readBigUInt64BE(offset + 8));
    }
    if (size === 0) size = end - offset;
    if (!Number.isSafeInteger(size) || size < header || offset + size > end) {
      throw new Error('Invalid MP4 box size');
    }
    result.push({ type, offset, size, header });
    offset += size;
  }
  return result;
}

// Relocate the index of ordinary, self-contained M4A files without decoding
// or recompressing audio. Unsupported containers are left untouched by the CLI.
export function fastStart(buffer) {
  const top = boxes(buffer);
  const moov = top.find((box) => box.type === 'moov');
  const firstData = top.find((box) => box.type === 'mdat');
  if (!moov || !firstData) throw new Error('Missing moov or mdat');
  if (moov.offset < firstData.offset) return buffer;
  if (top.some((box) => ['moof', 'sidx', 'mfra'].includes(box.type))) {
    throw new Error('Fragmented MP4 is not supported');
  }
  const index = Buffer.from(buffer.subarray(moov.offset, moov.offset + moov.size));
  const containers = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl']);
  let chunkCount = 0;
  function update(start, end) {
    for (const box of boxes(index, start, end)) {
      const body = box.offset + box.header;
      if (containers.has(box.type)) {
        update(body, box.offset + box.size);
      } else if (box.type === 'stco' || box.type === 'co64') {
        const width = box.type === 'stco' ? 4 : 8;
        if (body + 8 > box.offset + box.size) throw new Error('Truncated chunk table');
        const count = index.readUInt32BE(body + 4);
        if (body + 8 + count * width > box.offset + box.size) throw new Error('Invalid chunk table');
        for (let i = 0; i < count; i++) {
          const at = body + 8 + i * width;
          const old = width === 4 ? index.readUInt32BE(at) : Number(index.readBigUInt64BE(at));
          if (!Number.isSafeInteger(old) || !top.some((data) =>
            data.type === 'mdat' && old >= data.offset + data.header && old < data.offset + data.size
          )) throw new Error('Chunk points outside media data');
          const moved = old < moov.offset ? old + moov.size : old;
          if (width === 4) {
            if (moved > 0xffffffff) throw new Error('Chunk offset exceeds stco capacity');
            index.writeUInt32BE(moved, at);
          } else {
            index.writeBigUInt64BE(BigInt(moved), at);
          }
          chunkCount++;
        }
      }
    }
  }
  update(0, index.length);
  if (!chunkCount) throw new Error('No audio chunks found');
  return Buffer.concat([
    buffer.subarray(0, firstData.offset), index,
    buffer.subarray(firstData.offset, moov.offset),
    buffer.subarray(moov.offset + moov.size),
  ]);
}

async function optimizeDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await optimizeDirectory(file);
    else if (/\.m4a$/i.test(entry.name)) {
      const original = await readFile(file);
      let optimized;
      try {
        optimized = fastStart(original);
      } catch (error) {
        console.warn(`[audio] Keeping ${entry.name}: ${error.message}`);
        continue;
      }
      if (optimized !== original) {
        await writeFile(file, optimized);
        console.log(`[audio] Fast start: ${entry.name} (audio data unchanged)`);
      }
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await optimizeDirectory(fileURLToPath(new URL('../dist/audio/', import.meta.url)));
}
