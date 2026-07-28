#!/usr/bin/env node
/**
 * resolve-node.cmd must export NODE_EXE to callers (SETUP.cmd, install.cmd).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolveCmd = path.join(KIT_ROOT, 'scripts/lib/resolve-node.cmd');
const source = fs.readFileSync(resolveCmd, 'utf8');

assert.match(source, /endlocal\s*&\s*set\s+"NODE_EXE=%NODE_EXE%"/, 'resolve-node.cmd must export NODE_EXE');

if (process.platform === 'win32') {
  const probe = path.join(os.tmpdir(), `gai-resolve-node-probe-${process.pid}.cmd`);
  fs.writeFileSync(
    probe,
    `@echo off\r\ncall "${resolveCmd.replace(/"/g, '""')}"\r\nif errorlevel 1 exit /b 1\r\nif not defined NODE_EXE (echo NODE_MISSING & exit /b 1)\r\necho NODE_OK\r\n`,
    'utf8',
  );
  try {
    const r = spawnSync('cmd.exe', ['/d', '/c', probe], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    assert.match(r.stdout, /NODE_OK/, `stdout: ${r.stdout}`);
  } finally {
    fs.rmSync(probe, { force: true });
  }
}

console.log('OK: resolve-node-cmd.test.mjs');
