import fs from 'node:fs';
import path from 'node:path';
import { PROFILES_DIR } from './paths.mjs';

/**
 * @returns {string[]}
 */
export function listProfileIds() {
  if (!fs.existsSync(PROFILES_DIR)) return [];
  return fs
    .readdirSync(PROFILES_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
}

/**
 * @param {string} profileId
 */
export function assertKnownProfile(profileId) {
  const ids = listProfileIds();
  if (!ids.includes(profileId)) {
    throw new Error(`Unknown profile '${profileId}'. Valid: ${ids.join(', ')}`);
  }
}
