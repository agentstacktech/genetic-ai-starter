import { spawnSync } from 'node:child_process';
import path from 'node:path';

/**
 * Run kit script steps sequentially (sync-smoke, audit-docs, doctor --docs).
 * Gene: repo.tooling.genetic_starter.gen1 · KISS orchestrator — one spawn path.
 *
 * @param {Array<string | [string, string, ...string[]]>} steps
 * @param {{ kitRoot: string, cwd?: string, timing?: boolean, nodePrefix?: string }} opts
 */
export function runKitSteps(steps, opts) {
  const { kitRoot, cwd, timing = false, nodePrefix = '→' } = opts;

  for (const step of steps) {
    const parsed = parseStep(step);
    const script = path.join(kitRoot, parsed.rel);
    const started = Date.now();

    if (timing && parsed.label) {
      console.log(`\n${nodePrefix} ${parsed.label}`);
    } else {
      console.log(
        `\n${nodePrefix} node ${parsed.rel}${parsed.args.length ? ` ${parsed.args.join(' ')}` : ''}`,
      );
    }

    const r = spawnSync(process.execPath, [script, ...parsed.args], {
      cwd: cwd ?? kitRoot,
      stdio: 'inherit',
    });
    const ms = Date.now() - started;

    if (r.status !== 0) {
      const tag = parsed.label ?? parsed.rel;
      console.error(`FAILED ${tag} (${ms}ms)`);
      process.exit(r.status ?? 1);
    }
    if (timing && parsed.label) {
      console.log(`OK ${parsed.label} (${ms}ms)`);
    }
  }
}

/** @param {string | [string, string, ...string[]]} step */
function parseStep(step) {
  if (typeof step === 'string') {
    return { label: null, rel: step, args: [] };
  }
  const [label, rel, ...args] = step;
  return { label, rel, args };
}
