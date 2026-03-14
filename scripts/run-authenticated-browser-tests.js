const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envContents = fs.readFileSync(envPath, 'utf8');
  for (const line of envContents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function buildIsolatedDbEnv() {
  loadLocalEnv();

  const isolatedDatabaseUrl = process.env.PLAYWRIGHT_E2E_DATABASE_URL;
  const isolatedDirectUrl =
    process.env.PLAYWRIGHT_E2E_DIRECT_URL ?? isolatedDatabaseUrl;

  if (!isolatedDatabaseUrl || !isolatedDirectUrl) {
    throw new Error(
      'PLAYWRIGHT_E2E_DATABASE_URL and PLAYWRIGHT_E2E_DIRECT_URL are required for authenticated browser tests.'
    );
  }

  return {
    ...process.env,
    DATABASE_URL: isolatedDatabaseUrl,
    DIRECT_URL: isolatedDirectUrl,
    PLAYWRIGHT_USE_ISOLATED_DB: '1',
    LEXINDIA_E2E: '1',
    HOSTNAME: '127.0.0.1',
    PORT: '3001',
    PLAYWRIGHT_PORT: '3001',
    NEXTAUTH_URL: 'http://127.0.0.1:3001',
  };
}

function runCommand(command, args, env) {
  const result =
    process.platform === 'win32'
      ? spawnSync('cmd', ['/c', command, ...args], {
          cwd: process.cwd(),
          env,
          stdio: 'inherit',
        })
      : spawnSync(command, args, {
          cwd: process.cwd(),
          env,
          stdio: 'inherit',
        });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requestUrl(url) {
  const target = new URL(url);
  const client = target.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.request(
      target,
      {
        method: 'GET',
        timeout: 5000,
      },
      (response) => {
        response.resume();
        resolve(response.statusCode ?? 0);
      }
    );

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy(new Error(`Timed out waiting for ${url}`));
    });
    request.end();
  });
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const statusCode = await requestUrl(url);
      if (statusCode >= 200 && statusCode < 500) {
        return;
      }
    } catch {
      // Wait for the process to finish booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopServer(serverProcess) {
  if (!serverProcess?.pid || serverProcess.killed) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(serverProcess.pid), '/T', '/F'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    return;
  }

  serverProcess.kill('SIGTERM');
}

async function main() {
  const env = buildIsolatedDbEnv();
  const baseURL = `http://127.0.0.1:${env.PORT}`;

  runCommand('npx', ['prisma', 'db', 'push', '--skip-generate'], env);

  const serverProcess = spawn(process.execPath, ['scripts/start-playwright.js'], {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
  });

  try {
    await waitForServer(baseURL, 120000);
    runCommand(
      'npx',
      ['playwright', 'test', 'tests/browser-authenticated.spec.ts'],
      {
        ...env,
        PLAYWRIGHT_BASE_URL: baseURL,
      }
    );
  } finally {
    stopServer(serverProcess);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
