const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

function syncDirectory(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, {
    force: true,
    recursive: true,
  });
}

const standaloneServerPath = path.join(process.cwd(), '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServerPath)) {
  const standaloneRoot = path.dirname(standaloneServerPath);
  syncDirectory(path.join(process.cwd(), '.next', 'static'), path.join(standaloneRoot, '.next', 'static'));
  syncDirectory(path.join(process.cwd(), 'public'), path.join(standaloneRoot, 'public'));
  require(standaloneServerPath);
} else {
  const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', '3000'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
