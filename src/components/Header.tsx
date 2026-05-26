'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';

const collectionLinks = [
  { label: 'Solid', href: '/collections/solid' },
  { label: 'Wood', href: '/collections/wood' },
  { label: 'Marble | Stone', href: '/collections/marble-stone' },
  { label: 'Pattern | Metal', href: '/collections/pattern-metal' },
  { label: 'Aptico', href: '/collections/aptico' }
];

function AccountIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 7h15l-1.5 9h-12L6 7Z" strokeLinejoin="round" />
      <path d="M6 7 5.4 4H3" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Header() {
  const { itemCount, openCart } = useCart();
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fbfaf7]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="TokoHPL Home">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#17130f] text-sm font-black text-white shadow-sm transition group-hover:scale-105">
            TH
          </div>
          <div className="leading-none">
            <p className="text-[1.35rem] font-black tracking-[-0.055em] text-[#17130f]">TokoHPL</p>
            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-stone-500">EDL Surfaces</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/products" className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-stone-700 transition hover:text-[#17130f]">
            Shop
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCollectionsOpen((value) => !value)}
              className="flex items-center gap-2 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-stone-700 transition hover:text-[#17130f]"
              aria-expanded={collectionsOpen}
            >
              Collection
              <span className="text-[0.65rem]">⌄</span>
            </button>

            <div
              className={`absolute left-1/2 top-full mt-5 w-[320px] -translate-x-1/2 rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-2xl transition ${
                collectionsOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <p className="px-3 text-xs font-black uppercase tracking-[0.22em] text-[#8a4f2b]">EDL</p>
              <div className="mt-3 grid gap-1">
                {collectionLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-3 text-sm font-black text-[#17130f] transition hover:bg-[#f6f2ea]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-stone-700 transition hover:text-[#17130f]">
            About
          </Link>
          <Link href="/contact" className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-stone-700 transition hover:text-[#17130f]">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form action="/products" className="hidden w-[250px] items-center rounded-full border border-stone-200 bg-white px-4 py-2.5 shadow-sm xl:flex">
            <input
              type="search"
              name="search"
              placeholder="Search code or design"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-900 outline-none placeholder:text-stone-400"
            />
            <button type="submit" className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#17130f] text-white transition hover:bg-stone-700" aria-label="Search">
              →
            </button>
          </form>

          <Link href="/account" aria-label="Account" title="Account" className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-[#17130f] shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50">
            <AccountIcon />
          </Link>

          <button type="button" onClick={openCart} aria-label="Open cart" title="Cart" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-[#17130f] shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50">
            <CartIcon />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#17130f] px-1 text-[0.65rem] font-black leading-none text-white">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-stone-200/80 px-5 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          <Link href="/products" className="shrink-0 rounded-full bg-[#17130f] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">Shop</Link>
          {collectionLinks.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#17130f]">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
