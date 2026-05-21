import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { PAYLOAD_ROOT } from './paths.mjs';

function skillNamesFromPaths(skillRelPaths) {
  const names = new Set();
  for (const rel of skillRelPaths) {
    const m = rel.replace(/\\/g, '/').match(/^\.cursor\/skills\/([^/]+)/);
    if (m) names.add(m[1]);
  }
  return [...names];
}

/**
 * Copy payload/.cursor/skills/<name>/ to project or global Cursor skills dir.
 * Project mode: usually already copied by copyPayloadFiles — use for global only.
 */
export function installSkills(targetRoot, skillRelPaths, { mode = 'project', dryRun = false } = {}) {
  const destRoot =
    mode === 'global'
      ? path.join(os.homedir(), '.cursor', 'skills')
      : path.join(targetRoot, '.cursor', 'skills');

  const installed = [];
  for (const skillName of skillNamesFromPaths(skillRelPaths)) {
    const srcDir = path.join(PAYLOAD_ROOT, '.cursor', 'skills', skillName);
    if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) continue;

    const destDir = path.join(destRoot, skillName);
    if (!dryRun) {
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of fs.readdirSync(srcDir)) {
        const from = path.join(srcDir, file);
        if (fs.statSync(from).isFile()) {
          fs.copyFileSync(from, path.join(destDir, file));
        }
      }
    }
    installed.push({ mode, skill: skillName, dest: destDir });
  }
  return installed;
}
