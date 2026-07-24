#!/usr/bin/env node
/**
 * Backstage-style scaffolder — subsystem, agentstack-feature, adr generators.
 * Gene: repo.tooling.genetic_starter.agentstack_dx.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { substitute } from './lib/substitute-placeholders.mjs';
import { PAYLOAD_ROOT, KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersionSafe } from './lib/platform-version.mjs';
import {
  loadNavigationContract,
  validateMarkerRegion,
  appendInsideRegion,
} from './lib/navigation-contract.mjs';
import { validateGeneFile } from './validate-genes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GENE_TEMPLATES = {
  domain: 'philosophy/genes/templates/project.domain.seed.gen1.md',
  subsystem: 'philosophy/genes/templates/subsystem.feature.gen1.md',
  adr: 'philosophy/genes/templates/adr.decision.seed.gen1.md',
};

function parseArgs(argv) {
  const opts = {
    target: '.',
    generator: null,
    name: null,
    domain: 'app',
    slug: null,
    strict: true,
    kitRoot: KIT_ROOT,
    skipVerify: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--generator') opts.generator = argv[++i];
    else if (a === '--name') opts.name = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--slug') opts.slug = argv[++i];
    else if (a === '--kit-root') opts.kitRoot = argv[++i];
    else if (a === '--no-strict') opts.strict = false;
    else if (a === '--skip-verify') opts.skipVerify = true;
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  if (!opts.generator) {
    console.error('--generator required: subsystem | agentstack-feature | adr');
    process.exit(1);
  }
  if (!opts.name) {
    console.error('--name required (subsystem/feature slug or ADR slug for adr)');
    process.exit(1);
  }
  return { ...opts, target: path.resolve(opts.target), kitRoot: path.resolve(opts.kitRoot) };
}

function printHelp() {
  console.log(`Usage: node scaffold.mjs --generator <id> --name <slug> --target <project> [options]

Generators:
  subsystem          gene + Tier 1 map row (tenant region)
  agentstack-feature gene + recipe + AI_INDEX + src/lib stub
  adr                ADR markdown + thin gene

Options:
  --domain app       genetic tag prefix (default app)
  --slug auth-mig    ADR slug override (adr generator; default --name)
  --no-strict        leave unresolved {{PLACEHOLDERS}}
  --skip-verify      skip validate-genes + doctor
  --kit-root <path>  kit root for contract + doctor

Examples:
  node scaffold.mjs --generator subsystem --name billing --target .
  node scaffold.mjs --generator agentstack-feature --name notifications --target .
  node scaffold.mjs --generator adr --name auth-migration --target .`);
}

function toPascal(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function buildVars(opts) {
  const slug = opts.slug || opts.name;
  const feature = opts.name.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
  const platformVersion = readPlatformVersionSafe('0.4.14');
  return {
    PROJECT_NAME: path.basename(opts.target),
    DOMAIN: opts.domain,
    SUBSYSTEM: feature,
    FEATURE: feature,
    FEATURE_PASCAL: toPascal(feature),
    DECISION_SLUG: slug.replace(/[^a-z0-9_-]/gi, '-').toLowerCase(),
    DECISION_TITLE: slug.replace(/[-_]/g, ' '),
    DATE: new Date().toISOString().slice(0, 10),
    AGENTSTACK_VERSION: platformVersion,
    TAG: `${opts.domain}.${feature}.feature.gen1`,
  };
}

function tier1Row(tag, relPath, note) {
  return `| \`${tag}\` | [${relPath}](${relPath}) | ${note} |`;
}

function writeFromTemplate(step, vars, opts) {
  const src = path.join(PAYLOAD_ROOT, step.template);
  if (!fs.existsSync(src)) throw new Error(`Missing template: ${src}`);
  let content = fs.readFileSync(src, 'utf8');
  content = substitute(content, vars, { strict: opts.strict });
  const dest = path.join(opts.target, substitute(step.out, vars, { strict: true }));
  if (fs.existsSync(dest) && !step.overwrite) {
    throw new Error(`Already exists: ${dest}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Created:', dest);
  return dest;
}

function runAppendMarker(step, vars, opts) {
  const contractPath = path.join(opts.kitRoot, 'contracts/NAVIGATION_CONTRACT.v1.json');
  const contract = loadNavigationContract(contractPath);
  const fileRel = step.file;
  const validation = validateMarkerRegion(contract, {
    file: fileRel,
    regionId: step.regionId,
    marker: step.marker,
  });
  if (!validation.ok) {
    console.error(
      `append-marker blocked — register region in contracts/NAVIGATION_CONTRACT.v1.json first:\n  ${validation.error}`,
    );
    process.exit(1);
  }
  const region = validation.region;
  const dest = path.join(opts.target, fileRel);
  if (!fs.existsSync(dest)) {
    console.warn(`append-marker skipped (missing ${fileRel}) — paste Tier 1 row manually`);
    console.warn(substitute(step.content, vars, { strict: opts.strict }));
    return;
  }
  const block = substitute(step.content, vars, { strict: opts.strict });
  const { changed, content } = appendInsideRegion(dest, region, block);
  if (changed) {
    fs.writeFileSync(dest, content, 'utf8');
    console.log(`Appended to ${fileRel} (${region.id})`);
  } else {
    console.log(`Skip append (already present): ${fileRel}`);
  }
}

/** @type {Record<string, { steps: object[] }>} */
const GENERATORS = {
  subsystem: {
    steps: [
      {
        kind: 'copy',
        template: 'philosophy/genes/templates/subsystem.feature.gen1.md',
        out: 'philosophy/genes/{{DOMAIN}}.{{SUBSYSTEM}}.feature.gen1.md',
      },
      {
        kind: 'append-marker',
        file: 'docs/ai/AI_NAVIGATION_MAP.md',
        regionId: 'tenant-tier1',
        content:
          '| `{{DOMAIN}}.{{SUBSYSTEM}}.feature.gen1` | `src/{{SUBSYSTEM}}/` | TODO: one-line when to read |',
      },
    ],
  },
  'agentstack-feature': {
    steps: [
      {
        kind: 'copy',
        template: 'scaffold/templates/agentstack-feature/gene.gen1.md',
        out: 'philosophy/genes/{{DOMAIN}}.{{FEATURE}}.feature.gen1.md',
      },
      {
        kind: 'copy',
        template: 'scaffold/templates/agentstack-feature/recipe.run.ts',
        out: 'examples/agentstack/{{FEATURE}}/run.ts',
      },
      {
        kind: 'copy',
        template: 'scaffold/templates/agentstack-feature/AI_INDEX.md',
        out: 'examples/agentstack/{{FEATURE}}/AI_INDEX.md',
      },
      {
        kind: 'copy',
        template: 'scaffold/templates/agentstack-feature/lib.stub.ts',
        out: 'src/lib/{{FEATURE}}.ts',
      },
      {
        kind: 'append-marker',
        file: 'docs/ai/AI_NAVIGATION_MAP.md',
        regionId: 'tenant-tier1',
        content:
          '| `{{DOMAIN}}.{{FEATURE}}.feature.gen1` | [examples/agentstack/{{FEATURE}}/](examples/agentstack/{{FEATURE}}/) | AgentStack feature scaffold |',
      },
    ],
  },
  adr: {
    steps: [
      {
        kind: 'copy',
        template: 'scaffold/templates/adr/adr.md',
        out: 'docs/ai/adr/{{DECISION_SLUG}}.md',
      },
      {
        kind: 'copy',
        template: 'philosophy/genes/templates/adr.decision.seed.gen1.md',
        out: 'philosophy/genes/{{DOMAIN}}.adr.{{DECISION_SLUG}}.gen1.md',
      },
    ],
  },
};

