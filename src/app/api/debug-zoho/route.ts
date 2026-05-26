import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type ZohoTokenResponse = {
  access_token?: string;
  api_domain?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type ZohoItemsResponse = {
  code?: number;
  message?: string;
  items?: Array<{
    item_id?: string;
    name?: string;
    item_name?: string;
    sku?: string;
    item_code?: string | Record<string, unknown>;
    rate?: number | string;
    sales_rate?: number | string;
    status?: string;
    is_active?: boolean;
    brand?: string;
    description?: string;
  }>;
};

function env(name: string) {
  return process.env[name]?.trim() || '';
}

function mask(value: string) {
  if (!value) return '';
  if (value.length <= 10) return 'SET';
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).join(' ').trim();
  return String(value).trim();
}

async function getAccessToken() {
  const clientId = env('ZOHO_CLIENT_ID');
  const clientSecret = env('ZOHO_CLIENT_SECRET');
  const refreshToken = env('ZOHO_REFRESH_TOKEN');
  const accountsBaseUrl = env('ZOHO_ACCOUNTS_BASE_URL') || env('ZOHO_ACCOUNTS_URL') || 'https://accounts.zoho.com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Zoho OAuth environment variables.');
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  });

  const response = await fetch(`${accountsBaseUrl}/oauth/v2/token`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const raw = await response.text();
  let data: ZohoTokenResponse;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Zoho token response was not JSON. HTTP ${response.status}: ${raw.slice(0, 300)}`);
  }

  if (!response.ok || !data.access_token) {
    throw new Error(`Zoho token failed. HTTP ${response.status}: ${data.error_description || data.error || raw}`);
  }

  return data.access_token;
}

export async function GET() {
  const organizationId = env('ZOHO_BOOKS_ORGANIZATION_ID') || env('ZOHO_ORGANIZATION_ID');
  const booksBaseUrl = env('ZOHO_BOOKS_BASE_URL') || env('ZOHO_API_BASE_URL') || 'https://www.zohoapis.com/books/v3';
  const searchTerm = env('ZOHO_EDL_SEARCH_TERM') || 'EDL';

  const envCheck = {
    ZOHO_ORGANIZATION_ID: organizationId ? mask(organizationId) : '',
    ZOHO_CLIENT_ID: env('ZOHO_CLIENT_ID') ? mask(env('ZOHO_CLIENT_ID')) : '',
    ZOHO_CLIENT_SECRET: env('ZOHO_CLIENT_SECRET') ? 'SET' : '',
    ZOHO_REFRESH_TOKEN: env('ZOHO_REFRESH_TOKEN') ? mask(env('ZOHO_REFRESH_TOKEN')) : '',
    ZOHO_ACCOUNTS_BASE_URL: env('ZOHO_ACCOUNTS_BASE_URL') || env('ZOHO_ACCOUNTS_URL') || '',
    ZOHO_BOOKS_BASE_URL: booksBaseUrl,
    ZOHO_EDL_SEARCH_TERM: searchTerm,
    ZOHO_FETCH_ALL_ACTIVE_ITEMS: env('ZOHO_FETCH_ALL_ACTIVE_ITEMS'),
    ZOHO_MAX_PAGES: env('ZOHO_MAX_PAGES')
  };

  try {
    if (!organizationId) {
      throw new Error('Missing Zoho organization ID.');
    }

    const accessToken = await getAccessToken();

    const url = new URL(`${booksBaseUrl}/items`);
    url.searchParams.set('organization_id', organizationId);
    url.searchParams.set('page', '1');
    url.searchParams.set('per_page', '200');
        url.searchParams.set('search_text', searchTerm);

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    const raw = await response.text();
    let data: ZohoItemsResponse;

    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`Zoho Books response was not JSON. HTTP ${response.status}: ${raw.slice(0, 300)}`);
    }

    if (!response.ok || (data.code !== undefined && data.code !== 0)) {
      throw new Error(`Zoho Books items failed. HTTP ${response.status}. Code ${data.code}. Message: ${data.message || raw}`);
    }

    const items = data.items || [];
    const matchingItems = items.filter((item) => {
      const haystack = [item.name, item.item_name, item.sku, item.item_code, item.brand, item.description]
        .map(normalizeText)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchTerm.toLowerCase());
    });

    return NextResponse.json({
      success: true,
      envCheck,
      rawFirstSearchPageCount: items.length,
      matchingCountFirstSearchPage: matchingItems.length,
      searchTerm,
      firstSearchPageSample: items.slice(0, 10).map((item) => ({
        name: item.name || item.item_name,
        sku: item.sku,
        item_code: normalizeText(item.item_code),
        brand: item.brand,
        rate: item.rate,
        sales_rate: item.sales_rate,
        status: item.status,
        is_active: item.is_active
      })),
      matchingSample: matchingItems.slice(0, 10).map((item) => ({
        name: item.name || item.item_name,
        sku: item.sku,
        item_code: normalizeText(item.item_code),
        brand: item.brand,
        rate: item.rate,
        sales_rate: item.sales_rate,
        status: item.status,
        is_active: item.is_active
      }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        envCheck,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
