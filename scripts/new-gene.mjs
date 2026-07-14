#!/usr/bin/env node
/**
 * @deprecated Use scaffold.mjs --generator subsystem|adr
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const forwarded = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--type') {
    const t = process.argv[++i];
    forwarded.push('--generator', t === 'domain' ? 'subsystem' : t);
  } else if (a === '--subsystem') {
    forwarded.push('--name', process.argv[++i]);
  } else if (a === '--slug') {
    forwarded.push('--slug', process.argv[++i]);
  } else forwarded.push(a);
}

const r = spawnSync(process.execPath, [path.join(__dirname, 'scaffold.mjs'), '--skip-verify', ...forwarded], {
  stdio: 'inherit',
});
process.exit(r.status ?? 1);
