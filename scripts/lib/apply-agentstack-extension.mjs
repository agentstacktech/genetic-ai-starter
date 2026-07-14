/**
 * Apply AgentStack extension overlays + merge append files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { appendInsideCursorrulesBlock } from './merge-cursorrules.mjs';
import { mergeExtensionOverlayMissingSections } from './tenant-protected-files.mjs';
import { substitute } from './substitute-placeholders.mjs';
import { EXTENSIONS_DIR } from './paths.mjs';
import { copyAgentstackRecipes } from './copy-agentstack-recipes.mjs';

const NAV_EXTENSION_MARKER = '<!-- genetic-ai-extension:agentstack-nav -->';

/**
 * @param {string} targetRoot
 * @param {string} extId
 * @param {Record<string, string>} vars
 * @param {{ dryRun?: boolean, preserveOverlays?: boolean }} opts
 */
export function applyAgentstackExtension(targetRoot, extId, vars, opts = {}) {
  const { dryRun = false, preserveOverlays = true } = opts;
  const extRoot = path.join(EXTENSIONS_DIR, extId);
  const manifestPath = path.join(extRoot, 'extension.manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`Extension not found: ${extId}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const ov of manifest.overlays || []) {
    const src = path.join(extRoot, ov.from);
    const dest = path.join(targetRoot, ov.to);
    if (!fs.existsSync(src)) continue;
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      let c = fs.readFileSync(src, 'utf8');
      c = substitute(c, vars, {});
      if (preserveOverlays && fs.existsSync(dest) && ov.to.endsWith('CONTEXT_FOR_AI.md')) {
        c = mergeExtensionOverlayMissingSections(fs.readFileSync(dest, 'utf8'), c);
      }
      fs.writeFileSync(dest, c, 'utf8');
    }
  }

  const navAppend = path.join(extRoot, 'merge/navigation-map.append.md');
  if (fs.existsSync(navAppend)) {
    const dest = path.join(targetRoot, 'docs/ai/AI_NAVIGATION_MAP.md');
    let chunk = fs.readFileSync(navAppend, 'utf8');
    chunk = substitute(chunk, vars, {});
    if (!dryRun && fs.existsSync(dest)) {
      const current = fs.readFileSync(dest, 'utf8');
      if (!current.includes(NAV_EXTENSION_MARKER)) {
        fs.appendFileSync(dest, '\n' + chunk, 'utf8');
      }
    }
  }

  const rulesAppend = path.join(extRoot, 'merge/cursorrules.append.md');
  if (fs.existsSync(rulesAppend)) {
    const append = substitute(fs.readFileSync(rulesAppend, 'utf8'), vars, {});
    if (!dryRun) {
      appendInsideCursorrulesBlock(path.join(targetRoot, '.cursorrules'), append);
    }
  }

  return manifest;
}

/**
 * Refresh recipe tree for agentstack-app installs (idempotent copy + npm pin).
 * @param {string} targetRoot
 * @param {{ lang?: string, platformVersion: string, dryRun?: boolean }} opts
 */
export function refreshAgentstackRecipes(targetRoot, opts) {
  const lang = opts.lang === 'python' ? 'python' : 'typescript';
  const dest =
    lang === 'python'
      ? path.join(targetRoot, 'examples/agentstack-python')
      : path.join(targetRoot, 'examples/agentstack');
  return copyAgentstackRecipes(null, dest, {
    dryRun: opts.dryRun,
    lang,
    platformVersion: opts.platformVersion,
  });
}
