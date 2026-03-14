import prisma from '@/lib/prisma';

type SearchResultItem = {
  href: string;
  title: string;
  description: string;
};

type DiscoverySearchResults = {
  guides: SearchResultItem[];
  rights: SearchResultItem[];
  laws: SearchResultItem[];
};

type DiscoverySearchDocument = {
  documentType: string;
  href: string;
  title: string;
  description?: string | null;
  searchText: string;
  rankBoost?: number | null;
  updatedAt?: Date | string | null;
};

type SearchDocumentIndexEntry = DiscoverySearchDocument & {
  description: string;
  rankBoost: number;
  updatedAt: Date;
  normalizedTitle: string;
  normalizedDescription: string;
  normalizedSearchText: string;
  normalizedCombined: string;
  tokens: string[];
  tokenSet: Set<string>;
  bigramSet: Set<string>;
};

type DiscoverySearchIndexCache = {
  expiresAt: number;
  rows: DiscoverySearchDocument[];
};

type ExpandedDiscoveryTerms = {
  normalizedQuery: string;
  phraseVariants: string[];
  primaryTokens: string[];
  secondaryTokens: string[];
  structuredReferences: string[];
};

const SEARCH_INDEX_TTL_MS = 5 * 60 * 1000;
const MAX_ROWS = 18;
const MAX_GUIDES = 6;
const MAX_RIGHTS = 6;
const MAX_LAWS = 8;

const DISCOVERY_SYNONYMS: Record<string, string[]> = {
  fir: ['fir', 'first information report', 'zero fir', 'एफआईआर', 'prathmiki'],
  arrest: ['arrest', 'custody', 'detention', 'girftari', 'गिरफ्तारी'],
  girftari: ['girftari', 'arrest', 'custody', 'detention', 'गिरफ्तारी'],
  cyber: ['cyber', 'cyber fraud', 'online scam', 'otp fraud', 'digital fraud', 'साइबर फ्रॉड'],
  impersonation: ['impersonation', 'fake identity', 'personation', 'cheating by personation'],
  consumer: ['consumer', 'refund', 'defective service', 'consumer complaint', 'उपभोक्ता शिकायत'],
  wages: ['wages', 'salary delay', 'unpaid wages', 'wage claim', 'मजदूरी'],
  legal: ['legal aid', 'liberty', 'equal justice', 'कानूनी सहायता'],
  divorce: [
    'divorce',
    'mutual consent divorce',
    'matrimonial relief',
    'interim maintenance',
    'alimony',
  ],
  property: ['property dispute', 'sale deed', 'title dispute', 'registration', 'inheritance', 'succession'],
  tenant: [
    'tenant notice',
    'lease notice',
    'vacate notice',
    'possession dispute',
    'rent notice',
    'kiraya',
    'भाड़ा',
  ],
  injury: ['work injury', 'employee compensation', 'workplace accident', 'accident claim', 'compensation claim'],
  marriage: ['court marriage', 'special marriage act', 'interfaith marriage', 'void marriage', 'marriage validity'],
  ipc: ['ipc', 'indian penal code', 'legacy penal code'],
  crpc: ['crpc', 'code of criminal procedure', 'legacy procedure code'],
  bns: ['bns', 'bharatiya nyaya sanhita', 'new penal code'],
  bnss: ['bnss', 'bharatiya nagarik suraksha sanhita', 'new criminal procedure code'],
  bsa: ['bsa', 'bharatiya sakshya adhiniyam', 'new evidence code'],
  iea: ['iea', 'indian evidence act', 'evidence act 1872'],
  cheque: ['cheque bounce', 'check bounce', 'dishonour of cheque', 'section 138 ni act', 'ni act'],
  gst: ['gst notice', 'itc mismatch', 'gst appeal', 'cgst act', 'tax demand reply'],
  board: ['board meeting', 'board resolution', 'company annual return', 'director disqualification'],
  rent: ['rent deposit', 'tenant eviction', 'rent control', 'maharashtra rent', 'delhi rent'],
};

