import fs from 'fs/promises';
import path from 'path';

const findByExt = async () => {
  const workspacePath = path.join(process.cwd(), 'workspace');
  
  try {
    await fs.access(workspacePath);
  } catch {
    throw new Error('FS operation failed');
  }

  const extArg = process.argv.indexOf('--ext');
  const ext = extArg !== -1 ? process.argv[extArg + 1] : 'txt';
  const extension = ext.startsWith('.') ? ext : `.${ext}`;

  const files = [];

  const walk = async (dir) => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        await walk(fullPath);
      } else if (dirent.isFile() && path.extname(dirent.name) === extension) {
        files.push(path.relative(workspacePath, fullPath).replace(/\\/g, '/'));
      }
    }
  };

  await walk(workspacePath);
  files.sort().forEach(file => console.log(file));
};

await findByExt();
