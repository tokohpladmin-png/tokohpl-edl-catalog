import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-950 text-white">
      <div className="section-shell grid gap-10 py-12 sm:py-14 md:grid-cols-[1.25fr_0.55fr_0.85fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">TokoHPL</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
            A modern online store for EDL decorative surfaces, built for contractors, interior businesses, and project teams.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">Quick Links</p>
          <div className="mt-4 grid gap-3 text-sm text-stone-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/products" className="hover:text-white">Collections</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-300">Contact</p>
          <div className="mt-4 grid gap-1 text-sm leading-7 text-stone-400">
            <p>T. 0816 1345 224</p>
            <p>
              <a href="mailto:tokohpl.admin@gmail.com" className="hover:text-white">tokohpl.admin@gmail.com</a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell py-5 text-xs font-medium text-stone-500">
          Copyright © {new Date().getFullYear()} TokoHPL.
        </div>
      </div>
    </footer>
  );
}