function runGenerator(opts) {
  const gen = GENERATORS[opts.generator];
  if (!gen) {
    console.error(`Unknown generator: ${opts.generator}`);
    process.exit(1);
  }
  const vars = buildVars(opts);
  if (opts.generator === 'adr' && !opts.slug) {
    vars.DECISION_SLUG = opts.name.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    vars.DECISION_TITLE = opts.name.replace(/[-_]/g, ' ');
  }

  const created = [];
  for (const step of gen.steps) {
    if (step.kind === 'copy' || step.kind === 'substitute') {
      created.push(writeFromTemplate(step, vars, opts));
    } else if (step.kind === 'append-marker') {
      runAppendMarker(step, vars, opts);
    } else {
      throw new Error(`Unknown step kind: ${step.kind}`);
    }
  }

  return { created, vars, generator: opts.generator };
}

function printSubsystemHints(vars) {
  const tag = `${vars.DOMAIN}.${vars.SUBSYSTEM}.feature.gen1`;
  console.log('');
  console.log('Add to philosophy/genes/GENE_INDEX.md if not listed.');
  console.log('Tier 1 row (if append skipped):');
  console.log(tier1Row(tag, `philosophy/genes/${tag}.md`, 'TODO: one-line when to read'));
}

function verifyOutput(opts, createdFiles) {
  const geneFiles = createdFiles.filter((f) => f.endsWith('.gen1.md'));
  if (geneFiles.length) {
    const errors = [];
    const warnings = [];
    for (const file of geneFiles) {
      const { errors: e, warnings: w } = validateGeneFile(file);
      errors.push(...e.map((msg) => `${path.basename(file)}: ${msg}`));
      warnings.push(...w.map((msg) => `${path.basename(file)}: ${msg}`));
    }
    for (const w of warnings) console.warn(`validate-genes WARN: ${w}`);
    if (errors.length) {
      console.error('validate-genes FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
      process.exit(1);
    }
    console.log('validate-genes OK (scaffolded genes)');
  }

  const lockPath = path.join(opts.target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lockPath)) {
    console.warn('scaffold: skip doctor (no .genetic-ai/kit.lock.json — run install first)');
    return;
  }

  const doctor = spawnSync(
    process.execPath,
    [path.join(opts.kitRoot, 'scripts/doctor.mjs'), '--target', opts.target, '--kit-root', opts.kitRoot],
    { encoding: 'utf8', cwd: opts.kitRoot },
  );
  if (doctor.status !== 0) {
    console.error(doctor.stderr || doctor.stdout);
    process.exit(doctor.status ?? 1);
  }
  console.log('doctor OK');
}

function main() {
  const opts = parseArgs(process.argv);
  const { created, vars, generator } = runGenerator(opts);
  if (generator === 'subsystem') printSubsystemHints(vars);
  if (!opts.skipVerify) verifyOutput(opts, created);
  console.log(`scaffold OK (${opts.generator})`);
}

main();
