import { Worker } from 'worker_threads';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const main = async () => {
  const dataPath = path.join(process.cwd(), 'data.json');
  const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
  
  const numCores = os.cpus().length;
  const chunkSize = Math.ceil(data.length / numCores);
  const chunks = [];
  
  for (let i = 0; i < numCores; i++) {
    chunks.push(data.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const workerPath = path.join(__dirname, 'worker.js');
  
  const results = await Promise.all(
    chunks.map((chunk) => new Promise((resolve) => {
      const worker = new Worker(workerPath);
      worker.on('message', resolve);
      worker.postMessage(chunk);
    }))
  );

  const merged = [];
  const pointers = new Array(results.length).fill(0);
  
  while (merged.length < data.length) {
    let minVal = Infinity;
    let minIdx = -1;
    
    for (let i = 0; i < results.length; i++) {
      if (pointers[i] < results[i].length && results[i][pointers[i]] < minVal) {
        minVal = results[i][pointers[i]];
        minIdx = i;
      }
    }
    
    merged.push(minVal);
    pointers[minIdx]++;
  }

  console.log(merged);
};

await main();
