import { edlProducts } from '@/data/edl-products';
import type { Product } from '@/types/product';
import { getEdlImageUrl, getEdlImageUrlCandidates } from './cloudinary';
import { normalizeCode, slugify, uniq } from './utils';
import { fetchZohoEdlProducts } from './zoho';

export type CollectionGroup =
  | 'shop'
  | 'new-collections'
  | 'best-sellers'
  | 'promo-items'
  | 'solid'
  | 'solids'
  | 'wood'
  | 'woods'
  | 'marble-stone'
  | 'pattern-metal'
  | 'patterns'
  | 'aptico';

const PROMO_MIN_STOCK_ON_HAND = Number(process.env.ZOHO_PROMO_MIN_STOCK_ON_HAND || 10);

const BEST_SELLER_PRODUCT_CODES: string[] = [];

function isExcludedAccessoryProduct(product: Product) {
  const text = [product.code, product.name, product.description, product.category, product.collection]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    text.includes('abs edging') ||
    text.includes('edl abs edging') ||
    text.includes('edge banding') ||
    text.includes('edgebanding') ||
    text.includes('edging w') ||
    text.includes('w23mm') ||
    text.includes('x t1.0mm') ||
    text.includes('23*1') ||
    text.includes('23 x 1')
  );
}

function calculatePromoPrice(price?: number | null) {
  if (typeof price !== 'number') return null;
  return Math.round(price * 0.95);
}

