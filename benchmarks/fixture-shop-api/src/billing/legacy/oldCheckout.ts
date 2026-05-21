/**
 * @deprecated Legacy checkout — do not use for new features.
 * Production checkout flows through catalog + billing/invoices.
 */
export function legacyCheckout(): void {
  throw new Error('deprecated checkout path');
}