const CODE_REFERENCE_ALIASES: Record<string, string[]> = {
  ipc: ['ipc', 'indian penal code', 'legacy penal code'],
  bns: ['bns', 'bharatiya nyaya sanhita', 'bharatiya nyaya sanhita 2023'],
  crpc: ['crpc', 'code of criminal procedure', 'code of criminal procedure 1973'],
  bnss: [
    'bnss',
    'bharatiya nagarik suraksha sanhita',
    'bharatiya nagarik suraksha sanhita 2023',
  ],
  bsa: ['bsa', 'bharatiya sakshya adhiniyam', 'bharatiya sakshya adhiniyam 2023'],
  iea: ['iea', 'indian evidence act', 'indian evidence act 1872'],
  nia: ['nia', 'negotiable instruments act', 'negotiable instruments act 1881', 'ni act'],
  cgst: ['cgst', 'central goods and services tax act', 'gst act'],
  coa: ['coa', 'companies act', 'companies act 2013', 'company law'],
  drca: ['drca', 'delhi rent control act', 'delhi rent law'],
  mrca: ['mrca', 'maharashtra rent control act', 'maharashtra rent law'],
};

let cachedSearchIndex: DiscoverySearchIndexCache | null = null;
let searchIndexPromise: Promise<DiscoverySearchDocument[]> | null = null;

export function normalizeDiscoverySearchQuery(query: string | null | undefined) {
  return (query ?? '').trim().replace(/\s+/g, ' ');
}

export function normalizeDiscoverySearchText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeDiscoverySearchText(value: string | null | undefined) {
  return normalizeDiscoverySearchText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildTokenBigrams(tokens: string[]) {
  const bigrams = new Set<string>();

  for (let index = 0; index < tokens.length - 1; index += 1) {
    bigrams.add(`${tokens[index]} ${tokens[index + 1]}`);
  }

  return bigrams;
}

function buildDiscoverySearchIndexEntry(document: DiscoverySearchDocument): SearchDocumentIndexEntry {
  const description = document.description ?? '';
  const normalizedTitle = normalizeDiscoverySearchText(document.title);
  const normalizedDescription = normalizeDiscoverySearchText(description);
  const normalizedSearchText = normalizeDiscoverySearchText(document.searchText);
  const normalizedCombined = [normalizedTitle, normalizedDescription, normalizedSearchText]
    .filter(Boolean)
    .join(' ')
    .trim();
  const tokens = uniqueStrings(tokenizeDiscoverySearchText(normalizedCombined));

  return {
    ...document,
    description,
    rankBoost: document.rankBoost ?? 1,
    updatedAt: document.updatedAt ? new Date(document.updatedAt) : new Date(0),
    normalizedTitle,
    normalizedDescription,
    normalizedSearchText,
    normalizedCombined,
    tokens,
    tokenSet: new Set(tokens),
    bigramSet: buildTokenBigrams(tokens),
  };
}

function getPhraseVariants(query: string) {
  const normalizedQuery = normalizeDiscoverySearchText(query);
  const variants = new Set<string>(normalizedQuery ? [normalizedQuery] : []);
  const normalizedTokens = tokenizeDiscoverySearchText(query);

  for (const [term, synonyms] of Object.entries(DISCOVERY_SYNONYMS)) {
    const normalizedTerm = normalizeDiscoverySearchText(term);
    const normalizedSynonyms = synonyms.map((synonym) => normalizeDiscoverySearchText(synonym));

    const hasTermMatch =
      normalizedQuery.includes(normalizedTerm) ||
      normalizedTokens.includes(normalizedTerm) ||
      normalizedSynonyms.some(
        (synonym) =>
          normalizedQuery.includes(synonym) || normalizedTokens.includes(synonym)
      );

    if (!hasTermMatch) {
      continue;
    }

    for (const synonym of normalizedSynonyms) {
      variants.add(synonym);
    }
  }

  const sectionMatches = normalizedQuery.matchAll(/\b(?:section|sec|s)\s*([0-9a-z]+)\b/gi);
  for (const match of sectionMatches) {
    const value = match[1];
    variants.add(`section ${value}`);
    variants.add(`sec ${value}`);
    variants.add(`s ${value}`);
  }

  const articleMatches = normalizedQuery.matchAll(/\b(?:article|art)\s*([0-9a-z]+)\b/gi);
  for (const match of articleMatches) {
    const value = match[1];
    variants.add(`article ${value}`);
    variants.add(`art ${value}`);
  }

  const codedReferenceMatches = normalizedQuery.matchAll(
    /\b(ipc|bns|crpc|bnss|bsa|iea|nia|ni|cgst|coa|drca|mrca)\s*([0-9a-z]+)\b/gi
  );
  for (const match of codedReferenceMatches) {
    const aliasKey = match[1] === 'ni' ? 'nia' : match[1];
    const value = match[2];

    for (const alias of CODE_REFERENCE_ALIASES[aliasKey] ?? []) {
      const normalizedAlias = normalizeDiscoverySearchText(alias);
      variants.add(`${normalizedAlias} ${value}`);
      variants.add(`${normalizedAlias} section ${value}`);
    }

    variants.add(`section ${value}`);
  }

  return uniqueStrings([...variants]);
}

function extractStructuredReferences(query: string) {
  const normalizedQuery = normalizeDiscoverySearchText(query);
  const references = new Set<string>();

  const sectionMatches = normalizedQuery.matchAll(/\b(?:section|sec|s)\s*([0-9a-z]+)\b/gi);
  for (const match of sectionMatches) {
    references.add(`section ${match[1]}`);
  }

  const articleMatches = normalizedQuery.matchAll(/\b(?:article|art)\s*([0-9a-z]+)\b/gi);
  for (const match of articleMatches) {
    references.add(`article ${match[1]}`);
  }

  const codedReferenceMatches = normalizedQuery.matchAll(
    /\b(ipc|bns|crpc|bnss|bsa|iea|nia|ni|cgst|coa|drca|mrca)\s*([0-9a-z]+)\b/gi
  );
  for (const match of codedReferenceMatches) {
    const aliasKey = match[1] === 'ni' ? 'nia' : match[1];
    const value = match[2];
    references.add(`section ${value}`);

    for (const alias of CODE_REFERENCE_ALIASES[aliasKey] ?? []) {
      const normalizedAlias = normalizeDiscoverySearchText(alias);
      references.add(`${normalizedAlias} ${value}`);
      references.add(`${normalizedAlias} section ${value}`);
    }
  }

  return [...references];
}

export function buildExpandedDiscoveryTerms(query: string): ExpandedDiscoveryTerms {
  const normalizedQuery = normalizeDiscoverySearchText(query);
  const phraseVariants = getPhraseVariants(normalizedQuery);
  const primaryTokens = uniqueStrings(tokenizeDiscoverySearchText(normalizedQuery));
  const secondaryTokens = uniqueStrings(
    phraseVariants
      .flatMap((variant) => tokenizeDiscoverySearchText(variant))
      .filter((token) => !primaryTokens.includes(token))
  );

  return {
    normalizedQuery,
    phraseVariants,
    primaryTokens,
    secondaryTokens,
    structuredReferences: extractStructuredReferences(normalizedQuery),
  };
}

function getLevenshteinDistance(left: string, right: string, maxDistance = 2) {
  if (left === right) {
    return 0;
  }

  if (Math.abs(left.length - right.length) > maxDistance) {
    return maxDistance + 1;
  }

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let row = 1; row <= left.length; row += 1) {
    let current = row;
    let minInRow = current;

    for (let column = 1; column <= right.length; column += 1) {
      const insertion = current + 1;
      const deletion = previous[column] + 1;
      const substitution = previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1);
      const next = Math.min(insertion, deletion, substitution);

      previous[column - 1] = current;
      current = next;
      minInRow = Math.min(minInRow, next);
    }

    previous[right.length] = current;

    if (minInRow > maxDistance) {
      return maxDistance + 1;
    }
  }

  return previous[right.length];
}

