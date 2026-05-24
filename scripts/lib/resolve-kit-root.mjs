import fs from 'node:fs';
import path from 'node:path';
import { resolveFromSubmodule } from './kit-source-resolvers/submodule.mjs';
import { resolveFromNpm } from './kit-source-resolvers/npm.mjs';
import { resolveFromMonorepo } from './kit-source-resolvers/monorepo.mjs';
import { resolveFromPath } from './kit-source-resolvers/path.mjs';
import { readKitLock } from './read-kit-lock.mjs';
import { KIT_ROOT } from './paths.mjs';

const HINT = `Kit root not found.
  Quick fix (zero-kit): curl -fsSL https://raw.githubusercontent.com/agentstacktech/genetic-ai-starter/main/scripts/remote-bootstrap.mjs -o /tmp/gai-bootstrap.mjs && node /tmp/gai-bootstrap.mjs --target .
  Or: git submodule add https://github.com/agentstacktech/genetic-ai-starter.git tools/genetic-ai-starter
  Then: node tools/genetic-ai-starter/scripts/bootstrap-standard.mjs --target .`;

/**
 * @typedef {{ root: string, source: string, warnings: string[], lock?: object | null }} ResolveResult
 */

/**
 * @param {{ target?: string, explicitKitRoot?: string | null, allowScriptCwd?: boolean }} opts
 * @returns {ResolveResult}
 */
export function resolveKitRoot(opts = {}) {
  const target = path.resolve(opts.target || process.cwd());
  const warnings = [];

  if (opts.explicitKitRoot) {
    return {
      root: path.resolve(opts.explicitKitRoot),
      source: 'cli.--kit-root',
      warnings,
    };
  }

  if (process.env.GENETIC_AI_KIT_ROOT?.trim()) {
    return {
      root: path.resolve(process.env.GENETIC_AI_KIT_ROOT.trim()),
      source: 'env.GENETIC_AI_KIT_ROOT',
      warnings,
    };
  }

  const { lock } = readKitLock(target);
  const ctx = { lock };

  if (lock?.kitRootRel) {
    const sub = resolveFromSubmodule(target, {
      lock: { kitSource: { path: lock.kitRootRel } },
    });
    if (sub) {
      return {
        root: sub.root,
        source: sub.source,
        warnings: [...warnings, ...sub.warnings],
        lock,
      };
    }
  }

  const sub = resolveFromSubmodule(target, ctx);
  if (sub) {
    return {
      root: sub.root,
      source: sub.source,
      warnings: [...warnings, ...sub.warnings],
      lock,
    };
  }

  const npm = resolveFromNpm(target);
  if (npm) return { ...npm, warnings, lock };

  const pathHit = resolveFromPath(target, ctx);
  if (pathHit) {
    return {
      root: pathHit.root,
      source: pathHit.source,
      warnings: [...warnings, ...pathHit.warnings],
      lock,
    };
  }

  const mono = resolveFromMonorepo(target);
  if (mono) return { ...mono, warnings, lock };

  if (opts.allowScriptCwd !== false && fs.existsSync(path.join(KIT_ROOT, 'scripts', 'install.mjs'))) {
    return { root: KIT_ROOT, source: 'script.cwd', warnings, lock };
  }

  throw new Error(HINT);
}
