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