function scoreTokenMatch(token: string, entry: SearchDocumentIndexEntry) {
  if (!token) {
    return 0;
  }

  if (entry.tokenSet.has(token)) {
    return 1;
  }

  if (token.length >= 4) {
    for (const candidate of entry.tokens) {
      if (candidate.startsWith(token) || token.startsWith(candidate)) {
        return 0.7;
      }
    }
  }

  if (token.length >= 5) {
    const maxDistance = token.length >= 8 ? 2 : 1;

    for (const candidate of entry.tokens) {
      if (Math.abs(candidate.length - token.length) > maxDistance) {
        continue;
      }

      const distance = getLevenshteinDistance(token, candidate, maxDistance);
      if (distance <= maxDistance) {
        return distance === 1 ? 0.55 : 0.35;
      }
    }
  }

  return 0;
}

function scorePhraseVariant(variant: string, entry: SearchDocumentIndexEntry) {
  if (!variant) {
    return 0;
  }

  if (entry.normalizedTitle === variant) {
    return 12;
  }

  if (entry.normalizedTitle.includes(variant)) {
    return 8;
  }

  if (entry.normalizedDescription.includes(variant)) {
    return 5;
  }

  if (entry.normalizedCombined.includes(variant)) {
    return 3.5;
  }

  const variantTokens = tokenizeDiscoverySearchText(variant);
  if (variantTokens.length === 2 && entry.bigramSet.has(`${variantTokens[0]} ${variantTokens[1]}`)) {
    return 2.2;
  }

  return 0;
}

