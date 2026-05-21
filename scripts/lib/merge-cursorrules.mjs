import fs from 'node:fs';

export const BEGIN = '<!-- genetic-ai:begin -->';
export const END = '<!-- genetic-ai:end -->';

/**
 * Replace or create the genetic-ai block in .cursorrules.
 * fragmentContent must include BEGIN/END markers unless replaceInnerOnly.
 */
export function mergeCursorrules(targetPath, fragmentContent, { dryRun = false } = {}) {
  let existing = '';
  if (fs.existsSync(targetPath)) {
    existing = fs.readFileSync(targetPath, 'utf8');
  }

  const beginIdx = existing.indexOf(BEGIN);
  const endIdx = existing.indexOf(END);

  let next;
  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    next =
      existing.slice(0, beginIdx) +
      fragmentContent.trim() +
      '\n' +
      existing.slice(endIdx + END.length);
  } else {
    const sep = existing.length && !existing.endsWith('\n') ? '\n\n' : existing.length ? '\n' : '';
    next = existing + sep + fragmentContent.trim() + '\n';
  }

  if (!dryRun) fs.writeFileSync(targetPath, next, 'utf8');
  return next;
}

/**
 * Append markdown inside an existing genetic-ai block (idempotent by snippet).
 */
export function appendInsideCursorrulesBlock(targetPath, appendMarkdown, { dryRun = false } = {}) {
  const snippet = appendMarkdown.trim();
  if (!snippet) return;

  let existing = '';
  if (fs.existsSync(targetPath)) {
    existing = fs.readFileSync(targetPath, 'utf8');
  }

  const beginIdx = existing.indexOf(BEGIN);
  const endIdx = existing.indexOf(END);

  let next;
  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    const inner = existing.slice(beginIdx + BEGIN.length, endIdx);
    if (inner.includes(snippet)) {
      return existing;
    }
    next =
      existing.slice(0, endIdx) + '\n' + snippet + '\n' + existing.slice(endIdx);
  } else {
    const block = `${BEGIN}\n${snippet}\n${END}`;
    const sep = existing.length && !existing.endsWith('\n') ? '\n\n' : existing.length ? '\n' : '';
    next = existing + sep + block + '\n';
  }

  if (!dryRun) fs.writeFileSync(targetPath, next, 'utf8');
  return next;
}

export function removeCursorrulesBlock(targetPath, { dryRun = false } = {}) {
  if (!fs.existsSync(targetPath)) return;
  const existing = fs.readFileSync(targetPath, 'utf8');
  const beginIdx = existing.indexOf(BEGIN);
  const endIdx = existing.indexOf(END);
  if (beginIdx === -1 || endIdx === -1) return;
  const next = (existing.slice(0, beginIdx) + existing.slice(endIdx + END.length)).trimEnd() + '\n';
  if (!dryRun) fs.writeFileSync(targetPath, next, 'utf8');
}
