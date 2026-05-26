import { NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/products';

export const revalidate = 600;

export async function GET() {
  const products = await getPublicProducts();

  return NextResponse.json({
    success: true,
    count: products.length,
    products
  });
}
