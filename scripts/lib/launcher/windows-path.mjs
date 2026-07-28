import path from 'node:path';

/** Expand %VAR% on Windows when passed literally from cmd. */
export function expandEnvPath(p) {
  if (!p) return p;
  return p.replace(/%([^%]+)%/g, (_, name) => process.env[name] ?? `%${name}%`);
}

/**
 * @param {string} p
 * @returns {string}
 */
export function toWinLongPath(p) {
  if (process.platform !== 'win32') return p;
  const resolved = path.resolve(p);
  if (resolved.startsWith('\\\\?\\')) return resolved;
  if (resolved.length < 240) return resolved;
  if (resolved.startsWith('\\\\')) return `\\\\?\\UNC\\${resolved.slice(2)}`;
  return `\\\\?\\${resolved}`;
}
