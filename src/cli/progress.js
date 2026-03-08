const progress = () => {
  const durationArg = process.argv.indexOf('--duration');
  const intervalArg = process.argv.indexOf('--interval');
  const lengthArg = process.argv.indexOf('--length');
  const colorArg = process.argv.indexOf('--color');

  const duration = durationArg !== -1 ? parseInt(process.argv[durationArg + 1]) : 5000;
  const interval = intervalArg !== -1 ? parseInt(process.argv[intervalArg + 1]) : 100;
  const length = lengthArg !== -1 ? parseInt(process.argv[lengthArg + 1]) : 30;
  const colorHex = colorArg !== -1 ? process.argv[colorArg + 1] : null;

  let colorCode = '';
  if (colorHex && /^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);
    colorCode = `\x1b[38;2;${r};${g};${b}m`;
  }

  let elapsed = 0;
  const timer = setInterval(() => {
    elapsed += interval;
    const percent = Math.min(100, Math.round((elapsed / duration) * 100));
    const filled = Math.round((percent / 100) * length);
    const empty = length - filled;
    const bar = colorCode + '█'.repeat(filled) + (colorCode ? '\x1b[0m' : '') + ' '.repeat(empty);
    
    process.stdout.write(`\r[${bar}] ${percent}%`);

    if (elapsed >= duration) {
      clearInterval(timer);
      console.log('\nDone!');
    }
  }, interval);
};

progress();
