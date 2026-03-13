import fs from 'node:fs';
import path from 'node:path';

import allowlist from '@/config/compliance-allowlist.json';
import baseline from '@/config/compliance-baseline.json';
import { getKnowledgeContent } from '@/lib/content/knowledge';
import {
  SEEDED_FAQ_CATEGORIES,
  SEEDED_LANGUAGES,
  SEEDED_SPECIALIZATIONS,
  SEEDED_TEMPLATES,
} from '@/lib/content/seed-data';
import { getTemplatesContent } from '@/lib/content/templates';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config';
import { allTranslations } from '@/lib/i18n/messages';

type Violation = {
  file: string;
  line: number;
  kind: string;
  excerpt: string;
};

type CountMap = Record<string, number>;

const ROOT = process.cwd();
const mode = process.argv[2] ?? 'all';
const TARGET_DIRS = ['app', 'components'];
const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const JSX_EXTENSIONS = new Set(['.tsx', '.jsx']);
const THEME_REGEX =
  /\b(?:bg|text|border|from|via|to|ring|stroke|fill)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-[0-9]{2,3})?\b|#[0-9A-Fa-f]{3,8}\b/g;
const JSX_TEXT_REGEX = />\s*([^<>{\n][^<>{}]*)\s*</g;
const JSX_ATTR_REGEX = /\b(?:placeholder|title|aria-label|download)=["']([^"'{}][^"']*)["']/g;
const COPY_BLOCK_REGEX =
  /const\s+([A-Za-z0-9_]*(?:copy|Copy|LABELS|Labels|TEXT|Text))\s*=\s*\{([\s\S]*?)\n\s*\}(?:\s+as const)?\s*;/g;
const COPY_STRING_REGEX = /:\s*['"]([^'"`\n][^'"`\n]{2,})['"]/g;
const PLACEHOLDER_REGEX = /\{[a-zA-Z0-9_]+\}/g;

function normalizePath(file: string) {
  return file.split(path.sep).join('/');
}

function readText(file: string) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function walk(dir: string): string[] {
  const absolute = path.join(ROOT, dir);
  if (!fs.existsSync(absolute)) return [];

  const results: string[] = [];

  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relative = normalizePath(path.join(dir, entry.name));
    if (entry.isDirectory()) {
      results.push(...walk(relative));
      continue;
    }

    if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(relative);
    }
  }

  return results;
}

function getLineNumber(source: string, index: number) {
  return source.slice(0, index).split('\n').length;
}

function countByFile(violations: Violation[]): CountMap {
  return violations.reduce<CountMap>((counts, violation) => {
    counts[violation.file] = (counts[violation.file] ?? 0) + 1;
    return counts;
  }, {});
}

function compareAgainstBaseline(label: string, actual: CountMap, expected: CountMap) {
  const failures: string[] = [];

  for (const [file, count] of Object.entries(actual)) {
    if (count > (expected[file] ?? 0)) {
      failures.push(`${label}: ${file} increased from ${expected[file] ?? 0} to ${count}`);
    }
  }

  return failures;
}

function flattenMessages(input: unknown, prefix = ''): Record<string, string> {
  if (typeof input === 'string') {
    return { [prefix]: input };
  }

  if (!input || typeof input !== 'object') {
    return {};
  }

  return Object.entries(input).reduce<Record<string, string>>((result, [key, value]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    Object.assign(result, flattenMessages(value, nextPrefix));
    return result;
  }, {});
}

function extractPlaceholders(value: string) {
  return [...new Set(value.match(PLACEHOLDER_REGEX) ?? [])].sort();
}

function shouldIgnoreLiteral(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!/[A-Za-z]/.test(normalized)) return true;
  if (normalized.length < 3) return true;
  if (/^(https?:|mailto:|\/)/.test(normalized)) return true;
  if (/(useState|const |=>|function |\{|\}|;|=)/.test(normalized)) return true;
  if (allowlist.i18n.literalIgnore.includes(normalized)) return true;
  return false;
}

function shouldIgnoreTheme(file: string, excerpt: string) {
  if (allowlist.theme.ignoreFiles.includes(file)) return true;
  return allowlist.theme.ignorePatterns.some((pattern) => excerpt.includes(pattern));
}

function scanThemeViolations() {
  const violations: Violation[] = [];

  for (const file of TARGET_DIRS.flatMap((dir) => walk(dir))) {
    const source = readText(file);
    const matches = source.matchAll(THEME_REGEX);

    for (const match of matches) {
      const excerpt = match[0];
      if (!excerpt || shouldIgnoreTheme(file, excerpt)) continue;

      violations.push({
        file,
        line: getLineNumber(source, match.index ?? 0),
        kind: 'theme',
        excerpt,
      });
    }
  }

  return violations;
}

function scanLiteralViolations() {
  const violations: Violation[] = [];

  for (const file of TARGET_DIRS.flatMap((dir) => walk(dir))) {
    if (!JSX_EXTENSIONS.has(path.extname(file))) continue;

    const source = readText(file);

    for (const regex of [JSX_TEXT_REGEX, JSX_ATTR_REGEX]) {
      for (const match of source.matchAll(regex)) {
        const raw = match[1]?.replace(/\s+/g, ' ').trim();
        if (!raw || shouldIgnoreLiteral(raw)) continue;

        violations.push({
          file,
          line: getLineNumber(source, match.index ?? 0),
          kind: 'i18n-literal',
          excerpt: raw,
        });
      }
    }
  }

  return violations;
}

function scanCopyConstantViolations() {
  const violations: Violation[] = [];

  for (const file of TARGET_DIRS.flatMap((dir) => walk(dir))) {
    const source = readText(file);

    for (const block of source.matchAll(COPY_BLOCK_REGEX)) {
      const blockSource = block[2] ?? '';
      const blockOffset = block.index ?? 0;

      for (const match of blockSource.matchAll(COPY_STRING_REGEX)) {
        const raw = match[1]?.replace(/\s+/g, ' ').trim();
        if (!raw || shouldIgnoreLiteral(raw)) continue;

        violations.push({
          file,
          line: getLineNumber(source, blockOffset + (match.index ?? 0)),
          kind: 'copy-constant',
          excerpt: raw,
        });
      }
    }
  }

  return violations;
}

function scanRouteFallbackViolations() {
  const violations: Violation[] = [];
  const routeFallbackAllowlist = allowlist.i18n.routeFallbackAllowlist as string[];
  const routeFiles = walk('app').filter(
    (file) =>
      file.endsWith('/page.tsx') ||
      file.endsWith('/page.jsx') ||
      file === 'app/page.tsx' ||
      file === 'app/page.jsx'
  );

  for (const file of routeFiles) {
    if (routeFallbackAllowlist.includes(file)) continue;
    const source = readText(file);

    if (!source.includes('RouteLocaleFallback')) continue;

    violations.push({
      file,
      line: getLineNumber(source, source.indexOf('RouteLocaleFallback')),
      kind: 'route-fallback',
      excerpt: 'RouteLocaleFallback',
    });
  }

  return violations;
}

function validateCatalogs() {
  const issues: string[] = [];
  const sameAsEnglish: Violation[] = [];
  const english = flattenMessages(allTranslations.en);

  for (const locale of SUPPORTED_LOCALES.filter((value) => value !== 'en')) {
    const localeMessages = flattenMessages(allTranslations[locale]);

    for (const key of Object.keys(english)) {
      if (!(key in localeMessages)) {
        issues.push(`messages/${locale}.json is missing key ${key}`);
        continue;
      }

      const value = localeMessages[key];
      if (!value.trim()) {
        issues.push(`messages/${locale}.json has an empty value for ${key}`);
      }

      const expectedPlaceholders = extractPlaceholders(english[key]);
      const actualPlaceholders = extractPlaceholders(value);
      if (expectedPlaceholders.join('|') !== actualPlaceholders.join('|')) {
        issues.push(`messages/${locale}.json placeholder mismatch for ${key}`);
      }

      if (
        value === english[key] &&
        value.length >= 4 &&
        !allowlist.i18n.sameAsEnglish.includes(key)
      ) {
        sameAsEnglish.push({
          file: `messages/${locale}.json`,
          line: 1,
          kind: 'same-as-english',
          excerpt: key,
        });
      }
    }

    for (const key of Object.keys(localeMessages)) {
      if (!(key in english)) {
        issues.push(`messages/${locale}.json contains unexpected key ${key}`);
      }
    }
  }

  return { issues, sameAsEnglish };
}

function validateContentRegistry() {
  const issues: string[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    const knowledgeContent = getKnowledgeContent(locale);
    const templatesContent = getTemplatesContent(locale);

    if (!knowledgeContent.freeAid.title || !knowledgeContent.cta.title) {
      issues.push(`knowledge content is incomplete for locale ${locale}`);
    }

    if (!templatesContent.categories.length || !templatesContent.upsell.title) {
      issues.push(`templates content is incomplete for locale ${locale}`);
    }
  }

  for (const language of SEEDED_LANGUAGES) {
    for (const locale of SUPPORTED_LOCALES) {
      if (!language.translations[locale]) {
        issues.push(`seeded language "${language.name}" is missing ${locale}`);
      }
    }
  }

  for (const specialization of SEEDED_SPECIALIZATIONS) {
    for (const locale of SUPPORTED_LOCALES) {
      if (!specialization.translations.name[locale] || !specialization.translations.description[locale]) {
        issues.push(`seeded specialization "${specialization.name}" is missing ${locale}`);
      }
    }
  }

  for (const category of SEEDED_FAQ_CATEGORIES) {
    for (const locale of SUPPORTED_LOCALES) {
      if (!category.translations.name[locale] || !category.translations.description[locale]) {
        issues.push(`seeded FAQ category "${category.name}" is missing ${locale}`);
      }
    }

    for (const faq of category.faqs) {
      for (const locale of SUPPORTED_LOCALES) {
        if (!faq.translations.question[locale] || !faq.translations.answer[locale]) {
          issues.push(`seeded FAQ "${faq.question}" is missing ${locale}`);
        }
      }
    }
  }

  for (const template of SEEDED_TEMPLATES) {
    for (const locale of SUPPORTED_LOCALES) {
      if (
        !template.translations.title[locale] ||
        !template.translations.description[locale] ||
        !template.translations.category[locale] ||
        !template.translations.content[locale]
      ) {
        issues.push(`seeded template "${template.title}" is missing ${locale}`);
      }
    }
  }

  return issues;
}

function topOffenders(counts: CountMap, limit = 15) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function writeAuditReport(data: {
  themeViolations: Violation[];
  literalViolations: Violation[];
  copyConstantViolations: Violation[];
  routeFallbackViolations: Violation[];
  catalogIssues: string[];
  sameAsEnglish: Violation[];
  contentIssues: string[];
}) {
  const docsDir = path.join(ROOT, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  const themeCounts = countByFile(data.themeViolations);
  const literalCounts = countByFile(data.literalViolations);
  const copyCounts = countByFile(data.copyConstantViolations);
  const identicalCounts = countByFile(data.sameAsEnglish);

  const report = `# Theme and Multilingual Compliance Audit

Generated on ${new Date().toISOString()}

## Summary

- Theme scan violations: ${data.themeViolations.length}
- Hardcoded JSX copy findings: ${data.literalViolations.length}
- Hardcoded copy-constant findings: ${data.copyConstantViolations.length}
- Disallowed locale fallback routes: ${data.routeFallbackViolations.length}
- Catalog validation issues: ${data.catalogIssues.length}
- Same-as-English catalog findings: ${data.sameAsEnglish.length}
- Content registry issues: ${data.contentIssues.length}

## Theme Gaps

${topOffenders(themeCounts)
  .map(([file, count]) => `- ${file}: ${count} raw theme violations`)
  .join('\n') || '- None'}

Root causes:
- Direct use of palette utilities such as \`bg-blue-50\`, \`text-gray-600\`, and hex colors.
- Shared components bypassing semantic tokens and theme primitives.
- Page-level CTA and card implementations re-declaring surface and accent colors instead of inheriting them.

## Multilingual Gaps

JSX literal issues:
${topOffenders(literalCounts)
  .map(([file, count]) => `- ${file}: ${count} hardcoded JSX strings`)
  .join('\n') || '- None'}

Copy-constant issues:
${topOffenders(copyCounts)
  .map(([file, count]) => `- ${file}: ${count} hardcoded copy-object strings`)
  .join('\n') || '- None'}

Disallowed locale fallbacks:
${data.routeFallbackViolations.map((violation) => `- ${violation.file}`).join('\n') || '- None'}

Catalog issues:
${data.catalogIssues.map((issue) => `- ${issue}`).join('\n') || '- None'}

Same-as-English findings:
${topOffenders(identicalCounts)
  .map(([file, count]) => `- ${file}: ${count} identical-to-English values`)
  .join('\n') || '- None'}

Root causes:
- Route components still embed English copy directly in JSX.
- Route and component files still embed English strings inside local copy objects/constants.
- Some public routes still rely on RouteLocaleFallback instead of real localized implementations.
- Translation catalogs are incomplete for some marketing and dashboard copy paths.
- Seeded DB content currently falls back to English variants for non-English locales until curated translations are supplied.

## Detection and Enforcement

- Locale routing is enforced via middleware redirects to locale-prefixed URLs.
- Theme preference is persisted in cookies and injected before hydration.
- Compliance scripts now scan theme classes, catalog parity, placeholder integrity, content registries, and JSX literals.
- CI should fail when violations exceed the recorded baseline or when catalog/content validation returns hard errors.
`;

  fs.writeFileSync(path.join(docsDir, 'theme-i18n-audit.md'), report, 'utf8');
}

function writeBaseline(
  themeViolations: Violation[],
  literalViolations: Violation[],
  copyConstantViolations: Violation[],
  sameAsEnglish: Violation[]
) {
  const nextBaseline = {
    theme: countByFile(themeViolations),
    i18nLiterals: countByFile(literalViolations),
    copyConstants: countByFile(copyConstantViolations),
    sameAsEnglish: countByFile(sameAsEnglish),
  };

  fs.writeFileSync(
    path.join(ROOT, 'config', 'compliance-baseline.json'),
    `${JSON.stringify(nextBaseline, null, 2)}\n`,
    'utf8'
  );
}

function printViolations(title: string, violations: Violation[], limit = 20) {
  if (!violations.length) return;

  console.log(`\n${title}`);
  for (const violation of violations.slice(0, limit)) {
    console.log(`- ${violation.file}:${violation.line} ${violation.excerpt}`);
  }
}

function main() {
  const themeViolations = scanThemeViolations();
  const literalViolations = scanLiteralViolations();
  const copyConstantViolations = scanCopyConstantViolations();
  const routeFallbackViolations = scanRouteFallbackViolations();
  const { issues: catalogIssues, sameAsEnglish } = validateCatalogs();
  const contentIssues = validateContentRegistry();

  if (mode === 'audit') {
    writeAuditReport({
      themeViolations,
      literalViolations,
      copyConstantViolations,
      routeFallbackViolations,
      catalogIssues,
      sameAsEnglish,
      contentIssues,
    });
    return;
  }

  if (mode === 'baseline') {
    writeBaseline(themeViolations, literalViolations, copyConstantViolations, sameAsEnglish);
    return;
  }

  const failures: string[] = [];

  if (mode === 'theme' || mode === 'all') {
    failures.push(...compareAgainstBaseline('theme', countByFile(themeViolations), baseline.theme));
  }

  if (mode === 'i18n' || mode === 'all') {
    failures.push(...compareAgainstBaseline('i18n-literals', countByFile(literalViolations), baseline.i18nLiterals));
    const copyConstantBaseline = (baseline as typeof baseline & { copyConstants?: CountMap }).copyConstants ?? {};
    failures.push(
      ...compareAgainstBaseline('copy-constants', countByFile(copyConstantViolations), copyConstantBaseline)
    );
    failures.push(...compareAgainstBaseline('same-as-english', countByFile(sameAsEnglish), baseline.sameAsEnglish));
    failures.push(
      ...routeFallbackViolations.map(
        (violation) => `route-fallback: ${violation.file} uses RouteLocaleFallback without allowlisting`
      )
    );
  }

  failures.push(...catalogIssues, ...contentIssues);

  if (mode === 'theme' || mode === 'all') {
    printViolations('Theme violations', themeViolations);
  }

  if (mode === 'i18n' || mode === 'all') {
    printViolations('Hardcoded JSX copy', literalViolations);
    printViolations('Hardcoded copy constants', copyConstantViolations);
    printViolations('Route locale fallbacks', routeFallbackViolations);
    printViolations('Same-as-English catalog values', sameAsEnglish);
  }

  if (failures.length) {
    console.error('\nCompliance check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Compliance checks passed.');
}

main();
