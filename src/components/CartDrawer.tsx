'use client';

import Link from 'next/link';
import { formatRupiah, useCart } from './CartProvider';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

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

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => {
          closeCart();
          clearLastAdded();
        }}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col bg-[#fbfaf7] shadow-2xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8a4f2b]">Cart</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#17130f]">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              closeCart();
              clearLastAdded();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-[#17130f] transition hover:bg-stone-50"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {lastAddedName && (
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4 text-sm font-bold text-emerald-800">
            Added to Cart: {lastAddedName}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-center">
              <p className="text-lg font-black text-[#17130f]">Your cart is empty</p>
              <p className="mt-3 text-sm leading-6 text-stone-500">
                Browse EDL products and add items to your cart before checking out.
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-6 inline-flex rounded-full bg-[#17130f] px-6 py-3 text-sm font-black text-white transition hover:bg-stone-700"
              >
                Shop Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.code} className="rounded-[1.35rem] border border-stone-200 bg-white p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-stone-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">{item.code}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-black leading-5 text-[#17130f]">{item.name}</p>
                      <p className="mt-2 text-sm font-black text-[#17130f]">{formatRupiah(item.price)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-stone-200 bg-[#fbfaf7]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.code, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-lg font-black text-[#17130f]"
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-black text-[#17130f]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.code, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-lg font-black text-[#17130f]"
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.code)}
                      className="text-xs font-black uppercase tracking-[0.16em] text-stone-400 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-stone-500">Subtotal</p>
            <p className="text-xl font-black tracking-[-0.03em] text-[#17130f]">{formatRupiah(subtotal)}</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            Payment is currently accepted via manual bank transfer after checkout.
          </p>

          <Link
            href="/checkout"
            onClick={closeCart}
            className={`mt-5 flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-black transition ${
              items.length
                ? 'bg-[#17130f] text-white hover:bg-stone-700'
                : 'pointer-events-none bg-stone-200 text-stone-400'
            }`}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
