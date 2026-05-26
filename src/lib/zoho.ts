import type { Product } from '@/types/product';
import { getEdlImageUrl, getEdlImageUrlCandidates } from './cloudinary';
import { findEdlProductDetail } from '@/data/edl-product-details';

type ZohoTokenResponse = {
  access_token?: string;
  api_domain?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
  status?: string;
};

type ZohoItem = {
  item_id?: string;
  name?: string;
  item_name?: string;
  sku?: string;
  item_code?: string | Record<string, unknown>;
  rate?: number | string;
  sales_rate?: number | string;
  purchase_rate?: number | string;
  description?: string;
  unit?: string;
  brand?: string;
  product_type?: string;
  item_type?: string;
  status?: string;
  is_active?: boolean;
  available_stock?: number | string;
  stock_on_hand?: number | string;
  actual_available_stock?: number | string;
};

type ZohoItemsResponse = {
  code?: number;
  message?: string;
  items?: ZohoItem[];
};

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiry = 0;
let cachedProducts: Product[] | null = null;
let cachedProductsAt = 0;

function env(name: string) {
  return process.env[name]?.trim() || '';
}

function getAccountsUrl() {
  return env('ZOHO_ACCOUNTS_BASE_URL') || env('ZOHO_ACCOUNTS_URL') || 'https://accounts.zoho.com';
}

function getBooksBaseUrl() {
  return env('ZOHO_BOOKS_BASE_URL') || env('ZOHO_API_BASE_URL') || 'https://www.zohoapis.com/books/v3';
}

function getOrganizationId() {
  return env('ZOHO_BOOKS_ORGANIZATION_ID') || env('ZOHO_ORGANIZATION_ID');
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).join(' ').trim();
  return String(value).trim();
}

function getItemCode(item: ZohoItem) {
  const candidates = [
    normalizeText(item.item_code),
    normalizeText(item.sku),
    normalizeText(item.name),
    normalizeText(item.item_name)
  ];

  const codePattern = /\b[A-Z]{2,6}\s*-?\s*\d{3,5}[A-Z]{0,4}\b/i;

  for (const candidate of candidates) {
    const match = candidate.match(codePattern);
    if (match) {
      return match[0].replace(/\s*[-]\s*/g, ' ').replace(/\s+/g, ' ').toUpperCase();
    }
  }

  return normalizeText(item.sku || item.item_code || item.name || item.item_name).toUpperCase();
}

function normalizeItemName(item: ZohoItem) {
  return normalizeText(item.name || item.item_name || item.description || item.sku || item.item_code);
}

function isActive(item: ZohoItem) {
  if (typeof item.is_active === 'boolean') return item.is_active;
  const status = normalizeText(item.status).toLowerCase();
  if (!status) return true;
  return ['active', 'enabled'].includes(status);
}

function isEdlItem(item: ZohoItem) {
  const searchTerm = env('ZOHO_EDL_SEARCH_TERM') || 'EDL';
  const haystack = [
    item.name,
    item.item_name,
    item.sku,
    item.item_code,
    item.brand,
    item.description
  ]
    .map(normalizeText)
    .join(' ')
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}


    function isExcludedEdlItem(item: ZohoItem) {
      const haystack = [
        item.name,
        item.item_name,
        item.sku,
        item.item_code,
        item.brand,
        item.description
      ]
        .map(normalizeText)
        .join(' ')
        .toLowerCase();

      const exclusionTerms = [
        'abs edging',
        'abs edge',
        'edging',
        'w23mm',
        't1.0mm',
        '23*1',
        '23 x 1',
        '23x1'
      ];

      return exclusionTerms.some((term) => haystack.includes(term));
    }

    function inferCollection(item: ZohoItem) {
  const text = normalizeItemName(item).toLowerCase();

  if (text.includes('wood') || text.includes('oak') || text.includes('walnut') || text.includes('teak') || text.includes('maple') || text.includes('elm') || text.includes('pine')) {
    return 'Woodgrain';
  }

  if (text.includes('solid') || text.includes('plain') || text.includes('colour') || text.includes('color')) {
    return 'Solid';
  }

  if (text.includes('stone') || text.includes('marble') || text.includes('concrete') || text.includes('metal') || text.includes('mirror') || text.includes('grey')) {
    return 'Pattern';
  }

  return 'Laminate';
}

function inferColorFamily(item: ZohoItem) {
  const text = normalizeItemName(item).toLowerCase();

  if (text.includes('white')) return 'White';
  if (text.includes('black')) return 'Black';
  if (text.includes('grey') || text.includes('gray')) return 'Grey';
  if (text.includes('brown') || text.includes('walnut') || text.includes('teak')) return 'Brown';
  if (text.includes('cream') || text.includes('beige')) return 'Neutral';
  if (text.includes('oak') || text.includes('maple') || text.includes('elm') || text.includes('pine')) return 'Light Wood';

  return 'Neutral';
}

function inferFinish(item: ZohoItem) {
  const text = normalizeItemName(item).toUpperCase();
  const code = getItemCode(item).toUpperCase();

  const combined = `${code} ${text}`;
  const match = combined.match(/\b(HG|SM|MT|M|G|T|S|D|K|XM|XL|NT|ST|SU|MS|RM)\b/);

  return match?.[1] || 'Surface';
}

function inferSize(item: ZohoItem) {
  const text = normalizeItemName(item).toUpperCase();

  if (text.includes("4'X10") || text.includes('4X10') || text.includes('4 X 10')) return "4'X10'";
  if (text.includes("4'X8") || text.includes('4X8') || text.includes('4 X 8')) return "4'X8'";

  return "4'X8'";
}

