import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DEFAULT_KIT_REPO_URL, ALLOWED_KIT_REPO_HOSTS } from './kit-integration-constants.mjs';

function git(cwd, args) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

/**
 * @param {string} url
 * @returns {boolean}
 */
export function assertKitRepoUrlAllowed(url) {
  const normalized = url.replace(/\.git$/, '').trim().toLowerCase();
  const ok = ALLOWED_KIT_REPO_HOSTS.some((allowed) =>
    normalized.includes(allowed.toLowerCase()),
  );
  if (ok) return true;
  if (process.env.GENETIC_AI_KIT_URL_ALLOWLIST_EXTRA) {
    const extras = process.env.GENETIC_AI_KIT_URL_ALLOWLIST_EXTRA.split(',').map((s) => s.trim());
    return extras.some((e) => normalized.includes(e.toLowerCase()));
  }
  return false;
}

/**
 * @param {string} targetRoot
 * @param {string} submodulePath relative
 */
export function readSubmoduleRef(targetRoot, submodulePath) {
  const r = git(targetRoot, ['rev-parse', `${submodulePath}^{commit}`]);
  if (r.status !== 0) return null;
  return r.stdout.trim() || null;
}

/**
 * Read gitlink SHA from index (staged but parent not committed).
 * @param {string} targetRoot
 * @param {string} submodulePath
 */
export function readSubmoduleRefFromIndex(targetRoot, submodulePath) {
  const ls = git(targetRoot, ['ls-files', '-s', submodulePath]);
  if (ls.status === 0 && ls.stdout.trim()) {
    const parts = ls.stdout.trim().split(/\s+/);
    if (parts[0] && /^[0-9a-f]{40}$/i.test(parts[0])) return parts[0];
  }
  const indexed = git(targetRoot, ['rev-parse', `:${submodulePath}`]);
  if (indexed.status === 0 && indexed.stdout.trim()) return indexed.stdout.trim();
  return readSubmoduleRef(targetRoot, submodulePath);
}

/**
 * Parse .gitmodules for path → { url, name }.
 * @param {string} targetRoot
 */
export function parseGitmodules(targetRoot) {
  const gitmodulesPath = path.join(targetRoot, '.gitmodules');
  if (!fs.existsSync(gitmodulesPath)) return [];
  const text = fs.readFileSync(gitmodulesPath, 'utf8');
  const entries = [];
  let current = {};
  for (const line of text.split(/\r?\n/)) {
    const mSub = line.match(/^\[submodule "(.+)"\]/);
    if (mSub) {
      if (current.path || current.url) entries.push({ ...current });
      current = { name: mSub[1] };
      continue;
    }
    const mPath = line.match(/^\s*path\s*=\s*(.+)$/);
    const mUrl = line.match(/^\s*url\s*=\s*(.+)$/);
    if (mPath) current.path = mPath[1].trim();
    if (mUrl) current.url = mUrl[1].trim();
  }
  if (current.path || current.url) entries.push({ ...current });
  return entries;
}

/**
 * @param {string} targetRoot
 * @param {string} submoduleRelPath
 */
export function submodulePathExists(targetRoot, submoduleRelPath) {
  const abs = path.join(targetRoot, submoduleRelPath);
  return fs.existsSync(path.join(abs, 'scripts', 'install.mjs'));
}

/**
 * @param {string} targetRoot
 * @param {{ url?: string, path: string, ref: string, shallow?: boolean }} opts
 */
export function ensureSubmoduleAtRef(targetRoot, opts) {
  const url = opts.url || DEFAULT_KIT_REPO_URL;
  if (!assertKitRepoUrlAllowed(url)) {
    throw new Error(`Kit submodule URL not allowed: ${url}`);
  }
  const relPath = opts.path;
  const absPath = path.join(targetRoot, relPath);

  const entries = parseGitmodules(targetRoot);
  const existing = entries.find((e) => e.path === relPath);

  if (!existing) {
    const add = git(targetRoot, ['submodule', 'add', '--force', url, relPath]);
    if (add.status !== 0) {
      throw new Error(add.stderr || add.stdout || 'git submodule add failed');
    }
  }

  const updateArgs = ['submodule', 'update', '--init'];
  if (opts.shallow) updateArgs.push('--depth', '1');
  updateArgs.push(relPath);
  const upd = git(targetRoot, updateArgs);
  if (upd.status !== 0) {
    throw new Error(upd.stderr || upd.stdout || 'git submodule update failed');
  }

  if (opts.ref) {
    const co = git(absPath, ['checkout', '--detach', opts.ref]);
    if (co.status !== 0) {
      throw new Error(co.stderr || co.stdout || `checkout ${opts.ref} failed in submodule`);
    }
  }

  return readSubmoduleRef(targetRoot, relPath);
}

/**
 * Checkout submodule to lock pin (alias for upgrade --sync-submodule).
 * @param {string} targetRoot
 * @param {{ url?: string, path: string, ref: string, shallow?: boolean }} kitSource
 */
export function checkoutKitRef(targetRoot, kitSource) {
  return ensureSubmoduleAtRef(targetRoot, {
    url: kitSource.url,
    path: kitSource.path,
    ref: kitSource.ref,
    shallow: kitSource.shallow,
  });
}

/**
 * Resolve remote tag to commit SHA (ls-remote).
 * @param {string} tag e.g. genetic-ai-starter-v0.4.11
 */
export function resolveRemoteTagToSha(tag, url = DEFAULT_KIT_REPO_URL) {
  const r = spawnSync('git', ['ls-remote', url, `refs/tags/${tag}`], { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout.trim()) return null;
  const line = r.stdout.trim().split('\n')[0];
  const sha = line.split(/\s+/)[0];
  return sha || null;
}

/**
 * @param {string} targetRoot
 * @param {{ path: string, ref: string }} kitSource
 */
export function detectSubmoduleDrift(targetRoot, kitSource, { strict = false } = {}) {
  if (!kitSource?.ref || !kitSource?.path) return { drift: false };
  const indexRef = readSubmoduleRefFromIndex(targetRoot, kitSource.path);
  const head = readSubmoduleRef(targetRoot, kitSource.path);

  if (!indexRef && !head) {
    return { drift: true, severity: 'error', reason: 'submodule missing or empty' };
  }

  const effective = indexRef || head;
  if (effective === kitSource.ref) {
    if (head && head !== kitSource.ref && indexRef === kitSource.ref) {
      return {
        drift: true,
        severity: strict ? 'error' : 'warn',
        reason: 'gitlink staged; commit parent repo to clear WARN',
        head,
        indexRef,
        expected: kitSource.ref,
      };
    }
    return { drift: false, head: effective };
  }

  if (indexRef === kitSource.ref && head !== kitSource.ref) {
    return {
      drift: true,
      severity: strict ? 'error' : 'warn',
      reason: 'index matches lock; HEAD differs — commit gitlink in parent',
      head,
      indexRef,
      expected: kitSource.ref,
    };
  }

  return {
    drift: true,
    severity: 'error',
    reason: 'sha mismatch',
    head: head || indexRef,
    expected: kitSource.ref,
  };
}
