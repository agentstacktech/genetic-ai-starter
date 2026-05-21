import { createHmac } from 'node:crypto';

/** Signs outbound webhook payloads with SHOP_WEBHOOK_SECRET. */
export function signPayload(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}
