/**
 * gene: {{DOMAIN}}.{{FEATURE}}.feature.gen1
 * doc: examples/agentstack/{{FEATURE}}/README.md
 * action: scaffold smoke — catalog + capabilities gate
 */
import { catalog, capabilities, ensureScope } from '../../src/lib/agentstack.ts';

async function main(): Promise<void> {
  await ensureScope();
  const cat = catalog();
  const matrix = capabilities();
  console.log('{{FEATURE}} scaffold OK', {
    modules: cat.modules.length,
    platform: matrix.platform.filter((p) => p.enabled !== false).length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
