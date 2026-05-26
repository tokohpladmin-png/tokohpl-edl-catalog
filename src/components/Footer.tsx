import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-950 text-white">
      <div className="section-shell grid gap-10 py-12 sm:py-14 md:grid-cols-[1.25fr_0.55fr_0.85fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">tokohpl</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
            tokohpl is an authorized dealer of EDL High Pressure Laminates (HPL) in Indonesia. We are committed to delivering a transparent, professional, and dependable purchasing experience for all our customers.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">Catalog</p>
          <div className="mt-4 grid gap-3 text-sm text-stone-400">
            <Link href="/collections/new-collections" className="hover:text-white">New Collections</Link>
            <Link href="/collections/best-sellers" className="hover:text-white">Best Sellers</Link>
            <Link href="/collections/promo-items" className="hover:text-white">Promo Items</Link>
            <Link href="/collections/woods" className="hover:text-white">Woods</Link>
            <Link href="/collections/patterns" className="hover:text-white">Patterns</Link>
            <Link href="/collections/solids" className="hover:text-white">Solids</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">Contact</p>
          <div className="mt-4 grid gap-1 text-sm leading-7 text-stone-400">
            <p>Phone: 0812 8888 5224 / 0812 1001 5224</p>
            <p>Email: contact@tokohpl.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell py-5 text-xs font-medium text-stone-500">
          Copyright © {new Date().getFullYear()} CV. tokohpl FORMA HUTAMA.
        </div>
      </div>
    </footer>
  );
}
