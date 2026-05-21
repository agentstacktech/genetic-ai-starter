import fs from 'node:fs';
import path from 'node:path';

export const GITIGNORE_BEGIN = '# genetic-ai-starter:begin';
export const GITIGNORE_END = '# genetic-ai-starter:end';

/**
 * Replace or append the genetic-ai-starter block in .gitignore (project root).
 */
export function mergeGitignoreBlock(targetRoot, blockContent, { dryRun = false } = {}) {
  const targetPath = path.join(targetRoot, '.gitignore');
  let existing = '';
  if (fs.existsSync(targetPath)) {
    existing = fs.readFileSync(targetPath, 'utf8');
  }

  const beginIdx = existing.indexOf(GITIGNORE_BEGIN);
  const endIdx = existing.indexOf(GITIGNORE_END);
  const block = blockContent.trim() + '\n';

  let next;
  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    next = existing.slice(0, beginIdx) + block + existing.slice(endIdx + GITIGNORE_END.length);
  } else {
    const sep = existing.length && !existing.endsWith('\n') ? '\n\n' : existing.length ? '\n' : '';
    next = existing + sep + block;
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, next.replace(/\n{3,}/g, '\n\n'), 'utf8');
  }
  return next;
}

export function removeGitignoreBlock(targetRoot, { dryRun = false } = {}) {
  const targetPath = path.join(targetRoot, '.gitignore');
  if (!fs.existsSync(targetPath)) return;

  const existing = fs.readFileSync(targetPath, 'utf8');
  const beginIdx = existing.indexOf(GITIGNORE_BEGIN);
  const endIdx = existing.indexOf(GITIGNORE_END);
  if (beginIdx === -1 || endIdx === -1) return;

  let next = existing.slice(0, beginIdx) + existing.slice(endIdx + GITIGNORE_END.length);
  next = next.replace(/\n{3,}/g, '\n\n').trimEnd();
  if (next) next += '\n';

  if (!dryRun) fs.writeFileSync(targetPath, next, 'utf8');
}
