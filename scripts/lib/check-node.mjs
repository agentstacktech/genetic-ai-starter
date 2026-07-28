import { InstallError } from './install-errors.mjs';

const DEFAULT_MIN_MAJOR = 18;

/**
 * @returns {{ major: number, version: string }}
 */
export function readNodeVersion() {
  const version = process.versions.node;
  const major = Number.parseInt(version.split('.')[0], 10);
  return { major, version };
}

/**
 * @param {number} [minMajor]
 * @returns {{ ok: true, major: number, version: string }}
 */
export function checkNodeMin(minMajor = DEFAULT_MIN_MAJOR) {
  const { major, version } = readNodeVersion();
  if (Number.isNaN(major) || major < minMajor) {
    throw new InstallError('E_NODE_VERSION', {
      details: `found ${version}`,
    });
  }
  return { ok: true, major, version };
}

/**
 * @param {number} [minMajor]
 */
export function assertNodeMin(minMajor = DEFAULT_MIN_MAJOR) {
  checkNodeMin(minMajor);
}
