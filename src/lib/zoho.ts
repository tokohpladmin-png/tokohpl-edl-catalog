import type { Product } from '@/types/product';
import { getEdlImageUrl, getEdlImageUrlCandidates } from './cloudinary';

type ZohoTokenResponse = {
  access_token?: string;
  api_domain?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
  status?: string;
};

type ZohoCustomField = {
  label?: string;
  api_name?: string;
  value?: unknown;
  customfield_id?: string;
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
  custom_fields?: ZohoCustomField[];
};

type ZohoItemsResponse = {
  code?: number;
  message?: string;
  items?: ZohoItem[];
};

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiry = 0;

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

function getCustomFieldText(item: ZohoItem) {
  return (item.custom_fields || [])
    .map((field) => [field.label, field.api_name, field.value].map(normalizeText).join(' '))
    .join(' ');
}

function getFullItemText(item: ZohoItem) {
  return [
    item.name,
    item.item_name,
    item.sku,
    item.item_code,
    item.brand,
    item.product_type,
    item.item_type,
    item.description,
    getCustomFieldText(item)
  ]
    .map(normalizeText)
    .join(' ');
}

function getItemCode(item: ZohoItem) {
  const candidates = [
    normalizeText(item.item_code),
    normalizeText(item.sku),
    normalizeText(item.name),
    normalizeText(item.item_name),
    normalizeText(item.description)
  ];

  const codePattern = /\b[A-Z]{2,8}\s*[-/]?\s*\d{3,5}[A-Z]{0,5}\b/i;

  for (const candidate of candidates) {
    const match = candidate.match(codePattern);
    if (match) {
      return match[0].replace(/[-/]/g, ' ').replace(/\s+/g, ' ').toUpperCase();
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
  const haystack = getFullItemText(item).toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}

function matchAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function inferEdlCollection(item: ZohoItem) {
  const text = getFullItemText(item).toLowerCase();

  if (matchAny(text, ['aptico'])) {
    return 'Aptico';
  }

  if (
    matchAny(text, [
      'marble',
      'stone',
      'granite',
      'slate',
      'concrete',
      'cement',
      'terrazzo',
      'travertine',
      'onyx',
      'limestone',
      'quartz',
      'calacatta',
      'carrara',
      'statuario',
      'sandstone'
    ])
  ) {
    return 'Marble | Stone';
  }

  if (
    matchAny(text, [
      'metal',
      'metallic',
      'aluminium',
      'aluminum',
      'steel',
      'bronze',
      'copper',
      'brass',
      'titanium',
      'pattern',
      'fabric',
      'textile',
      'linen',
      'leather',
      'weave',
      'saville',
      'protak',
      'microcement'
    ])
  ) {
    return 'Pattern | Metal';
  }

  if (
    matchAny(text, [
      'wood',
      'woodgrain',
      'oak',
      'walnut',
      'teak',
      'maple',
      'elm',
      'pine',
      'ash',
      'birch',
      'beech',
      'nogal',
      'noce',
      'cherry',
      'cedar',
      'wenge',
      'larch',
      'hickory',
      'zebrano',
      'ebony',
      'rosewood',
      'acacia',
      'eucalyptus',
      'timber'
    ])
  ) {
    return 'Wood';
  }

  // Treat colour-driven and uncategorised EDL laminates as Solid instead of leaving the collection empty.
  return 'Solid';
}

function inferColorFamily(item: ZohoItem) {
  const text = getFullItemText(item).toLowerCase();

  if (matchAny(text, ['white', 'snow', 'ivory'])) return 'White';
  if (matchAny(text, ['black', 'ebony'])) return 'Black';
  if (matchAny(text, ['grey', 'gray', 'ash', 'slate'])) return 'Grey';
  if (matchAny(text, ['brown', 'walnut', 'teak', 'noce', 'nogal', 'wenge'])) return 'Brown';
  if (matchAny(text, ['cream', 'beige', 'sand', 'taupe'])) return 'Neutral';
  if (matchAny(text, ['oak', 'maple', 'elm', 'pine', 'birch', 'beech'])) return 'Light Wood';
  if (matchAny(text, ['blue', 'navy'])) return 'Blue';
  if (matchAny(text, ['green', 'sage', 'olive'])) return 'Green';
  if (matchAny(text, ['red', 'rose', 'pink'])) return 'Red / Pink';
  if (matchAny(text, ['yellow', 'gold'])) return 'Yellow / Gold';

  return 'Neutral';
}

function inferFinish(item: ZohoItem) {
  const text = getFullItemText(item).toUpperCase();
  const code = getItemCode(item).toUpperCase();

  const combined = `${code} ${text}`;

  const knownFinishes = [
    'HG',
    'SM',
    'MT',
    'MATT',
    'MATTE',
    'GLOSS',
    'TEXTURE',
    'TEX',
    'SUEDE',
    'STONE',
    'WOOD',
    'M',
    'G',
    'T',
    'S',
    'D',
    'K',
    'XM',
    'XL',
    'NT',
    'ST',
    'SU',
    'MS',
    'RM'
  ];

  for (const finish of knownFinishes) {
    if (combined.includes(finish)) return finish;
  }

  return 'Surface';
}

function inferSize(item: ZohoItem) {
  const text = getFullItemText(item).toUpperCase();

  if (text.includes("4'X10") || text.includes('4X10') || text.includes('4 X 10') || text.includes('4FT X 10FT')) return "4'X10'";
  if (text.includes("4'X8") || text.includes('4X8') || text.includes('4 X 8') || text.includes('4FT X 8FT')) return "4'X8'";

  return "4'X8'";
}

function inferThickness(item: ZohoItem) {
  const text = getFullItemText(item).toLowerCase();
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
    .replace(/&/g, ' and ')
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

async function fetchItemsPage(page: number, accessToken: string) {
  const organizationId = getOrganizationId();

  if (!organizationId) {
    throw new Error('Missing Zoho organization ID.');
  }

  const url = new URL(`${getBooksBaseUrl()}/items`);
  url.searchParams.set('organization_id', organizationId);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', '200');

  const response = await fetch(url.toString(), {
    cache: 'no-store',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`
    }
  });

  const data = (await response.json()) as ZohoItemsResponse;

  if (!response.ok || (data.code && data.code !== 0)) {
    throw new Error(data.message || 'Unable to fetch Zoho Books items.');
  }

  return data.items || [];
}

function mapZohoItemToProduct(item: ZohoItem): Product {
  const code = getItemCode(item);
  const name = normalizeItemName(item);
  const price = calculateWebsitePrice(item);
  const stockOnHand = getStockOnHand(item);
  const edlCollection = inferEdlCollection(item);

  return {
    slug: slugify(`${code} ${name}`),
    code,
    name,
    brand: 'EDL',
    design: name,
    collection: edlCollection,
    category: edlCollection,
    finish: inferFinish(item),
    size: inferSize(item),
    thickness: inferThickness(item),
    colorFamily: inferColorFamily(item),
    price,
    currency: 'IDR',
    active: isActive(item),
    stockOnHand,
    description: 'A selected EDL surface material for interior and furniture applications.',
    imageUrl: getEdlImageUrl(code),
    imageUrlCandidates: getEdlImageUrlCandidates(code)
  };
}

export async function fetchZohoEdlProducts(): Promise<Product[]> {
  const fetchAll = (env('ZOHO_FETCH_ALL_ACTIVE_ITEMS') || 'true').toLowerCase() === 'true';
  const maxPages = Number(env('ZOHO_MAX_PAGES') || 20);
  const accessToken = await getAccessToken();

  const allItems: ZohoItem[] = [];

  if (fetchAll) {
    for (let page = 1; page <= maxPages; page += 1) {
      const items = await fetchItemsPage(page, accessToken);

      if (!items.length) break;

      allItems.push(...items);

      if (items.length < 200) break;
    }
  } else {
    const items = await fetchItemsPage(1, accessToken);
    allItems.push(...items);
  }

  const edlItems = allItems.filter(isActive).filter(isEdlItem);

  return edlItems.map(mapZohoItemToProduct);
}
