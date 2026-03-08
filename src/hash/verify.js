import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

const verify = async () => {
  const checksumsPath = path.join(process.cwd(), 'checksums.json');
  
  try {
    await fs.access(checksumsPath);
  } catch {
    throw new Error('FS operation failed');
  }

  const checksums = JSON.parse(await fs.readFile(checksumsPath, 'utf-8'));

  for (const [filename, expectedHash] of Object.entries(checksums)) {
    const hash = createHash('sha256');
    const stream = createReadStream(filename);
    
    for await (const chunk of stream) {
      hash.update(chunk);
    }
    
    const actualHash = hash.digest('hex');
    console.log(`${filename} — ${actualHash === expectedHash ? 'OK' : 'FAIL'}`);
  }
};

await verify();
