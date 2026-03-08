import fs from 'fs/promises';
import path from 'path';

const restore = async () => {
  const snapshotPath = path.join(process.cwd(), 'snapshot.json');
  const restorePath = path.join(process.cwd(), 'workspace_restored');

  try {
    await fs.access(snapshotPath);
  } catch {
    throw new Error('FS operation failed');
  }

  try {
    await fs.access(restorePath);
    throw new Error('FS operation failed');
  } catch (err) {
    if (err.message === 'FS operation failed') throw err;
  }

  const snapshot = JSON.parse(await fs.readFile(snapshotPath, 'utf-8'));

  for (const entry of snapshot.entries) {
    const targetPath = path.join(restorePath, entry.path);
    if (entry.type === 'directory') {
      await fs.mkdir(targetPath, { recursive: true });
    } else {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, Buffer.from(entry.content, 'base64'));
    }
  }
};

await restore();
