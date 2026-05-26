export function normalizeCode(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function formatIDR(value?: number | null) {
  if (typeof value !== 'number') return 'Price to be updated';
  return `Rp. ${value.toLocaleString('id-ID')}`;
}

export function formatIDRTaxIncluded(value?: number | null) {
  if (typeof value !== 'number') return 'Price to be updated';
  return `${formatIDR(value)} Tax included`;
}

export function uniq<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}
