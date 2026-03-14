import fs from 'node:fs/promises';
import path from 'node:path';

import { allTranslations, languageNames } from '../lib/translations';

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const outDir = path.join(process.cwd(), 'messages');
  await ensureDir(outDir);

  for (const [locale, messages] of Object.entries(allTranslations)) {
    const filePath = path.join(outDir, `${locale}.json`);
    await fs.writeFile(filePath, `${JSON.stringify(messages, null, 2)}\n`, 'utf8');
  }

  await fs.writeFile(
    path.join(outDir, 'language-names.json'),
    `${JSON.stringify(languageNames, null, 2)}\n`,
    'utf8'
  );
}

main().catch((error) => {
  console.error('Failed to sync locale messages:', error);
  process.exitCode = 1;
});
