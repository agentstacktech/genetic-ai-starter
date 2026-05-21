import fs from 'node:fs';
import path from 'node:path';
import { PAYLOAD_ROOT } from './paths.mjs';
import { substitute } from './substitute-placeholders.mjs';

/** Never copy to target — merged into .cursorrules by install.mjs */
export const SKIP_COPY_TO_TARGET = new Set([
  '.cursorrules.fragment.md',
  'AGENTS.minimal.md',
  'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md',
]);

const TEXT_EXT = new Set([
  '.md',
  '.mdc',
  '.json',
  '.yml',
  '.yaml',
  '.txt',
  '.sample',
]);

export function copyPayloadFiles({
  targetRoot,
  relativeFiles,
  vars,
  strict = false,
  dryRun = false,
  skipPhilosophy = true,
  forcePhilosophy = false,
  mergePhilosophy = false,
}) {
  const written = [];
  for (const rel of relativeFiles) {
    if (SKIP_COPY_TO_TARGET.has(rel)) continue;

    if (rel.startsWith('philosophy/') && skipPhilosophy && !forcePhilosophy && !mergePhilosophy) {
      continue;
    }
    const src = path.join(PAYLOAD_ROOT, rel);
    const dest = path.join(targetRoot, rel);
    if (!fs.existsSync(src)) throw new Error(`Missing payload file: ${rel}`);

    if (dryRun) {
      written.push(rel);
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (mergePhilosophy && rel.startsWith('philosophy/') && fs.existsSync(dest)) {
      continue;
    }
    if (fs.existsSync(dest) && forcePhilosophy && rel.startsWith('philosophy/')) {
      // overwrite
    } else if (fs.existsSync(dest) && !rel.includes('kit.manifest.stub')) {
      if (!rel.startsWith('.cursor/') && rel !== 'AGENTS.md' && !rel.startsWith('docs/ai/')) {
        continue;
      }
    }

    const ext = path.extname(src);
    if (TEXT_EXT.has(ext)) {
      let content = fs.readFileSync(src, 'utf8');
      content = substitute(content, vars, { strict });
      fs.writeFileSync(dest, content, 'utf8');
    } else {
      fs.copyFileSync(src, dest);
    }
    written.push(rel);
  }
  return written;
}
