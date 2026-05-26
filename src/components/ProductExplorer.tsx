'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
import { ProductGrid } from './ProductGrid';

const PRODUCTS_PER_PAGE = 24;

function optionLabel(value: string) {
  return value || 'All';
}

type FilterOptions = {
  collections: string[];
  categories: string[];
  finishes: string[];
  sizes: string[];
  colorFamilies: string[];
};

type ProductExplorerProps = {
  products: Product[];
  filterOptions: FilterOptions;
  showCollectionTabs?: boolean;
  showPromoPricing?: boolean;
};

export function ProductExplorer({ products, filterOptions, showCollectionTabs = true, showPromoPricing = false }: ProductExplorerProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState('');
  const [finish, setFinish] = useState('');
  const [size, setSize] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [query, collection, category, finish, size]);

  const filteredProducts = useMemo(() => {
    let result = searchProducts(products, query);

    if (collection === '__promo-items') result = result.filter((product) => product.isPromoItem);
    else if (collection) result = result.filter((product) => product.collection === collection);
    if (category) result = result.filter((product) => product.category === category);
    if (finish) result = result.filter((product) => product.finish === finish);
    if (size) result = result.filter((product) => product.size === size);

    return result;
  }, [products, query, collection, category, finish, size]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const clearFilters = () => {
    setQuery('');
    setCollection('');
    setCategory('');
    setFinish('');
    setSize('');
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {showCollectionTabs && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            ['All', '/products'],
            ['New Collections', '/collections/new-collections'],
            ['Best Sellers', '/collections/best-sellers'],
            ['Promo Items', '/collections/promo-items'],
            ['Woods', '/collections/woods'],
            ['Patterns', '/collections/patterns'],
            ['Solids', '/collections/solids']
          ].map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950">
              {label}
            </Link>
          ))}
        </div>
      )}

      <div className="soft-card p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr_1fr_1fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Collection</span>
            <select value={collection} onChange={(event) => setCollection(event.target.value)} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5">
              <option value="">All collections</option>
              <option value="__promo-items">Promo Items</option>
              {filterOptions.collections.map((item) => <option key={item} value={item}>{optionLabel(item)}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Finish</span>
            <select value={finish} onChange={(event) => setFinish(event.target.value)} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5">
              <option value="">All finishes</option>
              {filterOptions.finishes.map((item) => <option key={item} value={item}>{optionLabel(item)}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5">
              <option value="">All categories</option>
              {filterOptions.categories.map((item) => <option key={item} value={item}>{optionLabel(item)}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Size</span>
            <select value={size} onChange={(event) => setSize(event.target.value)} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5">
              <option value="">All sizes</option>
              {filterOptions.sizes.map((item) => <option key={item} value={item}>{optionLabel(item)}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-500">
          <p>
            <span className="font-bold text-stone-950">{filteredProducts.length}</span> product{filteredProducts.length === 1 ? '' : 's'} found
            {filteredProducts.length > 0 && (
              <span> · Showing <span className="font-bold text-stone-950">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span></span>
            )}
          </p>
          <button type="button" onClick={clearFilters} className="font-bold text-stone-950 hover:underline">
            Clear filters
          </button>
        </div>
      </div>

      <ProductGrid products={paginatedProducts} showPromoPricing={showPromoPricing || collection === '__promo-items'} />

      {filteredProducts.length > PRODUCTS_PER_PAGE && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-stone-700 transition hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((pageNumber) => pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - safePage) <= 2)
            .map((pageNumber, index, visiblePages) => {
              const previousPage = visiblePages[index - 1];
              const showGap = previousPage && pageNumber - previousPage > 1;

              return (
                <span key={pageNumber} className="flex items-center gap-2">
                  {showGap && <span className="px-1 text-sm font-bold text-stone-400">…</span>}
                  <button
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className={`h-11 min-w-11 rounded-full border px-4 text-sm font-black transition ${
                      pageNumber === safePage
                        ? 'border-stone-950 bg-stone-950 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-950'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-stone-700 transition hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
