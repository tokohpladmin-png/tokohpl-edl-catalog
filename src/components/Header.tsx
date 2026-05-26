'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

const navItems = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections/woods' },
  { label: 'Promo', href: '/collections/promo-items' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-stone-700 transition hover:text-[#17130f]">
              {item.label}
            </Link>
          ))}
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

          <Link
            href="/account"
            aria-label="Account"
            title="Account"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-[#17130f] shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50"
          >
            <AccountIcon />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            title="Cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-[#17130f] shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50"
          >
            <CartIcon />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#17130f] px-1 text-[0.65rem] font-black leading-none text-white">
              {itemCount}
            </span>
          </button>

          <a href="https://wa.me/628161345224" target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#17130f] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-700 lg:inline-flex">
            Chat
          </a>
        </div>
      </div>
    </header>
  );
}
