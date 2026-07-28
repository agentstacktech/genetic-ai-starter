/**
 * Map CMD environment variables to install.mjs CLI args (C1).
 * @param {Record<string, string | undefined>} env
 * @param {{ target?: string, extraArgs?: string[] }} [opts]
 * @returns {string[]}
 */
export function cmdEnvToInstallArgs(env, opts = {}) {
  const target = opts.target ?? env.TARGET ?? '.';
  const args = ['--target', target];

  const profile = env.PROFILE || 'standard';
  args.push('--profile', profile);

  const projectName = env.PROJECT_NAME || 'My Project';
  args.push('--project-name', projectName);

  const domain = env.DOMAIN || 'app';
  args.push('--domain', domain);

  if (env.STRICT !== '0') args.push('--strict');
  if (env.GITIGNORE === 'full') args.push('--gitignore-kit', 'full');
  if (env.WITH_AGENTSTACK === '1') args.push('--with-agentstack');
  if (env.REPAIR === '1' || env.FORCE_PHILOSOPHY === '1') args.push('--force-philosophy');

  if (opts.extraArgs?.length) args.push(...opts.extraArgs);
  return args;
}

/**
 * @param {Record<string, string | undefined>} env
 * @param {string} target
 */
export function cmdEnvToRepairArgs(env, target) {
  return cmdEnvToInstallArgs(env, {
    target,
    extraArgs: ['--force-philosophy'],
  });
}
