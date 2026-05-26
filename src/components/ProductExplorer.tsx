'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';

type ProductExplorerProps = {
  products: Product[];
  filterOptions?: {
    collections?: string[];
    categories?: string[];
    finishes?: string[];
    sizes?: string[];
    colorFamilies?: string[];
  };
};

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

export function ProductExplorer({ products, filterOptions }: ProductExplorerProps) {
  const [search, setSearch] = useState('');
  const [sizeMm, setSizeMm] = useState('All');
  const [category, setCategory] = useState('All');
  const [collection, setCollection] = useState('All');

  const sizeOptions = useMemo(() => uniqueSorted(filterOptions?.sizes?.length ? filterOptions.sizes : products.map((product) => product.sizeMm)), [filterOptions?.sizes, products]);
  const categoryOptions = useMemo(() => uniqueSorted(filterOptions?.colorFamilies?.length ? filterOptions.colorFamilies : products.map((product) => product.colorFamily)), [filterOptions?.colorFamilies, products]);
  const collectionOptions = useMemo(() => uniqueSorted(filterOptions?.collections?.length ? filterOptions.collections : products.map((product) => product.collection)), [filterOptions?.collections, products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const haystack = [
        product.code,
        product.name,
        product.design,
        product.designName,
        product.collection,
        product.colorFamily,
        product.sizeMm
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);
      const matchesSize = sizeMm === 'All' || product.sizeMm === sizeMm;
      const matchesCategory = category === 'All' || product.colorFamily === category;
      const matchesCollection = collection === 'All' || product.collection === collection;

      return matchesSearch && matchesSize && matchesCategory && matchesCollection;
    });
  }, [products, search, sizeMm, category, collection]);

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search code, design, collection..."
            className="rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold text-[#17130f] outline-none focus:border-[#17130f]"
          />

          <select
            value={collection}
            onChange={(event) => setCollection(event.target.value)}
            className="rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-bold text-[#17130f] outline-none focus:border-[#17130f]"
          >
            <option value="All">All Collections</option>
            {collectionOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={sizeMm}
            onChange={(event) => setSizeMm(event.target.value)}
            className="rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-bold text-[#17130f] outline-none focus:border-[#17130f]"
          >
            <option value="All">All Sizes</option>
            {sizeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-bold text-[#17130f] outline-none focus:border-[#17130f]"
          >
            <option value="All">All Categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm font-bold text-stone-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
