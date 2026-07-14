/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/examples/ai/02-validate-manifest.ts
 * action: validate UAM app manifest via @agentstack/sdk/manifest schema
 */
import { appManifestSchema, type AppManifestV1 } from '@agentstack/sdk/manifest';
import { verifyStep } from '../_lib/recipe-common.js';

/** Parity with `validateAppManifest` on main `@agentstack/sdk` export. */
function validateAppManifest(input: unknown) {
  return appManifestSchema.safeParse(input) as {
    success: boolean;
    data?: AppManifestV1;
    error?: unknown;
  };
}

async function main(): Promise<void> {
  const sample = {
    manifest_version: '1' as const,
    app_id: 'recipe-demo',
    name: 'Recipe Demo App',
    version: '1.0.0',
    routes: [{ path: '/', module_id: 'home', props: {} }],
    modules: ['home'],
    capabilities: [] as string[],
  };

  const result = validateAppManifest(sample);
  verifyStep('validateAppManifest', result.success, result.data?.app_id ?? 'invalid');

  const bad = validateAppManifest({ app_id: 'x' });
  verifyStep('validateAppManifest-reject', !bad.success, 'short manifest rejected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
