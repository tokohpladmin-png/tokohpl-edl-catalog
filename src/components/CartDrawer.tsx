'use client';

import Link from 'next/link';
import { formatRupiah, useCart } from '@/components/CartProvider';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
    lastAddedName,
    clearLastAdded
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998]">
      <button
        type="button"
        aria-label="Close cart overlay"
        onClick={closeCart}
        className="absolute inset-0 bg-black/40"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Cart</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] text-stone-950">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center border border-stone-200 text-xl font-black text-stone-950"
          >
            ×
          </button>
        </div>

        {lastAddedName ? (
          <div className="border-b border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700">
            Added: <span className="font-black text-stone-950">{lastAddedName}</span>
            <button type="button" onClick={clearLastAdded} className="ml-3 text-xs font-black uppercase tracking-[0.14em] text-stone-500">
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-black text-stone-950">Your cart is empty</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Browse EDL products and add items to your cart.</p>
              <Link href="/products" onClick={closeCart} className="dark-button mt-6 inline-flex">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => {
                const key = item.slug || item.code || item.name || 'item';
                const quantity = item.quantity || 1;

                return (
                  <article key={key} className="border border-stone-200 bg-white p-4">
                    <div className="flex gap-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name || item.code || 'Cart item'} className="h-20 w-20 object-cover" />
                      ) : (
                        <div className="h-20 w-20 bg-stone-100" />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-stone-950">{item.code}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-600">{item.name}</p>
                        <p className="mt-2 text-sm font-black text-stone-950">{formatRupiah(item.price)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        aria-label="Remove item"
                        className="h-9 w-9 border border-stone-200 text-base"
                      >
                        🗑
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex border border-stone-200">
                        <button type="button" onClick={() => updateQuantity(key, quantity - 1)} className="h-9 w-9 border-r border-stone-200 font-black">
                          −
                        </button>
                        <span className="flex h-9 w-12 items-center justify-center text-sm font-black">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(key, quantity + 1)} className="h-9 w-9 border-l border-stone-200 font-black">
                          +
                        </button>
                      </div>

                      <p className="text-sm font-black text-stone-950">{formatRupiah((item.price || 0) * quantity)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-black text-stone-950">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>

          <Link
            href="/checkout"
            onClick={closeCart}
            className="dark-button w-full"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
