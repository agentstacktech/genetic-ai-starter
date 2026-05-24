import { readPlatformVersionForKitRoot } from './read-platform-version-for-kit.mjs';

/**
 * @param {object} lock
 * @param {string} kitRoot
 * @returns {{ ok: boolean, message?: string }}
 */
export function verifyKitVersionPin(lock, kitRoot) {
  if (!lock?.kitVersion) {
    return { ok: true };
  }
  try {
    const platform = readPlatformVersionForKitRoot(kitRoot);
    if (lock.kitVersion !== platform) {
      return {
        ok: false,
        message: `lock.kitVersion ${lock.kitVersion} != kit PLATFORM ${platform} — run upgrade after syncing submodule`,
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}
