/**
 * Lightweight KIP v2 lock validation (no external JSON Schema runtime).
 * @param {object} lock
 * @returns {string[]} issue messages
 */
export function validateKitLockKipV2(lock) {
  const issues = [];
  if (!lock || typeof lock !== 'object') {
    issues.push('lock is not an object');
    return issues;
  }
  if (lock.lockSchemaVersion !== 2) {
    issues.push('lockSchemaVersion must be 2 (run migrate-kit-lock.mjs)');
  }
  if (lock.kitId !== 'genetic-ai-starter') {
    issues.push('kitId must be genetic-ai-starter');
  }
  if (!/^\d+\.\d+\.\d+$/.test(String(lock.kitVersion || ''))) {
    issues.push('kitVersion must be semver x.y.z');
  }
  const profiles = ['minimal', 'standard', 'full', 'founder'];
  if (!profiles.includes(lock.profile)) {
    issues.push(`profile must be one of: ${profiles.join(', ')}`);
  }
  if (lock.kitSource) {
    const types = ['submodule', 'npm', 'path', 'monorepo'];
    if (!types.includes(lock.kitSource.type)) {
      issues.push(`kitSource.type must be one of: ${types.join(', ')}`);
    }
    if (!lock.kitSource.path) issues.push('kitSource.path required');
    if (!lock.kitSource.ref) issues.push('kitSource.ref required');
    if (!lock.kitSource.refType) issues.push('kitSource.refType required');
  } else if (lock.lockSchemaVersion === 2) {
    issues.push('kitSource missing for KIP v2 lock');
  }
  return issues;
}
