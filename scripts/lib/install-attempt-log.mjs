import fs from 'node:fs';
import path from 'node:path';

/**
 * Write last failed install attempt for doctor (B4/G1). No PII.
 * @param {string} targetRoot
 * @param {{ code: string, phase?: string, launcher?: string, repair?: string, message?: string }} info
 */
export function writeInstallAttempt(targetRoot, info) {
  try {
    const dir = path.join(targetRoot, '.genetic-ai');
    fs.mkdirSync(dir, { recursive: true });
    const payload = {
      at: new Date().toISOString(),
      launcher: info.launcher || process.env.GENETIC_AI_LAUNCHER || 'unknown',
      phase: info.phase || 'install',
      code: info.code,
      message: info.message,
      repair: info.repair,
      node: process.versions.node,
      platform: process.platform,
    };
    fs.writeFileSync(
      path.join(dir, 'last-install-attempt.json'),
      JSON.stringify(payload, null, 2) + '\n',
      'utf8',
    );
  } catch {
    /* best effort */
  }
}

/**
 * @param {string} targetRoot
 */
export function clearInstallAttempt(targetRoot) {
  const p = path.join(targetRoot, '.genetic-ai', 'last-install-attempt.json');
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

/**
 * @param {string} targetRoot
 * @returns {object | null}
 */
export function readInstallAttempt(targetRoot) {
  const p = path.join(targetRoot, '.genetic-ai', 'last-install-attempt.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}
