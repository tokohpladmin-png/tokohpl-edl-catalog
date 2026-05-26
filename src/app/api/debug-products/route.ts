import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const products = await getAllProducts();

    return NextResponse.json({
      success: true,
      count: products.length,
      sample: products.slice(0, 10).map((product) => ({
        code: product.code,
        name: product.name,
        brand: product.brand,
        price: product.price
      }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
