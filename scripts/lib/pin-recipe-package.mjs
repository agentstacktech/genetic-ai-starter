/**
 * Rewrite @agentstack/sdk dependency in consumer recipe package.json.
 * Gene: repo.platform.sdk.recipes.gen1
 */
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SDK_SUBMODULE = 'vendor/agentstack-sdk';

/**
 * Pin recipes to published npm semver (Flow A — default for kit consumers).
 * @param {string} packageJsonPath
 * @param {string} platformVersion e.g. 0.4.13
 */
export function pinConsumerSdkDependency(packageJsonPath, platformVersion) {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`pinConsumerSdkDependency: missing ${packageJsonPath}`);
  }
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['@agentstack/sdk'] = String(platformVersion).trim();
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return pkg;
}

/**
 * Wire recipes to SDK git submodule via file: (Flow B).
 * @param {string} consumerRoot absolute consumer repo root
 * @param {string} recipesRel e.g. examples/agentstack
 * @param {string} sdkSubmoduleRel e.g. vendor/agentstack-sdk
 */
export function linkRecipesToSdkSubmodule(
  consumerRoot,
  recipesRel = 'examples/agentstack',
  sdkSubmoduleRel = DEFAULT_SDK_SUBMODULE,
  { dryRun = false } = {},
) {
  const packageJsonPath = path.join(consumerRoot, recipesRel, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`linkRecipesToSdkSubmodule: missing ${packageJsonPath}`);
  }
  const coreAbs = path.join(consumerRoot, sdkSubmoduleRel, 'packages/core');
  const recipesDir = path.dirname(packageJsonPath);
  let rel = path.relative(recipesDir, coreAbs).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  const link = `file:${rel}`;

  if (dryRun) {
    return { packageJsonPath, link };
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['@agentstack/sdk'] = link;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return { packageJsonPath, link };
}

/**
 * @param {string} packageJsonPath
 * @returns {boolean}
 */
export function isNpmPinnedSdkDependency(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) return false;
  const spec = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).dependencies?.['@agentstack/sdk'];
  return typeof spec === 'string' && !spec.startsWith('file:');
}
