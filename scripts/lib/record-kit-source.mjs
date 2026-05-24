import path from 'node:path';
import {
  DEFAULT_KIT_SUBMODULE_PATH,
  DEFAULT_KIT_REPO_URL,
  LOCK_SCHEMA_VERSION,
  kitReleaseTag,
} from './kit-integration-constants.mjs';
import {
  readSubmoduleRef,
  parseGitmodules,
  resolveRemoteTagToSha,
} from './git-submodule.mjs';
import { readPlatformVersionForKitRoot } from './read-platform-version-for-kit.mjs';

/**
 * Build kitSource block for lock from resolved kit root.
 * @param {string} targetRoot consumer project
 * @param {string} kitRoot absolute kit path
 * @param {{ preferSubmodule?: boolean }} opts
 */
export function buildKitSourceRecord(targetRoot, kitRoot, opts = {}) {
  const rel = path.relative(targetRoot, kitRoot).replace(/\\/g, '/');
  const platformVersion = readPlatformVersionForKitRoot(kitRoot);

  const gitmodules = parseGitmodules(targetRoot);
  const mod = gitmodules.find((e) => e.path === rel) || gitmodules.find((e) => e.path);

  let type = 'path';
  if (rel.startsWith('node_modules/')) type = 'npm';
  else if (mod || rel === DEFAULT_KIT_SUBMODULE_PATH) type = 'submodule';

  const kitPath = mod?.path || rel || DEFAULT_KIT_SUBMODULE_PATH;
  const url = mod?.url || DEFAULT_KIT_REPO_URL;

  let ref = readSubmoduleRef(targetRoot, kitPath);
  let refType = 'commit';
  let refName = kitReleaseTag(platformVersion);

  if (!ref) {
    ref = resolveRemoteTagToSha(refName, url);
    if (ref) refType = 'commit';
  }

  if (!ref) {
    ref = platformVersion;
    refType = 'platform-version-fallback';
    refName = refName;
  }

  return {
    lockSchemaVersion: LOCK_SCHEMA_VERSION,
    kitSource: {
      type,
      path: kitPath,
      url: type === 'submodule' ? url : undefined,
      ref,
      refType,
      refName,
    },
    kitRootRel: kitPath,
  };
}

/**
 * Merge kitSource into existing lock fields.
 */
export function applyKitSourceToLock(lock, targetRoot, kitRoot, opts) {
  const rec = buildKitSourceRecord(targetRoot, kitRoot, opts);
  return {
    ...lock,
    lockSchemaVersion: rec.lockSchemaVersion,
    kitSource: rec.kitSource,
    kitRootRel: rec.kitRootRel,
    paths: {
      ...(lock.paths || { docsAi: 'docs/ai', philosophy: 'philosophy' }),
      kitRootRel: rec.kitRootRel,
    },
  };
}
