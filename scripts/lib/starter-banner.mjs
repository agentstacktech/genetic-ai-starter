import { readPlatformVersion } from './platform-version.mjs';

/** ASCII banner (E3) — skip in CI / non-TTY. */
export function shouldShowStarterBanner() {
  if (process.env.CI === 'true' || process.env.CI === '1') return false;
  return process.stdout.isTTY === true;
}

export function printStarterBanner() {
  const v = readPlatformVersion();
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   Genetic AI Starter Kit             ║');
  console.log(`  ║   platform ${v.padEnd(24)}║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
}

export function isAgentStackProjectName(name) {
  return typeof name === 'string' && name.trim().toLowerCase() === 'agentstack';
}

export function printAgentStackThanks() {
  console.log('');
  console.log('Thanks for naming the project AgentStack — built with genetic coding.');
  console.log('Public kit: https://github.com/AgentStack/genetic-ai-starter');
  console.log('');
}
