#!/usr/bin/env node
/**
 * Scaffold a domain/subsystem/ADR gene from kit templates.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { substitute } from './lib/substitute-placeholders.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAYLOAD = path.resolve(__dirname, '../payload');

const TEMPLATES = {
  domain: 'philosophy/genes/templates/project.domain.seed.gen1.md',
  subsystem: 'philosophy/genes/templates/subsystem.feature.gen1.md',
  adr: 'philosophy/genes/templates/adr.decision.seed.gen1.md',
};

function parseArgs(argv) {
  const opts = { target: '.', type: null, domain: 'app', subsystem: 'feature', slug: 'decision', strict: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--type') opts.type = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--subsystem') opts.subsystem = argv[++i];
    else if (a === '--slug') opts.slug = argv[++i];
    else if (a === '--no-strict') opts.strict = false;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node new-gene.mjs --target <project> --type domain|subsystem|adr [options]

  --domain app          genetic tag prefix
  --subsystem billing   for type=subsystem
  --slug auth-migration for type=adr (DECISION_SLUG)
  --no-strict           leave {{PLACEHOLDER}} if any remain

Writes under <target>/philosophy/genes/ and prints a Tier 1 map row.`);
      process.exit(0);
    }
  }
  if (!opts.type || !TEMPLATES[opts.type]) {
    console.error('--type required: domain | subsystem | adr');
    process.exit(1);
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function geneFileName(type, domain, subsystem, slug) {
  if (type === 'domain') return `${domain}.project.seed.gen1.md`;
  if (type === 'subsystem') return `${domain}.${subsystem}.feature.gen1.md`;
  return `${domain}.adr.${slug}.gen1.md`;
}

function geneticTag(type, domain, subsystem, slug) {
  if (type === 'domain') return `${domain}.project.seed.gen1`;
  if (type === 'subsystem') return `${domain}.${subsystem}.feature.gen1`;
  return `${domain}.adr.${slug}.gen1`;
}

function tier1Row(tag, relPath, note) {
  return `| \`${tag}\` | [${relPath}](${relPath}) | ${note} |`;
}

function main() {
  const opts = parseArgs(process.argv);
  const templateRel = TEMPLATES[opts.type];
  const src = path.join(PAYLOAD, templateRel);
  if (!fs.existsSync(src)) {
    console.error('Missing template:', src);
    process.exit(1);
  }

  const vars = {
    PROJECT_NAME: path.basename(opts.target),
    DOMAIN: opts.domain,
    SUBSYSTEM: opts.subsystem,
    DECISION_SLUG: opts.slug,
    AGENTSTACK_VERSION: '0.4.11',
  };

  const fileName = geneFileName(opts.type, opts.domain, opts.subsystem, opts.slug);
  const destDir = path.join(opts.target, 'philosophy/genes');
  const dest = path.join(destDir, fileName);
  if (fs.existsSync(dest)) {
    console.error('Already exists:', dest);
    process.exit(1);
  }

  let content = fs.readFileSync(src, 'utf8');
  content = substitute(content, vars, { strict: opts.strict });
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');

  const tag = geneticTag(opts.type, opts.domain, opts.subsystem, opts.slug);
  const rel = `philosophy/genes/${fileName}`;
  console.log('Created:', dest);
  console.log('');
  console.log('Add to docs/ai/AI_NAVIGATION_MAP.md (Tier 1):');
  console.log(tier1Row(tag, rel, 'TODO: one-line when to read'));
  console.log('');
  console.log('Add to philosophy/genes/GENE_INDEX.md if not listed.');
}

main();
