'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' }
];

const collectionItems = [
  { href: '/collections/new-collections', label: 'NEW COLLECTIONS' },
  { href: '/collections/best-sellers', label: 'BEST SELLERS' },
  { href: '/collections/promo-items', label: 'PROMO ITEMS' },
  { href: '/collections/woods', label: 'WOODS' },
  { href: '/collections/patterns', label: 'PATTERNS' },
  { href: '/collections/solids', label: 'SOLIDS' }
];

function HeaderSearch({ onSearch }: { onSearch?: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 px-4 pr-12 text-sm font-medium text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:bg-white focus:ring-4 focus:ring-stone-950/5"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-stone-950 text-sm text-white transition hover:bg-stone-800"
      >
        →
      </button>
    </form>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <div className="section-shell">
        <div className="flex min-h-[78px] items-center justify-between gap-3 py-3 lg:gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <img
              src="/varindo-logo-transparent.png"
              alt="CV. tokohpl Forma Hutama"
              style={{ width: '100px' }}
              className="h-auto object-contain"
            />
          </Link>

          <nav className="relative z-40 hidden shrink-0 items-center gap-6 text-xs font-bold tracking-[0.16em] text-stone-700 lg:flex xl:gap-7">
            <Link href="/" className="transition hover:text-stone-950">HOME</Link>
            <div className="group relative py-6">
              <Link href="/products" className="transition hover:text-stone-950">COLLECTIONS</Link>
              <div className="invisible absolute left-1/2 top-full z-[100] w-56 -translate-x-1/2 rounded-3xl border border-stone-200 bg-white p-3 opacity-0 shadow-luxury transition group-hover:visible group-hover:opacity-100">
                {collectionItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-xs font-bold tracking-[0.14em] text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-20 min-w-0 flex-1 sm:max-w-sm lg:max-w-xs xl:max-w-sm">
            <HeaderSearch onSearch={() => setIsOpen(false)} />
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <Link href="https://wa.me/6281288885224" className="dark-button !px-4 !py-2.5">Chat with Us</Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-xl font-bold text-stone-950 lg:hidden"
          >
            {isOpen ? '×' : '≡'}
          </button>
        </div>

        {isOpen ? (
          <div className="grid gap-3 border-t border-stone-100 py-4 lg:hidden">
            <div className="grid gap-2 rounded-3xl bg-stone-50 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white"
              >
                ALL PRODUCTS
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {collectionItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-stone-200 bg-white px-3 py-3 text-center text-[11px] font-bold tracking-[0.1em] text-stone-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="https://wa.me/6281288885224" className="dark-button w-full" onClick={() => setIsOpen(false)}>
              Chat with Us
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
