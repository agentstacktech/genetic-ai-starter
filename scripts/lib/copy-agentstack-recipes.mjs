/**
 * Copy AgentStack extension recipes into consumer examples/agentstack/.
 * Excludes node_modules and lockfiles from source tree.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { EXTENSIONS_DIR } from './paths.mjs';
import { pinConsumerSdkDependency } from './pin-recipe-package.mjs';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);
const SKIP_FILES = new Set(['package-lock.json']);

/**
 * @param {string} srcDir
 * @param {string} destDir
 * @param {{ dryRun?: boolean, lang?: 'typescript' | 'python', platformVersion?: string }} opts
 */
export function copyAgentstackRecipes(srcDir, destDir, opts = {}) {
  const { dryRun = false, lang = 'typescript', platformVersion } = opts;
  const recipeRoot =
    lang === 'python'
      ? path.join(EXTENSIONS_DIR, 'agentstack/recipes-python')
      : srcDir || path.join(EXTENSIONS_DIR, 'agentstack/recipes');

  if (!fs.existsSync(recipeRoot)) {
    throw new Error(`Recipe source missing: ${recipeRoot}`);
  }

  const copy = (from, to) => {
    if (SKIP_DIRS.has(path.basename(from))) return;
    const stat = fs.statSync(from);
    if (stat.isDirectory()) {
      if (!dryRun) fs.mkdirSync(to, { recursive: true });
      for (const name of fs.readdirSync(from)) {
        if (SKIP_DIRS.has(name)) continue;
        copy(path.join(from, name), path.join(to, name));
      }
      return;
    }
    if (SKIP_FILES.has(path.basename(from))) return;
    if (!dryRun) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  };

  if (dryRun) return { destDir, lang, recipeRoot };

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  copy(recipeRoot, destDir);

  if (lang === 'typescript' && platformVersion) {
    const pkgPath = path.join(destDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      pinConsumerSdkDependency(pkgPath, platformVersion);
    }
  }

  return { destDir, lang, recipeRoot, platformVersion: platformVersion || null };
}

/**
 * @param {string} kitRoot
 * @returns {string}
 */
export function readCapabilitySnapshotHash(kitRoot) {
  const candidates = [
    path.join(kitRoot, 'extensions/agentstack/capability-snapshot.json'),
    path.join(kitRoot, 'extensions/agentstack/overlay/capability-snapshot.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const body = fs.readFileSync(p, 'utf8');
      return crypto.createHash('sha256').update(body).digest('hex').slice(0, 16);
    }
  }
  return '';
}