function scoreStructuredReferences(references: string[], entry: SearchDocumentIndexEntry) {
  let score = 0;

  for (const reference of references) {
    if (!reference) {
      continue;
    }

    if (entry.normalizedTitle.includes(reference)) {
      score += 5;
      continue;
    }

    if (entry.normalizedCombined.includes(reference)) {
      score += 2.5;
    }
  }

  return score;
}

function scoreDiscoveryEntry(entry: SearchDocumentIndexEntry, expandedTerms: ExpandedDiscoveryTerms) {
  let score = 0;

  for (const variant of expandedTerms.phraseVariants) {
    score += scorePhraseVariant(variant, entry);
  }

  for (const token of expandedTerms.primaryTokens) {
    score += scoreTokenMatch(token, entry) * 1.75;
  }

  for (const token of expandedTerms.secondaryTokens) {
    score += scoreTokenMatch(token, entry) * 0.8;
  }

  if (
    expandedTerms.primaryTokens.length >= 2 &&
    entry.bigramSet.has(`${expandedTerms.primaryTokens[0]} ${expandedTerms.primaryTokens[1]}`)
  ) {
    score += 1.5;
  }

  score += scoreStructuredReferences(expandedTerms.structuredReferences, entry);

  if (
    expandedTerms.normalizedQuery &&
    entry.normalizedCombined.includes(expandedTerms.normalizedQuery)
  ) {
    score += 2;
  }

  return score * entry.rankBoost;
}

async function getPublishedSearchDocuments() {
  if (cachedSearchIndex && cachedSearchIndex.expiresAt > Date.now()) {
    return cachedSearchIndex.rows;
  }

  if (!searchIndexPromise) {
    searchIndexPromise = prisma.searchDocument
      .findMany({
        where: {
          isPublished: true,
          locale: 'en',
        },
        orderBy: [{ rankBoost: 'desc' }, { updatedAt: 'desc' }],
        select: {
          documentType: true,
          href: true,
          title: true,
          description: true,
          searchText: true,
          rankBoost: true,
          updatedAt: true,
        },
      })
      .then((rows) =>
        rows.map((row) => ({
          documentType: row.documentType,
          href: row.href,
          title: row.title,
          description: row.description,
          searchText: row.searchText,
          rankBoost: row.rankBoost,
          updatedAt: row.updatedAt,
        }))
      )
      .finally(() => {
        searchIndexPromise = null;
      });
  }

  const rows = await searchIndexPromise;
  cachedSearchIndex = {
    rows,
    expiresAt: Date.now() + SEARCH_INDEX_TTL_MS,
  };

  return rows;
}

export function searchDiscoveryDocuments(
  documents: DiscoverySearchDocument[],
  query: string
): DiscoverySearchResults {
  const normalizedQuery = normalizeDiscoverySearchQuery(query);

  if (normalizedQuery.length < 2) {
    return {
      guides: [],
      rights: [],
      laws: [],
    };
  }

  const expandedTerms = buildExpandedDiscoveryTerms(normalizedQuery);
  const rankedRows = documents
    .map(buildDiscoverySearchIndexEntry)
    .map((entry) => ({
      ...entry,
      score: scoreDiscoveryEntry(entry, expandedTerms),
    }))
    .filter((entry) => entry.score >= 1.5)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.rankBoost !== left.rankBoost) {
        return right.rankBoost - left.rankBoost;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    })
    .slice(0, MAX_ROWS);

  const guides: SearchResultItem[] = [];
  const rights: SearchResultItem[] = [];
  const laws: SearchResultItem[] = [];

  for (const row of rankedRows) {
    const item = {
      href: row.href,
      title: row.title,
      description: row.description,
    };

    if (row.documentType === 'GUIDE' && guides.length < MAX_GUIDES) {
      guides.push(item);
      continue;
    }

    if (row.documentType === 'RIGHT' && rights.length < MAX_RIGHTS) {
      rights.push(item);
      continue;
    }

    if (
      (row.documentType === 'LAW_ACT' || row.documentType === 'LAW_SECTION') &&
      laws.length < MAX_LAWS
    ) {
      laws.push(item);
    }
  }

  return {
    guides,
    rights,
    laws,
  };
}

export async function searchDiscoveryResources(query: string): Promise<DiscoverySearchResults> {
  const documents = await getPublishedSearchDocuments();
  return searchDiscoveryDocuments(documents, query);
}
