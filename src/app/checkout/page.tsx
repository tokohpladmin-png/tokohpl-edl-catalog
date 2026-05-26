'use client';

import Link from 'next/link';
import { formatRupiah, useCart } from '@/components/CartProvider';

const bankDetails = {
  bank: 'Bank Central Asia (BCA)',
  accountName: 'TokoHPL',
  accountNumber: 'Please confirm with TokoHPL Admin'
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const whatsappText = encodeURIComponent(
    `Halo TokoHPL, saya ingin checkout pesanan berikut:\n\n${items
      .map((item) => `- ${item.code} | ${item.name} | Qty: ${item.quantity} | ${formatRupiah(item.price)}`)
      .join('\n')}\n\nSubtotal: ${formatRupiah(subtotal)}\n\nMohon informasi pembayaran dan konfirmasi stok.`
  );

  return (
    <main className="bg-[#f6f2ea]">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Checkout</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">
              Manual bank transfer
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              Review your order below. Payment is accepted via manual bank transfer. Please contact TokoHPL after checkout so our team can confirm stock, delivery, and final payment details.
            </p>

            <div className="mt-8 space-y-4">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
                  <p className="font-black text-[#17130f]">Your cart is empty.</p>
                  <Link href="/products" className="mt-5 inline-flex rounded-full bg-[#17130f] px-6 py-3 text-sm font-black text-white">
                    Shop Products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.code} className="flex gap-4 rounded-[1.25rem] border border-stone-200 p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">{item.code}</p>
                      <p className="mt-1 font-black text-[#17130f]">{item.name}</p>
                      <p className="mt-2 text-sm font-bold text-stone-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-[#17130f]">{formatRupiah((item.price || 0) * item.quantity)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] bg-[#17130f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d8cbb9]">Payment Information</p>

            <div className="mt-6 rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm font-bold text-stone-300">Bank</p>
              <p className="mt-1 text-xl font-black">{bankDetails.bank}</p>

              <p className="mt-5 text-sm font-bold text-stone-300">Account Name</p>
              <p className="mt-1 text-xl font-black">{bankDetails.accountName}</p>

              <p className="mt-5 text-sm font-bold text-stone-300">Account Number</p>
              <p className="mt-1 text-lg font-black">{bankDetails.accountNumber}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <p className="font-bold text-stone-300">Subtotal</p>
              <p className="text-2xl font-black">{formatRupiah(subtotal)}</p>
            </div>

            <a
              href={`https://wa.me/628161345224?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className={`mt-6 flex w-full justify-center rounded-full px-6 py-4 text-sm font-black transition ${
                items.length ? 'bg-white text-[#17130f] hover:bg-stone-100' : 'pointer-events-none bg-white/20 text-white/40'
              }`}
            >
              Send Order via WhatsApp
            </a>

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 flex w-full justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              Clear Cart
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
