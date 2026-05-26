import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-[#17130f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-3xl font-black tracking-[-0.06em]">TokoHPL</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-stone-300">
            A modern online store for EDL decorative surfaces, built for contractors, interior businesses, and project teams.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Shop</p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-stone-300">
            <Link href="/products" className="hover:text-white">All Products</Link>
            <Link href="/collections/woods" className="hover:text-white">Collections</Link>
            <Link href="/collections/promo-items" className="hover:text-white">Promo Items</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Contact</p>
          <div className="mt-4 text-sm leading-7 text-stone-300">
            <p>T. 0816 1345 224</p>
            <a href="mailto:tokohpl.admin@gmail.com" className="hover:text-white">tokohpl.admin@gmail.com</a>
            <p>tokohpl.com</p>
            <p className="mt-3">Mon - Fri 09.00 - 17.00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs font-semibold text-stone-400">
        Copyright © {year} TokoHPL. All rights reserved.
      </div>
    </footer>
  );
}
