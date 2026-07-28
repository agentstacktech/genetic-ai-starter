/**
 * Structured install error codes + repair hints (B3).
 * @typedef {{ code: string, message: string, repair: string, phase?: string, exitCode?: number }} InstallErrorInfo
 */

/** @type {Record<string, Omit<InstallErrorInfo, 'code'>>} */
export const INSTALL_ERRORS = {
  E_NODE_MISSING: {
    message: 'Node.js not found in PATH.',
    repair: 'Install Node.js 18+ from https://nodejs.org or run: winget install OpenJS.NodeJS.LTS',
    exitCode: 2,
  },
  E_NODE_VERSION: {
    message: 'Node.js 18+ required.',
    repair: 'Upgrade Node from https://nodejs.org (current version too old for ESM install scripts).',
    exitCode: 2,
  },
  E_TARGET_IS_KIT: {
    message: 'Cannot install into the kit vendor folder.',
    repair: 'Re-run the wizard and choose your app project directory (e.g. C:\\Projects\\MyApp), not the kit folder.',
    exitCode: 3,
  },
  E_TARGET_INSIDE_KIT: {
    message: 'Target path is inside the kit tree.',
    repair: 'Choose a project folder outside genetic-ai-starter.',
    exitCode: 3,
  },
  E_TARGET_LOOKS_LIKE_KIT: {
    message: 'Target looks like a kit root (KIT_MANIFEST.json present).',
    repair: 'Pick your consumer app directory, not another kit copy.',
    exitCode: 3,
  },
  E_KIT_NOT_FOUND: {
    message: 'Kit root not found (install.mjs missing).',
    repair: 'Set GENETIC_AI_KIT_ROOT or run from the kit folder / use SETUP.cmd.',
    exitCode: 2,
  },
  E_PLATFORM_VERSION: {
    message: 'Cannot resolve platform version from kit.',
    repair: 'Update kit; ensure PLATFORM_VERSION exists or set AGENTSTACK_CORE_VERSION.',
    exitCode: 2,
  },
  E_PS_POLICY: {
    message: 'PowerShell execution policy blocked the script.',
    repair: 'Use SETUP.cmd or: node scripts/install.mjs --target <path> (no PowerShell required).',
    exitCode: 2,
  },
  E_PROFILE_UNKNOWN: {
    message: 'Unknown install profile.',
    repair: 'See profiles/*.json or run: node scripts/init.mjs',
    exitCode: 2,
  },
  E_PREFLIGHT_FAILED: {
    message: 'Preflight checks failed.',
    repair: 'Run: node scripts/preflight.mjs --target <path> for details.',
    exitCode: 2,
  },
  E_NO_TTY: {
    message: 'Interactive input unavailable (no TTY).',
    repair: 'Use non-interactive flags: node scripts/init.mjs --yes --target <path> --profile standard --project-name "App" --domain app',
    exitCode: 1,
  },
  E_TARGET_NOT_WRITABLE: {
    message: 'Target directory is not writable.',
    repair: 'Choose a writable path or run terminal as user with write access.',
    exitCode: 2,
  },
};

export class InstallError extends Error {
  /**
   * @param {string} code
   * @param {{ message?: string, repair?: string, phase?: string, details?: string }} [extra]
   */
  constructor(code, extra = {}) {
    const def = INSTALL_ERRORS[code] || {
      message: code,
      repair: 'See meta/docs/TROUBLESHOOTING.md',
      exitCode: 1,
    };
    const message = extra.message || def.message;
    super(extra.details ? `${message} (${extra.details})` : message);
    this.name = 'InstallError';
    this.code = code;
    this.repair = extra.repair || def.repair;
    this.phase = extra.phase;
    this.exitCode = def.exitCode ?? 1;
  }
}

/**
 * @param {InstallError | Error} err
 * @returns {string}
 */
export function formatInstallError(err) {
  if (err instanceof InstallError) {
    return `[${err.code}] ${err.message}\nRepair: ${err.repair}`;
  }
  return err.message || String(err);
}

/**
 * @param {InstallError | Error} err
 * @returns {never}
 */
export function exitWithInstallError(err) {
  console.error(formatInstallError(err));
  const code = err instanceof InstallError ? err.exitCode : 1;
  process.exit(code ?? 1);
}
