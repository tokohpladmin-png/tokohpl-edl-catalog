import { edlProducts } from '@/data/edl-products';
import type { Product } from '@/types/product';
import { getEdlImageUrl, getEdlImageUrlCandidates } from './cloudinary';
import { normalizeCode, slugify, uniq } from './utils';
import { fetchZohoEdlProducts } from './zoho';

export type CollectionGroup = 'new-collections' | 'best-sellers' | 'promo-items' | 'woods' | 'patterns' | 'solids';

const NEW_COLLECTION_CODE_PREFIXES = ['EDL', 'ED'];
const PROMO_MIN_STOCK_ON_HAND = Number(process.env.ZOHO_PROMO_MIN_STOCK_ON_HAND || 10);

const BEST_SELLER_PRODUCT_CODES: string[] = [];

export function isBestSellerProduct(product: Product) {
  const normalizedCode = normalizeCode(product.code);
  return BEST_SELLER_PRODUCT_CODES.some((code) => normalizedCode === normalizeCode(code));
}


export function isNewCollectionProduct(product: Product) {
  const normalizedCode = normalizeCode(product.code);
  return NEW_COLLECTION_CODE_PREFIXES.some((prefix) => normalizedCode.startsWith(normalizeCode(prefix)));
}


export function isPromoItemProduct(product: Product) {
  const stockOnHand = typeof product.stockOnHand === 'number' ? product.stockOnHand : null;
  return stockOnHand !== null && stockOnHand >= PROMO_MIN_STOCK_ON_HAND;
}

function calculatePromoPrice(price?: number | null) {
  if (typeof price !== 'number') return null;
  return Math.round(price * 0.95);
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
  return products.filter((product) => product.active).map(enrichProduct);
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

  return products.filter((product) => {
    const haystack = [
      product.code,
      product.name,
      product.collection,
      product.category,
      product.design,
      product.finish,
      product.size,
      product.colorFamily,
      product.description
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
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
  const codedNewCollections = products.filter(isNewCollectionProduct);
  if (codedNewCollections.length > 0) return toPublicProducts(codedNewCollections);

  const tagged = products.filter((product) => product.badges?.includes('NEW'));
  return toPublicProducts(tagged.length > 0 ? tagged : products.slice(0, 4));
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
  return toPublicProducts(tagged.length > 0 ? tagged : products.slice(0, 4));
}

export async function getProductsByCollectionGroup(group: CollectionGroup) {
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

  if (group === 'woods') {
    return toPublicProducts(products.filter((product) => product.category?.toLowerCase() === 'woods'));
  }

  if (group === 'patterns') {
    return toPublicProducts(products.filter((product) => {
      const category = product.category?.toLowerCase() || '';
      return category === 'patterns' || category === 'saville' || category.includes('protak');
    }));
  }

  return toPublicProducts(products.filter((product) => {
    const category = product.category?.toLowerCase() || '';
    return category === 'solids' || category === 'solids+' || category === 'solid core';
  }));
}


export const EDL_COLLECTION_GROUPS = [
  { slug: 'solid', title: 'Solid', collections: ['Solid'] },
  { slug: 'wood', title: 'Wood', collections: ['Wood'] },
  { slug: 'marble-stone', title: 'Marble | Stone', collections: ['Marble', 'Stone'] },
  { slug: 'pattern-metal', title: 'Pattern | Metal', collections: ['Pattern', 'Metal'] },
  { slug: 'aptico', title: 'Aptico', collections: ['Aptico'] },

  // Backward-compatible direct routes
  { slug: 'marble', title: 'Marble', collections: ['Marble'] },
  { slug: 'stone', title: 'Stone', collections: ['Stone'] },
  { slug: 'pattern', title: 'Pattern', collections: ['Pattern'] },
  { slug: 'metal', title: 'Metal', collections: ['Metal'] }
];

export function getEdlCollectionGroup(slug: string) {
  return EDL_COLLECTION_GROUPS.find((group) => group.slug === slug);
}

export async function getEdlCollectionProducts(slug: string) {
  const group = getEdlCollectionGroup(slug);
  if (!group) return [];

  const products = await getAllProducts();
  const allowedCollections = group.collections.map((collection) => collection.toLowerCase());

  return products.filter((product) =>
    allowedCollections.includes((product.collection || '').toLowerCase())
  );
}
