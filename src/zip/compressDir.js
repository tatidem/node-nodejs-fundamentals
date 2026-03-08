import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const compressDir = async () => {
  const toCompressPath = path.join(process.cwd(), 'workspace', 'toCompress');
  const compressedPath = path.join(process.cwd(), 'workspace', 'compressed');
  const archivePath = path.join(compressedPath, 'archive.br');

  try {
    await fs.access(toCompressPath);
  } catch {
    throw new Error('FS operation failed');
  }

  await fs.mkdir(compressedPath, { recursive: true });

  const files = [];
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(toCompressPath, fullPath);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        files.push({ path: relativePath, fullPath });
      }
    }
  };

  await walk(toCompressPath);

  const data = JSON.stringify(await Promise.all(
    files.map(async ({ path: p, fullPath }) => ({
      path: p.replace(/\\/g, '/'),
      content: (await fs.readFile(fullPath)).toString('base64')
    }))
  ));

  const readable = Readable.from([data]);
  const brotli = createBrotliCompress();
  const writable = createWriteStream(archivePath);

  await pipeline(readable, brotli, writable);
};

await compressDir();
