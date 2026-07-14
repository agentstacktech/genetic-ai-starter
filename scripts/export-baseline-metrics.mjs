#!/usr/bin/env node
/**
 * Export pre/post DX expansion baseline metrics for README and POST_DX_EXPANSION.md.
 * Gene: repo.tooling.genetic_starter.benchmark.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCapabilitySnapshotHash } from './lib/copy-agentstack-recipes.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function countSkills() {
  const dir = path.join(KIT_ROOT, 'payload/.cursor/skills');
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
}

function countOverlays() {
  const manifest = path.join(KIT_ROOT, 'extensions/agentstack/extension.manifest.json');
  if (!fs.existsSync(manifest)) return 0;
  return (JSON.parse(fs.readFileSync(manifest, 'utf8')).overlays || []).length;
}

function countAgentstackTasks() {
  const p = path.join(KIT_ROOT, 'benchmarks/tasks/agentstack-tasks.json');
  if (!fs.existsSync(p)) return 0;
  return JSON.parse(fs.readFileSync(p, 'utf8')).tasks?.length || 0;
}

function main() {
  const platformVersion = fs.readFileSync(path.join(KIT_ROOT, 'PLATFORM_VERSION'), 'utf8').trim();
  const snap = {
    generatedAt: new Date().toISOString(),
    platformVersion,
    capabilitySnapshotHash: readCapabilitySnapshotHash(KIT_ROOT),
    counts: {
      payloadSkills: countSkills(),
      agentstackOverlays: countOverlays(),
      agentstackTasks: countAgentstackTasks(),
      benchmarkArms: 9,
      shopSyntheticTasks: 14,
    },
    profiles: ['minimal', 'standard', 'full', 'founder', 'agentstack-app'],
  };
  const out = path.join(KIT_ROOT, 'meta/docs/baseline-metrics.snapshot.json');
  fs.writeFileSync(out, `${JSON.stringify(snap, null, 2)}\n`);
  console.log(`wrote ${out}`);
  console.log(JSON.stringify(snap.counts, null, 2));
}

main();
