/** Minimal JWT verify stub for benchmark fixture. */
export function verifyJwt(token: string): { sub?: string } | null {
  if (!token || token === 'invalid') return null;
  return { sub: 'user-benchmark' };
}
