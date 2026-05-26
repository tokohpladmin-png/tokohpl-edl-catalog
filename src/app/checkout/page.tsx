'use client';

import Link from 'next/link';
import { formatRupiah, useCart } from '@/components/CartProvider';

export const dynamic = 'force-dynamic';

const bankDetails = {
  bank: 'Bank Central Asia (BCA)',
  accountName: 'CV. VARINDO FORMA HUTAMA',
  accountNumber: 'Please confirm with TokoHPL Admin'
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const whatsappText = encodeURIComponent(
    `Halo TokoHPL, saya ingin checkout pesanan berikut:\n\n${items
      .map((item) => {
        const quantity = item.quantity || 1;
        return `- ${item.code || ''} ${item.name || ''}\n  Qty: ${quantity}\n  Subtotal: ${formatRupiah((item.price || 0) * quantity)}`;
      })
      .join('\n\n')}\n\nTotal: ${formatRupiah(subtotal)}\n\nMohon bantu konfirmasi stok, harga final, dan ongkir. Terima kasih.`
  );

  if (items.length === 0) {
    return (
      <main className="section-shell py-16 sm:py-24">
        <div className="bg-white p-8 shadow-card sm:p-12">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-stone-950 sm:text-5xl">Your cart is empty</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Add EDL products to your cart before proceeding to checkout.
          </p>
          <Link href="/products" className="dark-button mt-8 inline-flex">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-shell py-10 sm:py-14">
      <div className="mb-8 bg-white p-6 shadow-card sm:p-10">
        <Link href="/products" className="text-sm font-bold text-stone-500 hover:text-stone-950">
          ← Continue shopping
        </Link>
        <p className="eyebrow mt-8">Checkout</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-stone-950 sm:text-6xl">Review your order</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
          Review your selected items. Final stock availability, pricing, and delivery timing will be confirmed by TokoHPL before payment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-stone-950">Order Summary</h2>

          <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
            {items.map((item) => {
              const quantity = item.quantity || 1;
              const itemKey = item.slug || item.code || item.name || 'item';

              return (
                <div key={itemKey} className="flex items-start justify-between gap-4 py-5">
                  <div>
                    <p className="text-sm font-black text-stone-950">{item.code}</p>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{item.name}</p>
                    <p className="mt-2 text-sm font-bold text-stone-600">Qty: {quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-[#17130f]">
                    {formatRupiah((item.price || 0) * quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-lg font-black text-stone-950">
            <span>Total</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
        </section>

        <aside className="bg-[#241f1a] p-6 text-white shadow-card sm:p-8">
          <p className="eyebrow text-[#d8cbb9]">Next Step</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">Send your order enquiry</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Click the WhatsApp button below to send your cart to TokoHPL. Our team will confirm stock, final price, and delivery details.
          </p>

          <div className="mt-6 border border-white/10 bg-white/5 p-4 text-sm leading-7 text-stone-300">
            <p className="font-black text-white">Payment details</p>
            <p className="mt-2">{bankDetails.bank}</p>
            <p>{bankDetails.accountName}</p>
            <p>{bankDetails.accountNumber}</p>
          </div>

          <a
            href={`https://wa.me/628161345224?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center bg-white px-6 py-3 text-sm font-black text-[#241f1a] transition hover:bg-stone-100"
          >
            Send via WhatsApp
          </a>

          <button
            type="button"
            onClick={clearCart}
            className="mt-3 inline-flex w-full items-center justify-center border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </main>
  );
}
