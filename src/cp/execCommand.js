import { spawn } from 'child_process';

const execCommand = () => {
  const command = process.argv[2];
  
  if (!command) {
    process.exit(1);
  }

  const [cmd, ...args] = command.split(' ');
  const child = spawn(cmd, args, {
    env: process.env,
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
};

execCommand();
