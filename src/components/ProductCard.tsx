import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatIDR } from '@/lib/utils';
import { ProductImage } from './ProductImage';

export function ProductCard({ product, showPromoPricing = false }: { product: Product; showPromoPricing?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[1.65rem] border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50">
          <ProductImage src={product.imageUrl || ''} imageUrls={product.imageUrlCandidates || []} alt={product.name} />
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 text-stone-950 transition hover:text-amber-800"
        >
          {product.name}
        </Link>
        <div className="mt-3">
          {showPromoPricing && product.isPromoItem && typeof product.promoPrice === 'number' ? (
            <>
              <p className="text-xs font-bold text-stone-400 line-through">{formatIDR(product.price)}</p>
              <p className="text-sm font-extrabold text-stone-950 sm:text-base">{formatIDR(product.promoPrice)}</p>
              <p className="mt-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-900">
                Promo 5% Off
              </p>
            </>
          ) : (
            <p className="text-sm font-extrabold text-stone-950 sm:text-base">{formatIDR(product.price)}</p>
          )}
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">Tax included</p>
        </div>
      </div>
    </article>
  );
}
