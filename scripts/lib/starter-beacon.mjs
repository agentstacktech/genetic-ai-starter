/** Community beacon string (E1). Grant-safe; no economy tickers. */
export const STARTER_BEACON_ID = 'starter_map_first_v1';

export const STARTER_BEACON_URL =
  'https://agentstack.tech/?utm_source=genetic-ai-starter&utm_medium=beacon';

export function shouldShowBeacon(argv, env = process.env) {
  if (env.GENETIC_AI_BEACON === '1' || env.GENETIC_AI_BEACON === 'true') return true;
  return argv.includes('--beacon');
}

export function printStarterBeacon() {
  console.log(`beacon:${STARTER_BEACON_ID} ${STARTER_BEACON_URL}`);
}

/**
 * @param {string} kitRoot
 * @param {string} source
 */
export function printKitResolveBeacon(kitRoot, source) {
  const drift = process.env.GENETIC_AI_KIT_DRIFT === '1' ? 'yes' : 'no';
  console.log(`beacon:kit.resolve_root:${kitRoot}`);
  console.log(`beacon:kit.source:${source}`);
  console.log(`beacon:kit.drift:${drift}`);
  if (process.env.GENETIC_AI_KIT_BEACON_JSON === '1') {
    console.log(
      JSON.stringify({
        beacon: 'kit.integration',
        kitRoot,
        source,
        drift: drift === 'yes',
      }),
    );
  }
}
