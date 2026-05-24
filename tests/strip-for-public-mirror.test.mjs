#!/usr/bin/env node
/**
 * strip-for-public-mirror.mjs must refuse without MIRROR_STRIP=1.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const SCRIPT = path.join(KIT_ROOT, 'scripts/strip-for-public-mirror.mjs');
const MAINTAINERS_DOCS = path.join(KIT_ROOT, '..', 'docs', 'genetic-ai-starter-maintainers');
const KIT_MAINTAINERS = path.join(KIT_ROOT, 'meta/maintainers');

assert.ok(fs.existsSync(MAINTAINERS_DOCS), 'docs/genetic-ai-starter-maintainers must exist in monorepo');
assert.ok(!fs.existsSync(KIT_MAINTAINERS), 'meta/maintainers must not exist under kit (use docs/ path)');

const refused = spawnSync(process.execPath, [SCRIPT], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
  env: { ...process.env, MIRROR_STRIP: undefined },
});
assert.notEqual(refused.status, 0, 'expected non-zero without MIRROR_STRIP');
assert.match(refused.stderr + refused.stdout, /refused/i);

const tmp = fs.mkdtempSync(path.join(KIT_ROOT, '.strip-test-'));
try {
  const miniMaintainers = path.join(tmp, 'meta/maintainers');
  fs.mkdirSync(miniMaintainers, { recursive: true });
  fs.writeFileSync(path.join(miniMaintainers, 'probe.txt'), 'x\n');
  const miniScript = path.join(tmp, 'scripts');
  fs.mkdirSync(miniScript, { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(miniScript, 'strip-for-public-mirror.mjs'));

  const ok = spawnSync(process.execPath, [path.join(miniScript, 'strip-for-public-mirror.mjs')], {
    cwd: tmp,
    encoding: 'utf8',
    env: { ...process.env, MIRROR_STRIP: '1' },
  });
  assert.equal(ok.status, 0, ok.stderr || ok.stdout);
  assert.ok(!fs.existsSync(miniMaintainers), 'strip should remove meta/maintainers');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('strip-for-public-mirror.test.mjs OK');
