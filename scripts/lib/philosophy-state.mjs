import fs from 'node:fs';
import path from 'node:path';

/**
 * True when target has philosophy/ but profile payload files are missing (broken doc links).
 */
export function isPhilosophyIncomplete(targetRoot, profileFiles) {
  const philFiles = profileFiles.filter((f) => f.startsWith('philosophy/'));
  if (philFiles.length === 0) return false;
  const philDir = path.join(targetRoot, 'philosophy');
  if (!fs.existsSync(philDir)) return false;
  for (const rel of philFiles) {
    if (!fs.existsSync(path.join(targetRoot, rel))) return true;
  }
  return false;
}

/**
 * Decide philosophy copy mode for install.
 */
export function resolvePhilosophyInstallOpts(targetRoot, profileFiles, cli) {
  const exists = fs.existsSync(path.join(targetRoot, 'philosophy'));
  const incomplete = isPhilosophyIncomplete(targetRoot, profileFiles);

  if (cli.forcePhilosophy || cli.mergePhilosophy) {
    return {
      skipPhilosophy: exists && !cli.forcePhilosophy && !cli.mergePhilosophy,
      forcePhilosophy: cli.forcePhilosophy,
      mergePhilosophy: cli.mergePhilosophy,
      autoRepaired: false,
    };
  }

  if (incomplete) {
    return {
      skipPhilosophy: false,
      forcePhilosophy: true,
      mergePhilosophy: false,
      autoRepaired: true,
    };
  }

  const skip = exists;
  return {
    skipPhilosophy: skip,
    forcePhilosophy: false,
    mergePhilosophy: false,
    autoRepaired: false,
  };
}
