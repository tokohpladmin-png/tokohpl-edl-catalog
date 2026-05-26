import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  return (
    <main className="bg-[#f6f2ea]">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Cart</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">Use the cart drawer</h1>
          <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
            Your cart is available from the cart icon in the header. Add products to cart, adjust quantity, and proceed to manual bank transfer checkout.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex rounded-full bg-[#17130f] px-6 py-3 text-sm font-black text-white transition hover:bg-stone-700">
              Shop Products
            </Link>
            <Link href="/checkout" className="inline-flex rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-black text-[#17130f] transition hover:bg-stone-50">
              Checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
