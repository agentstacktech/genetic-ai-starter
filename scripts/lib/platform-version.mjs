import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './paths.mjs';

const PLATFORM_VERSION_FILE = path.join(KIT_ROOT, 'PLATFORM_VERSION');
const MANIFEST_PATH = path.join(KIT_ROOT, 'KIT_MANIFEST.json');

/**
 * Candidate paths for monorepo shared/constants.py (kit inside or next to AgentStack).
 */
function constantsCandidates() {
  const fromEnv = process.env.AGENTSTACK_CONSTANTS_PY;
  const list = [];
  if (fromEnv) list.push(path.resolve(fromEnv));
  // genetic-ai-starter/ inside AgentStack repo
  list.push(path.resolve(KIT_ROOT, '..', 'shared', 'constants.py'));
  // genetic-ai-starter at repo root sibling (unusual)
  list.push(path.resolve(KIT_ROOT, '..', '..', 'shared', 'constants.py'));
  return [...new Set(list)];
}

function parseVersionFromConstants(pyPath) {
  const text = fs.readFileSync(pyPath, 'utf8');
  const m = text.match(/AGENTSTACK_CORE_VERSION:\s*str\s*=\s*["']([^"']+)["']/);
  if (!m) {
    throw new Error(`AGENTSTACK_CORE_VERSION not found in ${pyPath}`);
  }
  return m[1];
}

function readFromManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return null;
  const v = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')).version;
  return v || null;
}

function readFromPlatformFile() {
  if (!fs.existsSync(PLATFORM_VERSION_FILE)) return null;
  const v = fs.readFileSync(PLATFORM_VERSION_FILE, 'utf8').trim();
  return v || null;
}

/**
 * Canonical platform patch — AGENTSTACK_CORE_VERSION.
 * Resolution order: env > shared/constants.py (monorepo) > PLATFORM_VERSION > KIT_MANIFEST.json
 */
export function readPlatformVersion() {
  if (process.env.AGENTSTACK_CORE_VERSION?.trim()) {
    return process.env.AGENTSTACK_CORE_VERSION.trim();
  }

  for (const py of constantsCandidates()) {
    if (fs.existsSync(py)) {
      return parseVersionFromConstants(py);
    }
  }

  const fromFile = readFromPlatformFile();
  if (fromFile) return fromFile;

  const fromManifest = readFromManifest();
  if (fromManifest) return fromManifest;

  throw new Error(
    `Cannot resolve platform version. Set AGENTSTACK_CORE_VERSION, place kit inside AgentStack monorepo, or add ${PLATFORM_VERSION_FILE}`,
  );
}

/** Where the version was resolved from (for lock / docs). */
export function describePlatformVersionSource() {
  if (process.env.AGENTSTACK_CORE_VERSION?.trim()) {
    return 'env:AGENTSTACK_CORE_VERSION';
  }
  for (const py of constantsCandidates()) {
    if (fs.existsSync(py)) return `shared/constants.py:${py}`;
  }
  if (fs.existsSync(PLATFORM_VERSION_FILE)) return 'genetic-ai-starter/PLATFORM_VERSION';
  if (fs.existsSync(MANIFEST_PATH)) return 'KIT_MANIFEST.json';
  return 'unknown';
}

/**
 * Keep KIT_MANIFEST.json in sync when maintainers bump the platform (monorepo CI).
 */
export function assertKitManifestMatchesPlatform() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const platform = readPlatformVersion();
  if (manifest.version !== platform) {
    throw new Error(
      `KIT_MANIFEST.json version "${manifest.version}" != platform "${platform}" (${describePlatformVersionSource()})`,
    );
  }
  return platform;
}

/** Write bundled PLATFORM_VERSION when syncing from monorepo. */
export function writePlatformVersionFile(version) {
  fs.writeFileSync(PLATFORM_VERSION_FILE, `${version}\n`, 'utf8');
}
