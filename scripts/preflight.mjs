#!/usr/bin/env node
/**
 * Read-only preflight before install (B1).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from './lib/paths.mjs';
import { runAllPreflightChecks, preflightOk } from './lib/preflight-checks/index.mjs';
import { formatInstallError, InstallError } from './lib/install-errors.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = process.cwd();
  let kitRoot = KIT_ROOT;
  let quick = false;
  let json = false;
  let launcher = null;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') target = argv[++i];
    else if (a === '--kit-root') kitRoot = argv[++i];
    else if (a === '--quick') quick = true;
    else if (a === '--json') json = true;
    else if (a === '--launcher') launcher = argv[++i];
    else if (a === '--help') {
      console.log(`Usage: node preflight.mjs [--target <path>] [--kit-root <kit>] [--quick] [--json] [--launcher <name>]`);
      process.exit(0);
    }
  }
  if (launcher) process.env.GENETIC_AI_LAUNCHER = launcher;
  return {
    target: path.resolve(target),
    kitRoot: path.resolve(kitRoot),
    quick,
    json,
  };
}

function main() {
  const opts = parseArgs(process.argv);
  const checks = runAllPreflightChecks({
    quick: opts.quick,
    target: opts.target,
    kitRoot: opts.kitRoot,
  });
  const ok = preflightOk(checks);
  const report = { ok, checks, target: opts.target, kitRoot: opts.kitRoot };

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const c of checks) {
      const mark = c.pass ? 'OK' : c.severity === 'warn' ? 'WARN' : 'FAIL';
      console.log(`[${mark}] ${c.id}: ${c.hint}`);
    }
    if (!ok) {
      console.error('\nPreflight failed. Fix errors above before install.');
    }
  }

  if (!ok) {
    throw new InstallError('E_PREFLIGHT_FAILED', { phase: 'preflight' });
  }
}

try {
  main();
} catch (e) {
  console.error(formatInstallError(e));
  process.exit(e instanceof InstallError ? e.exitCode : 1);
}
