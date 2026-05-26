import { NextResponse } from 'next/server';
import { edlProductDetails } from '@/data/edl-product-details';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: edlProductDetails.length,
    sample: edlProductDetails.slice(0, 10)
  });
}
