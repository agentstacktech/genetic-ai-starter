import path from 'node:path';

/**
 * Canonical kit root from environment (A1).
 * GENETIC_AI_KIT_ROOT is canonical; GENETIC_AI_STARTER_KIT is legacy alias.
 * @returns {string | null}
 */
export function readKitRootEnv() {
  const v =
    process.env.GENETIC_AI_KIT_ROOT?.trim() ||
    process.env.GENETIC_AI_STARTER_KIT?.trim();
  return v ? path.resolve(v) : null;
}
