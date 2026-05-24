import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} targetRoot
 */
export function readKitLock(targetRoot) {
  const lockPath = path.join(targetRoot, '.genetic-ai', 'kit.lock.json');
  if (!fs.existsSync(lockPath)) return { lock: null, lockPath };
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  return { lock, lockPath };
}

/**
 * @param {string} targetRoot
 * @param {object} patch
 */
export function writeKitLock(targetRoot, lock) {
  const lockDir = path.join(targetRoot, '.genetic-ai');
  fs.mkdirSync(lockDir, { recursive: true });
  const lockPath = path.join(lockDir, 'kit.lock.json');
  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
  return lockPath;
}
