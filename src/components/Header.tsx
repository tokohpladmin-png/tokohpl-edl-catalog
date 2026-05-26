'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const primaryNavItems = [
  { href: '/products', label: 'SHOP' },
  { href: '/collections/solid', label: 'SOLID' },
  { href: '/collections/wood', label: 'WOOD' },
  { href: '/collections/marble-stone', label: 'MARBLE | STONE' },
  { href: '/collections/pattern-metal', label: 'PATTERN | METAL' },
  { href: '/collections/aptico', label: 'APTICO' }
];

const secondaryNavItems = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' }
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
    <form onSubmit={handleSubmit} className="relative z-50 w-full pointer-events-auto">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search product code or design"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-stone-200 bg-white px-4 pr-12 text-sm font-semibold text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white transition hover:bg-stone-800"
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
        <div className="grid gap-3 py-3 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setIsOpen(false)}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-sm font-black tracking-[-0.05em] text-white">
                TH
              </span>
              <span>
                <span className="block text-2xl font-black tracking-[-0.06em] text-stone-950">TokoHPL</span>
                <span className="block text-[11px] font-black uppercase tracking-[0.32em] text-stone-500">EDL Surfaces</span>
              </span>
            </Link>

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

          <div className="order-3 lg:order-2">
            <HeaderSearch onSearch={() => setIsOpen(false)} />
          </div>

          <nav className="order-2 hidden items-center justify-end gap-5 text-xs font-black tracking-[0.18em] text-stone-700 lg:order-3 lg:flex">
            {secondaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden gap-2 overflow-x-auto border-t border-stone-100 py-3 lg:flex">
          {primaryNavItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'shrink-0 rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] transition',
                index === 0
                  ? 'border-stone-950 bg-stone-950 text-white'
                  : 'border-stone-200 bg-white text-stone-800 hover:border-stone-950 hover:text-stone-950'
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isOpen ? (
          <div className="grid gap-3 border-t border-stone-100 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    'rounded-2xl border px-3 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em]',
                    index === 0 ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-200 bg-white text-stone-800'
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-2 rounded-3xl bg-stone-50 p-3">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="https://wa.me/628161345224" className="dark-button w-full" onClick={() => setIsOpen(false)}>
              Chat with Us
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
