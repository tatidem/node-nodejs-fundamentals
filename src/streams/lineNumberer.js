import { Transform } from 'stream';

const lineNumberer = () => {
  let lineNumber = 0;
  let buffer = '';

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        lineNumber++;
        this.push(`${lineNumber} | ${line}\n`);
      }
      callback();
    },
    flush(callback) {
      if (buffer) {
        lineNumber++;
        this.push(`${lineNumber} | ${buffer}\n`);
      }
      callback();
    }
  });

  process.stdin.pipe(transform).pipe(process.stdout);
};

lineNumberer();
