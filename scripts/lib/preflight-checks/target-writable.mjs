import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { INSTALL_ERRORS } from '../install-errors.mjs';

/**
 * @param {{ target?: string }} ctx
 */
export function checkTargetWritable(ctx = {}) {
  const target = path.resolve(ctx.target || process.cwd());
  try {
    fs.mkdirSync(target, { recursive: true });
    const probe = path.join(target, `.genetic-ai-write-probe-${process.pid}`);
    fs.writeFileSync(probe, 'ok', 'utf8');
    fs.unlinkSync(probe);
    return {
      id: 'target.writable',
      pass: true,
      severity: 'error',
      hint: target,
    };
  } catch {
    return {
      id: 'target.writable',
      pass: false,
      severity: 'error',
      hint: INSTALL_ERRORS.E_TARGET_NOT_WRITABLE.repair,
    };
  }
}

/**
 * @param {{ target?: string }} ctx
 */
export function checkTargetPathWin(ctx = {}) {
  if (process.platform !== 'win32') {
    return { id: 'target.pathLength', pass: true, severity: 'info', hint: 'n/a' };
  }
  const target = path.resolve(ctx.target || process.cwd());
  const long = target.length > 240;
  return {
    id: 'target.pathLength',
    pass: !long,
    severity: long ? 'warn' : 'info',
    hint: long
      ? 'Path may exceed MAX_PATH; enable Windows long paths or use a shorter path.'
      : `${target.length} chars`,
  };
}

/**
 * @param {{ target?: string }} ctx
 */
export function checkTargetSpaces(ctx = {}) {
  const target = path.resolve(ctx.target || process.cwd());
  const hasSpaces = /\s/.test(target);
  return {
    id: 'target.spaces',
    pass: true,
    severity: 'info',
    hint: hasSpaces ? 'Path contains spaces — use quotes in manual commands.' : 'ok',
  };
}

/**
 * @param {{ target?: string }} ctx
 */
export function checkLockExisting(ctx = {}) {
  const target = path.resolve(ctx.target || process.cwd());
  const lock = path.join(target, '.genetic-ai', 'kit.lock.json');
  if (!fs.existsSync(lock)) {
    return { id: 'lock.existing', pass: true, severity: 'info', hint: 'fresh install' };
  }
  return {
    id: 'lock.existing',
    pass: true,
    severity: 'info',
    hint: 'Existing kit.lock.json — wizard may offer reinstall.',
  };
}
