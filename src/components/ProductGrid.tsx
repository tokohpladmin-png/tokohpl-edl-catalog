import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, showPromoPricing = false }: { products: Product[]; showPromoPricing?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/80 p-10 text-center shadow-sm">
        <p className="font-bold text-stone-950">No products found</p>
        <p className="mt-2 text-sm text-stone-500">Try searching with another product code, name, collection, or finish.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} showPromoPricing={showPromoPricing} />
      ))}
    </div>
  );
}
