import type { Metadata } from 'next';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';
import { ProductImageZoom } from '@/components/ProductImageZoom';
import { buildProductEnquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatIDR } from '@/lib/utils';
import { getAllProducts, getProductBySlug } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description || `View ${product.name} in the TokoHPL EDL catalog.`
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const enquiryUrl = buildWhatsAppUrl(buildProductEnquiryMessage(product));

  const specs = [
    ['Code', product.code],
    ['Brand', product.brand],
    ['Design', product.design],
    ['Collection', product.collection],
    ['Size', product.size],
    ['Thickness', product.thickness]
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="section-shell py-10 sm:py-14">
      <Link href="/products" className="text-sm font-bold text-stone-500 transition hover:text-stone-950">
        ← Back to products
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
        <ProductImageZoom src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={product.name} />

        <div>
          <p className="eyebrow">{product.brand}</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-5xl">{product.name}</h1>
          <div className="mt-5">
            {product.isPromoItem && typeof product.promoPrice === 'number' ? (
              <>
                <p className="text-sm font-bold text-stone-400 line-through">{formatIDR(product.price)}</p>
                <p className="text-3xl font-black text-stone-950">{formatIDR(product.promoPrice)}</p>
                <p className="mt-2 inline-flex rounded-none bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-900">
                  Promo 5% Off
                </p>
              </>
            ) : (
              <p className="text-3xl font-black text-stone-950">{formatIDR(product.price)}</p>
            )}
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Tax Included | Free Shipping (Java and Bali)</p>
          </div>


          <AddToCartButton product={product} />

          <div className="mt-10 soft-card p-6">
            <h2 className="text-lg font-black text-stone-950">Product details</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label} className="rounded-none bg-stone-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">{label}</dt>
                  <dd className="mt-1 text-sm font-bold text-stone-950">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 rounded-none border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            Note: Actual colours may vary from the colours displayed digitally on your screen. Prior to specification, we recommend to view a physical sample.
          </div>
        </div>
      </div>
    </div>
  );
}
