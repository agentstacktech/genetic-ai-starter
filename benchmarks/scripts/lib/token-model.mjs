/**
 * Step-based context token model for benchmark transcripts (v1.2.1).
 * Grep pools scale with fixture-shop-api size.
 *
 * @see meta/docs/TOKEN_ECONOMICS_ru.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { FIXTURE_ROOT } from './paths.mjs';

export const TOKEN_MODEL_VERSION = '1.2.1';

/** ~chars per token (GPT-style estimate for English/code mix). */
export const CHARS_PER_TOKEN = 4;

/** Per tool round: status line + args + framing. */
export const TOOL_ROUND_OVERHEAD = 280;

/** Assistant prose per transcript line (planning / summary). */
export const OUTPUT_PER_LINE = 180;

/** User task prompt once per session (shop-api average). */
export const PROMPT_BASE = 420;

/**
 * Upper bound for huge monorepo slices (documentation only — not default pool).
 * @deprecated use {@link unscopedGrepPool} — fixture-calibrated
 */
export const GREP_UNSCOPED_POOL_LEGACY = 14_000;

const DEFAULT_READ = {
  'docs/ai/AI_NAVIGATION_MAP.md': 900,
  'GENE_COMPRESSION_MAP.md': 1100,
  'AGENTS.md': 1200,
  'README.md': 400,
  '.cursorrules': 600,
};

const INDEX_SUFFIX = 'AI_INDEX.md';

const fileSizeCache = new Map();
let fixtureStatsCache = null;

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

/**
 * Walk benchmark fixture once — shop-api is ~20 files / ~6KB (May 2026).
 * @returns {{ fileCount: number, totalBytes: number, fullRepoTokens: number }}
 */
export function getFixtureStats() {
  if (fixtureStatsCache) return fixtureStatsCache;
  let fileCount = 0;
  let totalBytes = 0;

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else {
        fileCount += 1;
        totalBytes += fs.statSync(full).size;
      }
    }
  }

  walk(FIXTURE_ROOT);
  fixtureStatsCache = {
    fileCount,
    totalBytes,
    fullRepoTokens: Math.ceil(totalBytes / CHARS_PER_TOKEN),
  };
  return fixtureStatsCache;
}

/**
 * Calibrated unscoped grep pool: fraction of repo text re-injected into context.
 * shop-api (~6KB) → ~1.1k–1.3k per rg line, not 14k.
 */
export function unscopedGrepPool() {
  const { fileCount, fullRepoTokens } = getFixtureStats();
  let fraction;
  let cap;
  if (fileCount <= 40) {
    fraction = 0.55;
    cap = 2_500;
  } else if (fileCount <= 200) {
    fraction = 0.25;
    cap = 8_000;
  } else {
    fraction = 0.12;
    cap = 14_000;
  }
  const pool = Math.ceil(fullRepoTokens * fraction) + TOOL_ROUND_OVERHEAD;
  return Math.min(cap, Math.max(900, pool));
}

/** Scoped grep under one folder — smaller slice of repo. */
export function scopedGrepPool() {
  const { fileCount, fullRepoTokens } = getFixtureStats();
  const fraction = fileCount <= 40 ? 0.15 : fileCount <= 200 ? 0.08 : 0.05;
  const cap = fileCount <= 40 ? 1_200 : 3_500;
  const pool = Math.ceil(fullRepoTokens * fraction) + TOOL_ROUND_OVERHEAD;
  return Math.min(cap, Math.max(500, pool));
}

/** @deprecated alias for tests migrating off flat 14k */
export const GREP_UNSCOPED_POOL = unscopedGrepPool();

function fixtureBytes(rel) {
  const key = normalizePath(rel);
  if (fileSizeCache.has(key)) return fileSizeCache.get(key);
  const full = path.join(FIXTURE_ROOT, key);
  let bytes = 0;
  if (fs.existsSync(full)) {
    bytes = fs.statSync(full).size;
  }
  fileSizeCache.set(key, bytes);
  return bytes;
}

function tokensFromBytes(bytes) {
  return Math.ceil(bytes / CHARS_PER_TOKEN) + TOOL_ROUND_OVERHEAD;
}

