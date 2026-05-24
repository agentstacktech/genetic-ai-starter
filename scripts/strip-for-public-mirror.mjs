#!/usr/bin/env node

/**

 * Remove paths that must not appear on the public genetic-ai-starter mirror.

 * Run from kit root on the subtree-split branch (cwd = mirror root).

 *

 * Safety: requires MIRROR_STRIP=1 (set only in release-genetic-ai-starter.yml).

 * Do not run on the AgentStack monorepo working tree.

 */

import fs from 'node:fs';

import path from 'node:path';

import { fileURLToPath } from 'node:url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KIT_ROOT = path.resolve(__dirname, '..');



/**
 * Legacy safety: operator docs must not live under kit subtree.
 * Canonical SoT: docs/genetic-ai-starter-maintainers/ (outside subtree split).
 */
const STRIP_PATHS = ['meta/maintainers'];



function rmRecursive(target) {

  if (!fs.existsSync(target)) return false;

  fs.rmSync(target, { recursive: true, force: true });

  return true;

}



function main() {

  if (process.env.MIRROR_STRIP !== '1') {

    console.error(

      'strip-for-public-mirror: refused — set MIRROR_STRIP=1 on the subtree-split branch (release workflow only).',

    );

    process.exit(1);

  }



  const removed = [];

  for (const rel of STRIP_PATHS) {

    const abs = path.join(KIT_ROOT, rel);

    if (rmRecursive(abs)) removed.push(rel);

  }

  if (!removed.length) {

    console.log('strip-for-public-mirror: nothing to remove (already stripped?)');

    return;

  }

  console.log('strip-for-public-mirror removed:\n' + removed.map((p) => `  - ${p}`).join('\n'));

}



main();

