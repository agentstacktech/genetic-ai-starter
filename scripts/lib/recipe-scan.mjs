import fs from 'node:fs';
import { walkFiles } from './walk-files.mjs';

const ACTION_RE = /action:\s*['"]([a-z0-9_.]+)['"]/gi;
const GATE_RE = /gateCapability\([^,]+,\s*['"]([a-z0-9_.]+)['"]\)/g;
const IMPORT_RE = /from\s+['"]@agentstack\/sdk(\/[^'"]+)?['"]/g;

/**
 * @param {string} filePath
 */
export function scanRecipeFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(text))) {
    imports.push(m[1] ? `.${m[1]}` : '.');
  }
  const actions = [];
  ACTION_RE.lastIndex = 0;
  while ((m = ACTION_RE.exec(text))) actions.push(m[1]);
  GATE_RE.lastIndex = 0;
  while ((m = GATE_RE.exec(text))) actions.push(m[1]);
  return { imports, actions };
}

/**
 * @param {string} recipesDir
 * @returns {Set<string>}
 */
export function scanRecipePinnedActions(recipesDir) {
  const actions = new Set();
  if (!fs.existsSync(recipesDir)) return actions;
  for (const file of walkFiles(recipesDir, {
    extensions: ['.ts', '.tsx'],
    skipDirs: ['node_modules', '.git'],
  })) {
    for (const action of scanRecipeFile(file).actions) actions.add(action);
  }
  return actions;
}

/**
 * @param {string[]} roots
 * @param {(path: string) => boolean} [filter]
 */
export function listRecipeScanFiles(roots, filter = (p) => /\.(ts|tsx|md)$/.test(p)) {
  const files = new Set();
  for (const root of roots) {
    for (const f of walkFiles(root, { extensions: null, filter })) {
      files.add(f);
    }
  }
  return files;
}
