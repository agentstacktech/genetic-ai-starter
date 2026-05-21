import fs from 'node:fs';
import path from 'node:path';

export function copyTree(src, dest, { filter } = {}) {
  if (!fs.existsSync(src)) throw new Error(`Missing source: ${src}`);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (filter && !filter(s, name)) continue;
    const st = fs.statSync(s);
    if (st.isDirectory()) copyTree(s, d, { filter });
    else fs.copyFileSync(s, d);
  }
}

export function rmTreeIfExists(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}
