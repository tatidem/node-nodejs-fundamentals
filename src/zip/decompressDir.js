import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'zlib';
import path from 'path';
import { pipeline } from 'stream/promises';

const decompressDir = async () => {
  const compressedPath = path.join(process.cwd(), 'workspace', 'compressed');
  const archivePath = path.join(compressedPath, 'archive.br');
  const decompressedPath = path.join(process.cwd(), 'workspace', 'decompressed');

  try {
    await fs.access(compressedPath);
    await fs.access(archivePath);
  } catch {
    throw new Error('FS operation failed');
  }

  await fs.mkdir(decompressedPath, { recursive: true });

  const chunks = [];
  const readable = createReadStream(archivePath);
  const brotli = createBrotliDecompress();

  for await (const chunk of readable.pipe(brotli)) {
    chunks.push(chunk);
  }

  const data = JSON.parse(Buffer.concat(chunks).toString());

  for (const { path: p, content } of data) {
    const filePath = path.join(decompressedPath, p);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, Buffer.from(content, 'base64'));
  }
};

await decompressDir();