function tokensForRead(filePath) {
  const norm = normalizePath(filePath);
  if (norm.endsWith(INDEX_SUFFIX)) {
    const bytes = fixtureBytes(norm) || 280;
    return tokensFromBytes(bytes);
  }
  if (DEFAULT_READ[norm]) return DEFAULT_READ[norm] + TOOL_ROUND_OVERHEAD;
  const bytes = fixtureBytes(norm);
  if (bytes > 0) return tokensFromBytes(bytes);
  if (/philosophy\/genes\//i.test(norm)) return 750 + TOOL_ROUND_OVERHEAD;
  if (/\.md$/i.test(norm)) return 500 + TOOL_ROUND_OVERHEAD;
  return 450 + TOOL_ROUND_OVERHEAD;
}

function isUnscopedGrepLine(line) {
  if (!/\brg\b|\bgrep\b|ripgrep/i.test(line)) return false;
  if (/\bsrc\/[\w-]+\//i.test(line)) return false;
  if (/\bagentstack-core\//i.test(line)) return false;
  if (/\bdocs\//i.test(line)) return false;
  if (/\bphilosophy\//i.test(line)) return false;
  if (/\brg\b[^\n]*\ssrc\b/i.test(line) && !/\bsrc\//i.test(line)) return true;
  return /\brg\b|\bgrep\b.*\s-r\b|ripgrep/i.test(line);
}

function isScopedGrepLine(line) {
  if (!/\brg\b|\bgrep\b/i.test(line)) return false;
  return /\bsrc\/[\w-]+\/|docs\/|agentstack-core\//i.test(line);
}

function extractReadPaths(line) {
  const paths = [];
  const readRe = /\bRead\s+([\w./-]+\.(?:ts|tsx|js|md|mdc|py))/gi;
  let m;
  while ((m = readRe.exec(line)) !== null) {
    paths.push(normalizePath(m[1]));
  }
  const bareRe =
    /(?:^|[\s(])([\w./-]*(?:AI_NAVIGATION_MAP|GENE_COMPRESSION_MAP|AI_INDEX|AGENTS)\.md)/gi;
  while ((m = bareRe.exec(line)) !== null) {
    paths.push(normalizePath(m[1]));
  }
  return paths;
}

/**
 * @param {string} text Full transcript
 * @returns {{ steps: object[], breakdown: object, total: number, meta: object }}
 */
export function computeContextTokens(text) {
  const stats = getFixtureStats();
  const unscopedPool = unscopedGrepPool();
  const scopedPool = scopedGrepPool();
  const steps = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const breakdown = {
    promptBase: PROMPT_BASE,
    reads: 0,
    grepsUnscoped: 0,
    grepsScoped: 0,
    output: 0,
    unscopedPoolPerHit: unscopedPool,
    scopedPoolPerHit: scopedPool,
    toolOverheadIncludedInReads: true,
  };

  for (const line of lines) {
    breakdown.output += OUTPUT_PER_LINE;

    if (isUnscopedGrepLine(line)) {
      breakdown.grepsUnscoped += unscopedPool;
      steps.push({ type: 'grep_unscoped', tokens: unscopedPool, line: line.slice(0, 80) });
      continue;
    }
    if (isScopedGrepLine(line)) {
      breakdown.grepsScoped += scopedPool;
      steps.push({ type: 'grep_scoped', tokens: scopedPool, line: line.slice(0, 80) });
      continue;
    }

    const paths = extractReadPaths(line);
    for (const p of paths) {
      const t = tokensForRead(p);
      breakdown.reads += t;
      steps.push({ type: 'read', path: p, tokens: t });
    }
  }

  const total =
    breakdown.promptBase +
    breakdown.reads +
    breakdown.grepsUnscoped +
    breakdown.grepsScoped +
    breakdown.output;

  return {
    steps,
    breakdown,
    total,
    meta: {
      tokenModelVersion: TOKEN_MODEL_VERSION,
      fixtureFileCount: stats.fileCount,
      fixtureTotalBytes: stats.totalBytes,
      fixtureFullRepoTokens: stats.fullRepoTokens,
      unscopedPoolPerHit: unscopedPool,
      scopedPoolPerHit: scopedPool,
      legacyFlat14kWouldBe: GREP_UNSCOPED_POOL_LEGACY,
    },
  };
}

/**
 * Compare two transcript paths (documentation).
 */
export function compareTokenPaths(mapOnlyText, indexedText) {
  const a = computeContextTokens(mapOnlyText);
  const b = computeContextTokens(indexedText);
  const saved = a.total - b.total;
  const pct = a.total > 0 ? Math.round((saved / a.total) * 100) : 0;
  return {
    mapOnly: a.total,
    indexed: b.total,
    saved,
    savedPct: pct,
    mapOnlyBreakdown: a.breakdown,
    indexedBreakdown: b.breakdown,
    meta: a.meta,
  };
}
