import fs from 'fs/promises';
import path from 'path';

const snapshot = async () => {
  const workspacePath = path.join(process.cwd(), 'workspace');

  try {
    await fs.access(workspacePath);
  } catch {
    throw new Error('FS operation failed');
  }

  const entries = [];

  const walk = async (dir) => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
      const fullPath = path.join(dir, dirent.name);
      const relativePath = path.relative(workspacePath, fullPath).replace(/\\/g, '/');

      if (dirent.isDirectory()) {
        entries.push({ path: relativePath, type: 'directory' });
        await walk(fullPath);
      } else if (dirent.isFile()) {
        const stats = await fs.stat(fullPath);
        const content = await fs.readFile(fullPath);
        entries.push({
          path: relativePath,
          type: 'file',
          size: stats.size,
          content: content.toString('base64'),
        });
      }
    }
  };

  await walk(workspacePath);

  await fs.writeFile(
    path.join(process.cwd(), 'snapshot.json'),
    JSON.stringify({ rootPath: workspacePath, entries }, null, 2)
  );
};

await snapshot();