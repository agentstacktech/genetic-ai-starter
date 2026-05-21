import type { IncomingMessage, ServerResponse } from 'node:http';
import { postJson } from '../lib/httpClient.js';

const RETRY_MS = 5000;

export function registerWebhookRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  if (req.url === '/webhooks/replay' && req.method === 'POST') {
    void deliverWithRetry({ target: 'https://example.com/hook', body: {} });
    res.statusCode = 202;
    res.end('accepted');
    return true;
  }
  return false;
}

export async function deliverWithRetry(payload: {
  target: string;
  body: Record<string, unknown>;
}): Promise<void> {
  try {
    await postJson(payload.target, payload.body);
  } catch {
    setTimeout(() => {
      void postJson(payload.target, payload.body);
    }, RETRY_MS);
  }
}
