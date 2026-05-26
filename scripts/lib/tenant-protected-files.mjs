import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACT_PATH = path.resolve(__dirname, '../../contracts/NAVIGATION_CONTRACT.v1.json');

let _contractCache = null;

export function loadNavigationContract() {
  if (_contractCache) return _contractCache;
  _contractCache = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
  return _contractCache;
}

export function getProtectedFiles() {
  return loadNavigationContract().protectedFiles || [];
}

export function getKitRegions() {
  return (loadNavigationContract().regions || []).filter((r) => r.owner === 'kit' && r.endMarker);
}

export function isProtectedNavigationFile(relPath) {
  return getProtectedFiles().includes(relPath.replace(/\\/g, '/'));
}

/**
 * Merge extension overlay: only add sections not present in dest.
 * @param {string} existing
 * @param {string} incoming
 */
export function mergeExtensionOverlayMissingSections(existing, incoming) {
  if (!existing.trim()) return incoming;
  if (existing.includes(incoming.trim().slice(0, 80))) return existing;
  const lines = incoming.split('\n');
  const chunks = [];
  let current = [];
  for (const line of lines) {
    if (line.startsWith('## ') && current.length) {
      chunks.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) chunks.push(current.join('\n'));

  let out = existing;
  for (const chunk of chunks) {
    const heading = chunk.split('\n')[0];
    if (heading.startsWith('## ') && !out.includes(heading)) {
      out = `${out.trimEnd()}\n\n${chunk.trim()}\n`;
    }
  }
  return out;
}
