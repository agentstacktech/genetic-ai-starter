import path from 'node:path';
import {
  DEFAULT_KIT_SUBMODULE_PATH,
  DEFAULT_KIT_REPO_URL,
  LOCK_SCHEMA_VERSION,
  kitReleaseTag,
} from './kit-integration-constants.mjs';
import {
  readSubmoduleRef,
  readSubmoduleRefFromIndex,
  parseGitmodules,
  resolveRemoteTagToSha,
} from './git-submodule.mjs';
import { readPlatformVersionForKitRoot } from './read-platform-version-for-kit.mjs';

const NAV_CONTRACT_VERSION = 1;

/**
 * Build kitSource block for lock from resolved kit root.
 * @param {string} targetRoot consumer project
 * @param {string} kitRoot absolute kit path
 * @param {{ preferSubmodule?: boolean }} opts
 */
function readPlatformVersionSafe(kitRoot) {
  try {
    return readPlatformVersionForKitRoot(kitRoot);
  } catch {
    return '0.0.0';
  }
}

export function buildKitSourceRecord(targetRoot, kitRoot, opts = {}) {
  const rel = path.relative(targetRoot, kitRoot).replace(/\\/g, '/');

  const gitmodules = parseGitmodules(targetRoot);
  const mod = gitmodules.find((e) => e.path === rel) || gitmodules.find((e) => e.path);

  let type = 'path';
  if (rel.startsWith('node_modules/')) type = 'npm';
  else if (mod || rel === DEFAULT_KIT_SUBMODULE_PATH) type = 'submodule';

  const isEphemeral =
    rel.startsWith('..') && type !== 'submodule' && !mod;

  if (isEphemeral) {
    const platformVersion = readPlatformVersionSafe(kitRoot);
    let ref = platformVersion;
    let refType = 'platform-version-fallback';
    const refName = kitReleaseTag(platformVersion);
    const remoteSha = resolveRemoteTagToSha(refName, DEFAULT_KIT_REPO_URL);
    if (remoteSha) {
      ref = remoteSha;
      refType = 'commit';
    }
    return {
      lockSchemaVersion: LOCK_SCHEMA_VERSION,
      kitSource: {
        type: 'ephemeral',
        ref,
        refType,
        refName,
      },
      kitRootRel: undefined,
      navigationContractVersion: NAV_CONTRACT_VERSION,
      navigationPreserveDefault: true,
      warnings: ['EPHEMERAL_KIT_ROOT: pin submodule for reproducible CI'],
    };
  }

  const platformVersion = readPlatformVersionForKitRoot(kitRoot);
  const kitPath = mod?.path || rel || DEFAULT_KIT_SUBMODULE_PATH;
  const url = mod?.url || DEFAULT_KIT_REPO_URL;

  let ref = readSubmoduleRefFromIndex(targetRoot, kitPath) || readSubmoduleRef(targetRoot, kitPath);
  let refType = 'commit';
  let refName = kitReleaseTag(platformVersion);

  if (!ref) {
    ref = resolveRemoteTagToSha(refName, url);
    if (ref) refType = 'commit';
  }

  if (!ref) {
    ref = platformVersion;
    refType = 'platform-version-fallback';
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
    navigationContractVersion: NAV_CONTRACT_VERSION,
    navigationPreserveDefault: true,
  };
}

/**
 * Merge kitSource into existing lock fields.
 */
export function applyKitSourceToLock(lock, targetRoot, kitRoot, opts) {
  const rec = buildKitSourceRecord(targetRoot, kitRoot, opts);
  const next = {
    ...lock,
    lockSchemaVersion: rec.lockSchemaVersion,
    kitSource: rec.kitSource,
    navigationContractVersion: rec.navigationContractVersion,
    navigationPreserveDefault: rec.navigationPreserveDefault,
    paths: {
      ...(lock.paths || { docsAi: 'docs/ai', philosophy: 'philosophy' }),
    },
  };
  if (rec.kitRootRel) {
    next.kitRootRel = rec.kitRootRel;
    next.paths.kitRootRel = rec.kitRootRel;
  } else {
    delete next.kitRootRel;
  }
  return { lock: next, warnings: rec.warnings || [] };
}
