import fs from 'fs/promises';
import path from 'path';

const merge = async () => {
  const partsPath = path.join(process.cwd(), 'workspace', 'parts');
  const outputPath = path.join(process.cwd(), 'workspace', 'merged.txt');

  try {
    await fs.access(partsPath);
  } catch {
    throw new Error('FS operation failed');
  }

  const filesArg = process.argv.indexOf('--files');
  let filesToMerge;

  if (filesArg !== -1) {
    filesToMerge = process.argv[filesArg + 1].split(',');
    for (const file of filesToMerge) {
      try {
        await fs.access(path.join(partsPath, file));
      } catch {
        throw new Error('FS operation failed');
      }
    }
  } else {
    const dirents = await fs.readdir(partsPath);
    filesToMerge = dirents.filter(f => f.endsWith('.txt')).sort();
    if (filesToMerge.length === 0) {
      throw new Error('FS operation failed');
    }
  }

  const contents = await Promise.all(
    filesToMerge.map(f => fs.readFile(path.join(partsPath, f), 'utf-8'))
  );
  await fs.writeFile(outputPath, contents.join(''));
};

await merge();
