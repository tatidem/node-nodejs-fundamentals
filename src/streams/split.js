import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

const split = async () => {
  const linesArg = process.argv.indexOf('--lines');
  const maxLines = linesArg !== -1 ? parseInt(process.argv[linesArg + 1]) : 10;
  
  let lineCount = 0;
  let chunkNumber = 1;
  let buffer = '';
  let currentStream = createWriteStream(`chunk_${chunkNumber}.txt`);

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (lineCount >= maxLines) {
          currentStream.end();
          chunkNumber++;
          currentStream = createWriteStream(`chunk_${chunkNumber}.txt`);
          lineCount = 0;
        }
        currentStream.write(line + '\n');
        lineCount++;
      }
      callback();
    },
    flush(callback) {
      if (buffer) {
        currentStream.write(buffer + '\n');
      }
      currentStream.end();
      callback();
    }
  });

  await pipeline(createReadStream('source.txt'), transform);
};

await split();
