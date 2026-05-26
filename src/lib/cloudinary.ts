const PRODUCT_IMAGES_FOLDER = 'edl-product-images';

export function normalizeCloudinaryProductCode(code: string) {
  return code
    .toLowerCase()
    .trim()
    .replace(/([a-z]+)\s*([0-9])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function productImageUrl(numberCode: string, extension: 'webp' | 'jpg' | 'png') {
  return `https://res.cloudinary.com/varindo/image/upload/${PRODUCT_IMAGES_FOLDER}/${numberCode}.${extension}`;
}

function legacyImageUrl(normalizedCode: string, extension: 'webp' | 'jpg') {
  return `https://res.cloudinary.com/varindo/image/upload/edl/edl-${normalizedCode}.${extension}`;
}

export function getNumberKeysFromProductCode(code: string) {
  const matches = code.toLowerCase().match(/\d{4,5}/g) || [];
  const keys: string[] = [];

  for (const value of matches) {
    keys.push(value);

    if (value.length === 5 && value.startsWith('1')) {
      keys.push(value.slice(1));
    }
  }

  return uniq(keys);
}

export function getEdlImageUrlCandidates(code: string) {
  const normalized = normalizeCloudinaryProductCode(code);
  const numberKeys = getNumberKeysFromProductCode(code);

  const productImageCandidates = numberKeys.flatMap((numberCode) => [
    productImageUrl(numberCode, 'webp'),
    productImageUrl(numberCode, 'jpg'),
    productImageUrl(numberCode, 'png')
  ]);

  const legacyCandidates = [
    legacyImageUrl(normalized, 'webp'),
    legacyImageUrl(normalized, 'jpg')
  ];

  return uniq([...productImageCandidates, ...legacyCandidates]);
}

export function getEdlImageUrl(code: string) {
  return getEdlImageUrlCandidates(code)[0];
}

// Compatibility exports for files still using the previous Varindo/Lamitak names.
export const getLamitakImageUrlCandidates = getEdlImageUrlCandidates;
export const getLamitakImageUrl = getEdlImageUrl;
