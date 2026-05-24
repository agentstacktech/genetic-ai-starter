import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} targetRoot
 */
export function resolveFromMonorepo(targetRoot) {
  if (process.env.AGENTSTACK_MONOREPO !== '1' && process.env.AGENTSTACK_MONOREPO !== 'true') {
    return null;
  }
  const candidates = [
    path.resolve(targetRoot, '..', 'AgentStack', 'genetic-ai-starter'),
    path.resolve(targetRoot, '..', 'genetic-ai-starter'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'scripts', 'install.mjs'))) {
      return {
        root: candidate,
        source: 'monorepo.heuristic',
        warnings: [],
      };
    }
  }
  return null;
}
