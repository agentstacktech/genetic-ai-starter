#!/usr/bin/env node
/**
 * Build doc-search-index.json from genes, indexes, and recipes.
 * Gene: repo.tooling.genetic_starter.agentstack_dx.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT, EXTENSIONS_DIR } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = null;
  let kitRoot = KIT_ROOT;
  let outRel = 'doc-search-index.json';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
    else if (argv[i] === '--out') outRel = argv[++i];
    else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log(`Usage: node build-doc-search-index.mjs [--target <project>] [--kit-root <kit>] [--out <file>]

Default: index kit extension + payload when --target omitted.`);
      process.exit(0);
    }
  }
  return {
    target: target ? path.resolve(target) : null,
    kitRoot: path.resolve(kitRoot),
    outRel,
  };
}

/**
 * @param {string} text
 * @param {number} max
 */
function excerpt(text, max = 240) {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1)}…`;
}

/**
 * @param {string} root
 * @param {string} rel
 */
function addDoc(entries, root, rel, meta = {}) {
  const full = path.isAbsolute(rel) ? rel : path.join(root, rel);
  if (!fs.existsSync(full) || !full.endsWith('.md')) return;
  const text = fs.readFileSync(full, 'utf8');
  const title = text.match(/^#\s+(.+)$/m)?.[1] || path.basename(rel);
  const tag = text.match(/\*\*Genetic tag:\*\*\s+`([a-z0-9_.]+)`/)?.[1];
  const id = rel.replace(/\\/g, '/');
  entries.push({
    id,
    title,
    path: id,
    kind: meta.kind || 'doc',
    tags: tag ? [tag] : meta.tags || [],
    excerpt: excerpt(text),
  });
}

function walkIndexes(root, baseRel, entries) {
  const walk = (dir, relPrefix) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      const rel = relPrefix ? `${relPrefix}/${ent.name}` : ent.name;
      if (ent.isDirectory()) walk(full, rel);
      else if (ent.name === 'AI_INDEX.md') addDoc(entries, root, rel, { kind: 'index' });
    }
  };
  walk(root, baseRel);
}

function indexGenes(projectRoot, relDir, entries) {
  const genesRoot = path.join(projectRoot, relDir);
  if (!fs.existsSync(genesRoot)) return;
  const walk = (dir, prefix) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      const rel = `${prefix}/${ent.name}`.replace(/\\/g, '/');
      if (ent.isDirectory()) walk(full, rel);
      else if (ent.name.endsWith('.gen1.md') && !ent.name.includes('template')) {
        addDoc(entries, projectRoot, rel, { kind: 'gene' });
      }
    }
  };
  walk(genesRoot, relDir);
}

function indexRecipes(projectRoot, relDir, entries) {
  const recipesRoot = path.join(projectRoot, relDir);
  if (!fs.existsSync(recipesRoot)) return;
  for (const ent of fs.readdirSync(recipesRoot, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name.startsWith('_')) continue;
    const readmeRel = `${relDir}/${ent.name}/README.md`;
    if (fs.existsSync(path.join(projectRoot, readmeRel))) {
      addDoc(entries, projectRoot, readmeRel, {
        kind: 'recipe',
        tags: [`recipe.${ent.name}`],
      });
    }
  }
  const catalogRel = `${relDir}/AI_INDEX.md`;
  if (fs.existsSync(path.join(projectRoot, catalogRel))) {
    addDoc(entries, projectRoot, catalogRel, { kind: 'index' });
  }
}

function main() {
  const { target, kitRoot, outRel } = parseArgs(process.argv);
  const entries = [];
  const roots = [];

  if (target) {
    roots.push({ root: target, label: 'target' });
  } else {
    roots.push({ root: path.join(kitRoot, 'payload'), label: 'payload' });
    roots.push({ root: path.join(kitRoot, 'extensions/agentstack'), label: 'extension' });
  }

  for (const { root } of roots) {
    indexGenes(root, 'philosophy/genes', entries);
    walkIndexes(root, '', entries);
    indexRecipes(root, 'recipes', entries);
    indexRecipes(root, 'examples/agentstack', entries);
    const mapPath = path.join(root, 'docs/ai/AI_NAVIGATION_MAP.md');
    if (fs.existsSync(mapPath)) {
      addDoc(entries, root, 'docs/ai/AI_NAVIGATION_MAP.md', { kind: 'map' });
    }
  }

  indexRecipes(kitRoot, 'extensions/agentstack/recipes', entries);
  addDoc(entries, kitRoot, 'extensions/agentstack/recipes/AI_INDEX.md', { kind: 'index' });
  addDoc(entries, kitRoot, 'extensions/agentstack/AI_INDEX.md', { kind: 'index' });

  const seen = new Set();
  const unique = entries.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  const index = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    entryCount: unique.length,
    entries: unique.sort((a, b) => a.id.localeCompare(b.id)),
  };

  const outRoot = target || kitRoot;
  const outPath = path.join(outRoot, outRel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log('Wrote:', outPath);
  console.log(`build-doc-search-index OK (${unique.length} entries)`);
}

main();
