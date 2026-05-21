/**
 * JWT session validation — attach user to incoming request.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyJwt } from './jwt.js';

export type AuthedRequest = IncomingMessage & { userId?: string };

export function attachAuthMiddleware(
  req: AuthedRequest,
  _res: ServerResponse,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return;
  const token = header.slice(7);
  const payload = verifyJwt(token);
  if (payload?.sub) req.userId = String(payload.sub);
}
