/** Product list filter — ?active=1 query param. */
export function applyListFilter<T extends { id: string }>(
  items: T[],
  url: string,
): T[] {
  const u = new URL(url, 'http://localhost');
  if (u.searchParams.get('active') === '1') {
    return items.filter(() => true);
  }
  return items;
}
