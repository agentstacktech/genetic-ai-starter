#!/usr/bin/env node
/**
 * Kit skill routing table ↔ cursor-plugin intent-routing.yaml parity.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const yamlPath = path.join(
  root,
  'provided_plugins/cursor-plugin/plugins/agentstack/evals/intent-routing.yaml',
);
const skillPath = path.join(
  root,
  'genetic-ai-starter/payload/.cursor/skills/agentstack-capability-gate/SKILL.md',
);

const KIT_SKILL_ALIASES = {
  'agentstack-data': 'agentstack-8dna-data',
  'agentstack-sdk': 'agentstack-sdk-bootstrap',
};

function parseYamlSkills(text) {
  const skills = new Set();
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*expect_skill:\s*(\S+)/);
    if (m) skills.add(m[1]);
  }
  return skills;
}

function parseSkillTable(text) {
  const skills = new Set();
  for (const line of text.split('\n')) {
    const m = line.match(/\|\s*[^|]+\|\s*`([^`]+)`/);
    if (m) skills.add(m[1]);
  }
  return skills;
}

function main() {
  if (!fs.existsSync(yamlPath)) {
    console.warn('SKIP intent-routing.yaml missing (standalone kit checkout)');
    return;
  }
  const evalSkills = parseYamlSkills(fs.readFileSync(yamlPath, 'utf8'));
  const kitSkills = parseSkillTable(fs.readFileSync(skillPath, 'utf8'));
  const missing = [];
  for (const skill of evalSkills) {
    const mapped = KIT_SKILL_ALIASES[skill] ?? skill;
    if (!kitSkills.has(mapped) && !kitSkills.has(skill)) {
      missing.push(skill);
    }
  }
  if (missing.length) {
    console.error('check-intent-routing-parity FAILED — eval skills missing from kit table:\n' +
      missing.map((s) => `  - ${s}`).join('\n'));
    process.exit(1);
  }
  console.log(`check-intent-routing-parity OK (${evalSkills.size} eval skills)`);
}

main();
