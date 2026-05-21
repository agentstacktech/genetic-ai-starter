import fs from 'node:fs';
import path from 'node:path';
import { PAYLOAD_ROOT, PROFILES_DIR } from './paths.mjs';

/**
 * Expand profile include globs to relative paths from payload root.
 */
export function loadProfile(profileId) {
  const file = path.join(PROFILES_DIR, `${profileId}.json`);
  if (!fs.existsSync(file)) throw new Error(`Unknown profile: ${profileId}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function globToRegex(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '<<<GLOBSTAR>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<<GLOBSTAR>>>/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function walkFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkFiles(full, base));
    else files.push(path.relative(base, full).replace(/\\/g, '/'));
  }
  return files;
}

export function resolveProfileFiles(profile) {
  const allPayload = walkFiles(PAYLOAD_ROOT).map((p) => `payload/${p}`);
  const include = profile.include || [];
  const selected = new Set();

  for (const pattern of include) {
    if (pattern.startsWith('!')) {
      const neg = pattern.slice(1);
      const re = globToRegex(neg);
      for (const f of [...selected]) {
        if (re.test(f)) selected.delete(f);
      }
      continue;
    }
    const re = globToRegex(pattern);
    for (const f of allPayload) {
      if (re.test(f)) selected.add(f);
    }
  }

  return [...selected].map((f) => f.replace(/^payload\//, ''));
}