function inferThickness(item: ZohoItem) {
  const text = normalizeItemName(item).toLowerCase();
  const match = text.match(/(0\.\d+|\d+(?:\.\d+)?)\s*mm/);
  return match ? `${match[1]}mm` : '0.8mm';
}

function calculateWebsitePrice(item: ZohoItem) {
  const rawPrice = toNumber(item.sales_rate ?? item.rate);
  if (rawPrice === null) return null;

  return Math.round(rawPrice * 1.11);
}

function getStockOnHand(item: ZohoItem) {
  return (
    toNumber(item.stock_on_hand) ??
    toNumber(item.actual_available_stock) ??
    toNumber(item.available_stock)
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function getAccessToken() {
  const now = Date.now();

  if (cachedAccessToken && cachedAccessTokenExpiry > now + 60_000) {
    return cachedAccessToken;
  }

  const clientId = env('ZOHO_CLIENT_ID');
  const clientSecret = env('ZOHO_CLIENT_SECRET');
  const refreshToken = env('ZOHO_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Zoho OAuth environment variables.');
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  });

  const response = await fetch(`${getAccountsUrl()}/oauth/v2/token`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = (await response.json()) as ZohoTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Unable to refresh Zoho access token.');
  }

  cachedAccessToken = data.access_token;
  cachedAccessTokenExpiry = now + (data.expires_in || 3600) * 1000;

  return cachedAccessToken;
}

async function fetchItemsPage(page: number, accessToken: string, searchText?: string) {
  const organizationId = getOrganizationId();

  if (!organizationId) {
    throw new Error('Missing Zoho organization ID.');
  }

  const url = new URL(`${getBooksBaseUrl()}/items`);
  url.searchParams.set('organization_id', organizationId);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', '200');

  if (searchText) {
    url.searchParams.set('search_text', searchText);
  }

  const response = await fetch(url.toString(), {
    cache: 'no-store',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`
    }
  });

  const raw = await response.text();
  let data: ZohoItemsResponse;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Zoho Books response was not JSON. HTTP ${response.status}: ${raw.slice(0, 300)}`);
  }

  if (!response.ok || (data.code !== undefined && data.code !== 0)) {
    throw new Error(data.message || `Unable to fetch Zoho Books items. HTTP ${response.status}`);
  }

  return data.items || [];
}

function mapZohoItemToProduct(item: ZohoItem): Product {
  const code = getItemCode(item);
  const name = normalizeItemName(item);
  const price = calculateWebsitePrice(item);
  const stockOnHand = getStockOnHand(item);
  const detail = findEdlProductDetail({
    code,
    name,
    sku: normalizeText(item.sku)
  });

  return {
    slug: slugify(`${code} ${name}`),
    code,
    name,
    brand: 'EDL',
    design: detail?.designName || name,
        designName: detail?.designName || name,
    collection: detail?.collection || inferCollection(item),
    category: detail?.productType || 'Laminate',
        productType: detail?.productType || 'HPL',
    finish: inferFinish(item),
    size: inferSize(item),
        sizeMm: detail?.sizeMm || undefined,
    thickness: detail?.thickness || inferThickness(item),
    colorFamily: detail?.colorFamily || inferColorFamily(item),
    price,
    currency: 'IDR',
    active: isActive(item),
    stockOnHand,
    description: buildProductDescription(item, detail),
    imageUrl: getEdlImageUrl(code),
    imageUrlCandidates: getEdlImageUrlCandidates(code)
  };
}

function buildProductDescription(item: ZohoItem, detail: ReturnType<typeof findEdlProductDetail>) {
  const design = detail?.designName || normalizeItemName(item);
  const productType = detail?.productType || 'HPL';
  const size = detail?.sizeMm ? ` in ${detail.sizeMm}` : '';
  const thickness = detail?.thickness ? ` with ${detail.thickness} thickness` : '';
  const family = detail?.colorFamily ? ` The design is classified under ${detail.colorFamily}.` : '';

  return `${design} is an EDL ${productType} surface material${size}${thickness} for interior and furniture applications.${family}`;
}

function uniqueItems(items: ZohoItem[]) {
  const seen = new Set<string>();
  const result: ZohoItem[] = [];

  for (const item of items) {
    const key = item.item_id || item.sku || getItemCode(item) || normalizeItemName(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

export async function fetchZohoEdlProducts(): Promise<Product[]> {
  const now = Date.now();
  const cacheTtl = Number(env('ZOHO_PRODUCTS_CACHE_TTL_MS') || 600000);

  if (cachedProducts && now - cachedProductsAt < cacheTtl) {
    return cachedProducts;
  }

  const searchTerm = env('ZOHO_EDL_SEARCH_TERM') || 'EDL';
  const maxPages = Number(env('ZOHO_MAX_PAGES') || 100);
  const accessToken = await getAccessToken();
  const allItems: ZohoItem[] = [];

  // First, search Zoho directly for the EDL term.
  // This avoids scanning only early pages filled with other brands.
  for (let page = 1; page <= maxPages; page += 1) {
    const items = await fetchItemsPage(page, accessToken, searchTerm);
    if (!items.length) break;

    allItems.push(...items);
    if (items.length < 200) break;
  }

  // If the direct search returned nothing, scan all pages as fallback.
  if (!allItems.length) {
    for (let page = 1; page <= maxPages; page += 1) {
      const items = await fetchItemsPage(page, accessToken);
      if (!items.length) break;

      allItems.push(...items);
      if (items.length < 200) break;
    }
  }

  const products = uniqueItems(allItems)
    .filter(isActive)
    .filter(isEdlItem)
    .map(mapZohoItemToProduct);

  cachedProducts = products;
  cachedProductsAt = now;

  return products;
}
