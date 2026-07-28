#!/usr/bin/env node
import assert from 'node:assert/strict';
import { cmdEnvToInstallArgs } from '../scripts/lib/launcher/argv-mapper.mjs';
import { expandEnvPath } from '../scripts/lib/launcher/windows-path.mjs';

const args = cmdEnvToInstallArgs(
  {
    PROFILE: 'full',
    PROJECT_NAME: 'Test App',
    DOMAIN: 'api',
    GITIGNORE: 'full',
  },
  { target: 'C:\\Projects\\App' },
);
assert.ok(args.includes('--profile'));
assert.ok(args.includes('full'));
assert.ok(args.includes('--gitignore-kit'));
assert.equal(expandEnvPath('%TEMP%\\x').includes(process.env.TEMP || '%TEMP%'), true);

console.log('OK: windows-launcher.test.mjs');
