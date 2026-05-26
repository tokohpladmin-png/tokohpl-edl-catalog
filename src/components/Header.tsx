'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const collectionItems = [
  { href: '/collections/solid', label: 'Solid' },
  { href: '/collections/wood', label: 'Wood' },
  { href: '/collections/marble-stone', label: 'Marble | Stone' },
  { href: '/collections/pattern-metal', label: 'Pattern | Metal' },
  { href: '/collections/aptico', label: 'Aptico' }
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
        placeholder="Search code, number, design name, or size"
        aria-label="Search products"
        className="h-11 w-full border border-stone-200 bg-white px-4 pr-12 text-sm font-semibold text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-stone-950 text-sm font-black text-white transition hover:bg-stone-800"
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
      <div className="bg-[#241f1a] px-4 py-2 text-center text-xs font-semibold tracking-[0.04em] text-white sm:text-sm">
        Free shipping Java and Bali
      </div>

      <div className="section-shell">
        <div className="grid gap-3 py-3 lg:grid-cols-[auto_minmax(320px,1fr)_auto] lg:items-center lg:gap-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setIsOpen(false)}>
              <span className="inline-flex h-12 w-12 items-center justify-center bg-stone-950 text-sm font-black tracking-[-0.05em] text-white">
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
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-stone-200 bg-white text-xl font-bold text-stone-950 lg:hidden"
            >
              {isOpen ? '×' : '≡'}
            </button>
          </div>

          <div className="order-3 lg:order-2">
            <HeaderSearch onSearch={() => setIsOpen(false)} />
          </div>

          <nav className="order-2 hidden items-center justify-end gap-6 text-xs font-black uppercase tracking-[0.18em] text-stone-700 lg:order-3 lg:flex">
            <Link href="/" className="transition hover:text-stone-950">Home</Link>
            <Link href="/about" className="transition hover:text-stone-950">About</Link>

            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 uppercase transition hover:text-stone-950"
              >
                Collection <span className="text-[10px]">⌄</span>
              </button>

              <div className="invisible absolute right-0 top-full z-50 w-72 pt-4 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100">
                <div className="border border-stone-200 bg-white p-2 text-left shadow-card">
                  {collectionItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/how-to-order" className="transition hover:text-stone-950">How to Order</Link>
            <Link href="/contact" className="transition hover:text-stone-950">Contact</Link>
          </nav>
        </div>

        {isOpen ? (
          <div className="grid gap-3 border-t border-stone-100 py-4 lg:hidden">
            <div className="grid gap-2 bg-stone-50 p-3">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white">Home</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white">About</Link>
              <p className="px-4 pt-3 text-xs font-black uppercase tracking-[0.2em] text-stone-400">Collection</p>
              {collectionItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/how-to-order" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white">How to Order</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-bold tracking-[0.12em] text-stone-800 hover:bg-white">Contact</Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
