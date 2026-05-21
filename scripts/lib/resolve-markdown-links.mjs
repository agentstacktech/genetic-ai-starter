import fs from 'node:fs';
import path from 'node:path';

const LINK_RE = /\[[^\]]*\]\(([^)#\s]+)(?:#[^)]*)?\)/g;

/**
 * Resolve relative markdown links from a file; return list of broken targets.
 */
export function findBrokenMarkdownLinks(rootDir, relativeFiles) {
  const broken = [];
  for (const rel of relativeFiles) {
    if (!rel.endsWith('.md') && !rel.endsWith('.mdc')) continue;
    const filePath = path.join(rootDir, rel);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const dir = path.dirname(filePath);
    let m;
    while ((m = LINK_RE.exec(content)) !== null) {
      const target = m[1];
      if (target.startsWith('http://') || target.startsWith('https://')) continue;
      const resolved = path.normalize(path.join(dir, target));
      if (!fs.existsSync(resolved)) {
        broken.push({ file: rel, target, resolved: path.relative(rootDir, resolved) });
      }
    }
  }
  return broken;
}
