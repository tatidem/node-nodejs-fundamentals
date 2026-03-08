import readline from 'readline';

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  const startTime = Date.now();

  rl.prompt();

  rl.on('line', (line) => {
    const cmd = line.trim();
    
    switch (cmd) {
      case 'uptime':
        console.log(`Uptime: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
        break;
      case 'cwd':
        console.log(process.cwd());
        break;
      case 'date':
        console.log(new Date().toISOString());
        break;
      case 'exit':
        console.log('Goodbye!');
        process.exit(0);
      default:
        console.log('Unknown command');
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
};

interactive();
