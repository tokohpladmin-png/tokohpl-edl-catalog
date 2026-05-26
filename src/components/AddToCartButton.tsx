'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { useCart } from './CartProvider';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        code: product.code,
        name: product.name,
        slug: product.slug,
        price: product.price ?? null,
        imageUrl: product.imageUrl ?? product.imageUrlCandidates?.[0] ?? null,
        size: product.size ?? null,
        finish: product.finish ?? null
      },
      quantity
    );

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 w-full items-center justify-between rounded-full border border-stone-200 bg-white px-2 sm:w-36">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-black text-[#17130f] transition hover:bg-stone-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm font-black text-[#17130f]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(999, value + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-black text-[#17130f] transition hover:bg-stone-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#17130f] px-6 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-700"
        >
          Add to Cart
        </button>
      </div>

      {added && (
        <p className="mt-3 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
          Info: Added to Cart
        </p>
      )}
    </div>
  );
}
