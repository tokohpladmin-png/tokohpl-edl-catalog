'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { useCart } from '@/components/CartProvider';

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const finalQuantity = Math.max(1, quantity || 1);

    addItem(
      {
        slug: product.slug,
        code: product.code,
        name: product.name,
        price: product.price ?? null,
        imageUrl: product.imageUrl ?? product.imageUrlCandidates?.[0] ?? null,
        size: product.size ?? null,
        finish: product.finish ?? null
      },
      finalQuantity
    );

    setQuantity(finalQuantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mt-8 grid max-w-xl grid-cols-[148px_1fr] gap-3">
      <div className="flex h-12 border border-stone-200 bg-white">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="flex h-12 w-11 items-center justify-center border-r border-stone-200 text-lg font-black text-stone-950"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <input
          value={quantity}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            setQuantity(Number.isFinite(nextValue) ? Math.max(1, nextValue) : 1);
          }}
          className="h-12 w-full min-w-0 text-center text-sm font-black text-stone-950 outline-none"
          inputMode="numeric"
          aria-label="Quantity"
        />

        <button
          type="button"
          onClick={() => setQuantity((value) => value + 1)}
          className="flex h-12 w-11 items-center justify-center border-l border-stone-200 text-lg font-black text-stone-950"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button type="button" onClick={handleAddToCart} className="dark-button h-12 w-full">
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
