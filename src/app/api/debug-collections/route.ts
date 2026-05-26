import { NextResponse } from 'next/server';
import { EDL_COLLECTION_GROUPS, getAllProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  const products = await getAllProducts();

  const byCollection = products.reduce<Record<string, number>>((acc, product) => {
    const key = product.collection || 'Unclassified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const groups = EDL_COLLECTION_GROUPS.map((group) => ({
    slug: group.slug,
    title: group.title,
    collections: group.collections,
    count: products.filter((product) =>
      group.collections.map((collection) => collection.toLowerCase()).includes((product.collection || '').toLowerCase())
    ).length
  }));

  return NextResponse.json({
    success: true,
    totalProducts: products.length,
    byCollection,
    groups,
    sample: products.slice(0, 20).map((product) => ({
      code: product.code,
      name: product.name,
      collection: product.collection,
      colorFamily: product.colorFamily,
      sizeMm: product.sizeMm
    }))
  });
}
