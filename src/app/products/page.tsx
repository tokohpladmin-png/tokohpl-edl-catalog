import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductExplorer } from '@/components/ProductExplorer';
import { getFilterOptions, getPublicProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'EDL Product Catalog',
  description: 'Search and browse EDL HPL products available through tokohpl in Indonesia.'
};

export default async function ProductsPage() {
  const products = await getPublicProducts();
  const filterOptions = await getFilterOptions();

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="mb-8 rounded-[2rem] bg-stone-950 p-6 text-white shadow-luxury sm:p-10">
        <p className="eyebrow text-amber-300">EDL Catalog</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.045em] text-white sm:text-6xl">Browse collections</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
          Search by product code, design name, collection, finish, color family, or size.
        </p>
      </div>
      <Suspense fallback={<div className="soft-card p-6 text-sm font-medium text-stone-500">Loading catalog...</div>}>
        <ProductExplorer products={products} filterOptions={filterOptions} />
      </Suspense>
    </div>
  );
}