export function normalizeCollectionGroup(value?: string | null) {
  const normalized = (value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (['shop', 'all', 'products'].includes(normalized)) return 'shop';
  if (['solid', 'solids', 'solids-plus', 'solid-core', 'plain-colours', 'plain-colors'].includes(normalized)) return 'solid';
  if (['wood', 'woods', 'woodgrain', 'woodgrains'].includes(normalized)) return 'wood';
  if (['marble-stone', 'marble-and-stone', 'marble', 'stone', 'stones'].includes(normalized)) return 'marble-stone';
  if (['pattern-metal', 'pattern-and-metal', 'patterns', 'pattern', 'metal', 'metals', 'saville', 'protak'].includes(normalized)) return 'pattern-metal';
  if (['aptico'].includes(normalized)) return 'aptico';
  if (['promo-items', 'promo', 'discount', 'discounts'].includes(normalized)) return 'promo-items';
  if (['new-collections', 'new'].includes(normalized)) return 'new-collections';
  if (['best-sellers', 'bestsellers', 'best-seller'].includes(normalized)) return 'best-sellers';

  return normalized;
}

export function isBestSellerProduct(product: Product) {
  const normalizedCode = normalizeCode(product.code);
  return BEST_SELLER_PRODUCT_CODES.some((code) => normalizedCode === normalizeCode(code));
}

export function isNewCollectionProduct(product: Product) {
  return product.badges?.includes('NEW') || false;
}

export function isPromoItemProduct(product: Product) {
  const stockOnHand = typeof product.stockOnHand === 'number' ? product.stockOnHand : null;
  return stockOnHand !== null && stockOnHand >= PROMO_MIN_STOCK_ON_HAND;
}

function enrichProduct(product: Product): Product {
  const isPromoItem = isPromoItemProduct(product);
  const badges = new Set(product.badges || []);
  const imageUrlCandidates = product.imageUrlCandidates?.length
    ? product.imageUrlCandidates
    : getEdlImageUrlCandidates(product.code);

  return {
    ...product,
    slug: product.slug || slugify(`${product.code} ${product.name}`),
    imageUrl: product.imageUrl || imageUrlCandidates[0] || getEdlImageUrl(product.code),
    imageUrlCandidates,
    isPromoItem,
    promoPrice: isPromoItem ? calculatePromoPrice(product.price) : product.promoPrice || null,
    badges: Array.from(badges)
  };
}

function toPublicProduct(product: Product): Product {
  const { stockOnHand: _stockOnHand, unit: _unit, ...publicProduct } = product;
  return publicProduct;
}

function toPublicProducts(products: Product[]) {
  return products.map(toPublicProduct);
}

async function getSourceProducts() {
  try {
    const zohoProducts = await fetchZohoEdlProducts();

    if (zohoProducts && zohoProducts.length > 0) {
      return zohoProducts;
    }
  } catch (error) {
    console.error('Zoho product fetch failed. Falling back to local starter data.', error);
  }

  return edlProducts;
}

export async function getAllProducts() {
  const products = await getSourceProducts();
  return products.filter((product) => product.active).filter((product) => !isExcludedAccessoryProduct(product)).map(enrichProduct);
}

export async function getPublicProducts() {
  return toPublicProducts(await getAllProducts());
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  const product = products.find((product) => product.slug === slug);
  return product ? toPublicProduct(product) : undefined;
}

export async function getProductByCode(code: string) {
  const products = await getAllProducts();
  const normalized = normalizeCode(code);
  const product = products.find((product) => normalizeCode(product.code) === normalized);
  return product ? toPublicProduct(product) : undefined;
}

export async function getFilterOptions() {
  const products = await getAllProducts();

  return {
    collections: uniq(products.map((product) => product.collection).filter(Boolean) as string[]).sort(),
    categories: uniq(products.map((product) => product.category).filter(Boolean) as string[]).sort(),
    finishes: uniq(products.map((product) => product.finish).filter(Boolean) as string[]).sort(),
    sizes: uniq(products.map((product) => product.size).filter(Boolean) as string[]).sort(),
    colorFamilies: uniq(products.map((product) => product.colorFamily).filter(Boolean) as string[]).sort()
  };
}

export function searchProducts(products: Product[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  const queryTokens = normalized
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const compactQuery = normalized.replace(/[^a-z0-9]/g, '');
  const numericQuery = normalized.replace(/[^0-9]/g, '');

  return products.filter((product) => {
    const searchableFields = [
      product.code,
      normalizeCode(product.code),
      product.code?.replace(/[^0-9]/g, ''),
      product.name,
      product.design,
      product.collection,
      product.category,
      product.finish,
      product.size,
      product.size?.replace(/[^0-9]/g, ''),
      product.colorFamily,
      product.description
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const compactHaystack = searchableFields.replace(/[^a-z0-9]/g, '');
    const numericHaystack = searchableFields.replace(/[^0-9]/g, '');

    if (compactQuery && compactHaystack.includes(compactQuery)) return true;
    if (numericQuery && numericHaystack.includes(numericQuery)) return true;

    return queryTokens.every((token) => searchableFields.includes(token) || compactHaystack.includes(token.replace(/[^a-z0-9]/g, '')));
  });
}


function sortPromoItems(products: Product[]) {
  return [...products].sort((a, b) => {
    const stockDifference = (b.stockOnHand || 0) - (a.stockOnHand || 0);
    if (stockDifference !== 0) return stockDifference;
    return a.name.localeCompare(b.name);
  });
}

export async function getNewCollectionProducts() {
  const products = await getAllProducts();
  const tagged = products.filter((product) => product.badges?.includes('NEW'));

  if (tagged.length > 0) return toPublicProducts(tagged);

  return toPublicProducts(products.slice(0, 8));
}

export async function getPromoItemProducts() {
  const products = await getAllProducts();
  return toPublicProducts(sortPromoItems(products.filter(isPromoItemProduct)));
}

export async function getBestSellerProducts() {
  const products = await getAllProducts();
  const productMap = new Map(products.map((product) => [normalizeCode(product.code), product]));
  const rankedBestSellers = BEST_SELLER_PRODUCT_CODES.map((code) => productMap.get(normalizeCode(code))).filter(
    Boolean
  ) as Product[];

  if (rankedBestSellers.length > 0) return toPublicProducts(rankedBestSellers);

  const tagged = products.filter((product) => product.badges?.includes('BESTSELLER'));
  return toPublicProducts(tagged.length > 0 ? tagged : products.slice(0, 8));
}

function matchesGroup(product: Product, targetGroup: string) {
  const productGroups = [
    product.category,
    product.collection,
    product.design,
    product.name
  ].map(normalizeCollectionGroup);

  return productGroups.includes(targetGroup);
}

export async function getProductsByCollectionGroup(group: CollectionGroup) {
  if (group === 'shop') {
    return getPublicProducts();
  }

  if (group === 'new-collections') {
    return getNewCollectionProducts();
  }

  if (group === 'best-sellers') {
    return getBestSellerProducts();
  }

  if (group === 'promo-items') {
    return getPromoItemProducts();
  }

  const products = await getAllProducts();
  const targetGroup = normalizeCollectionGroup(group);

  return toPublicProducts(products.filter((product) => matchesGroup(product, targetGroup)));
}
