import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { getBestSellerProducts, getNewCollectionProducts, getPromoItemProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

const collectionCards = [
  { title: 'Solid', href: '/collections/solid' },
  { title: 'Wood', href: '/collections/wood' },
  { title: 'Marble | Stone', href: '/collections/marble-stone' },
  { title: 'Pattern | Metal', href: '/collections/pattern-metal' }
];

export default async function HomePage() {
  const newCollectionProducts = (await getNewCollectionProducts()).slice(0, 4);
  const bestSellerProducts = (await getBestSellerProducts()).slice(0, 4);
  const promoProducts = (await getPromoItemProducts()).slice(0, 4);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-[#ece7dd] text-[#241f1a]">
        <div className="absolute right-0 top-0 -z-10 h-full w-[55%] bg-gradient-to-br from-[#d8cbb9] via-[#eee8dc] to-[#b7a58f]" />
        <div className="absolute left-[-12rem] top-[-10rem] -z-10 h-[32rem] w-[32rem] rounded-full bg-white/55 blur-3xl" />

        <div className="section-shell grid min-h-[calc(100vh-74px)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="eyebrow text-[#8a4f2b]">EDL Online Catalog</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.055em] text-[#241f1a] sm:text-6xl lg:text-7xl">
              Beautiful spaces start with beautiful materials.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5a5148] sm:text-lg">
              TokoHPL presents a curated EDL product catalog for interior businesses, contractors, and project teams in Indonesia. Browse materials, compare surfaces, and contact our team for product enquiries.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-[#241f1a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#3a332c]">
                Browse Collection
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-[#241f1a]/20 bg-white/70 px-5 py-3 text-sm font-bold text-[#241f1a] transition hover:-translate-y-0.5 hover:bg-white">
                Contact TokoHPL
              </Link>
            </div>
          </div>

          <div className="soft-card relative z-10 overflow-hidden !border-white/30 !bg-white/55 p-4 shadow-luxury backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-5 text-[#241f1a] sm:p-6">
              <div className="rounded-[1.25rem] bg-[#f4f0e8] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a4f2b]">Search Products</p>
                <form action="/products" className="relative z-20 mt-4 flex rounded-full border border-[#d8cbb9] bg-white shadow-sm">
                  <input
                    type="search"
                    name="search"
                    aria-label="Search products"
                    placeholder="Search EDL product code, color, or surface"
                    className="min-w-0 flex-1 rounded-l-full bg-transparent px-5 py-4 text-sm font-medium text-[#241f1a] outline-none placeholder:text-stone-400"
                  />
                  <button type="submit" aria-label="Search" className="m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#241f1a] text-white transition hover:bg-[#3a332c]">
                    →
                  </button>
                </form>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {collectionCards.map((card) => (
                  <Link key={card.href} href={card.href} className="rounded-2xl border border-[#e4dbce] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                    <p className="text-sm font-black text-[#241f1a]">{card.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured Product</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-stone-950 sm:text-4xl">New Collections</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">Discover selected EDL surfaces for modern residential and commercial interiors.</p>
          </div>
          <Link href="/collections/new-collections" className="text-sm font-black text-stone-950 hover:underline">View All</Link>
        </div>
        <ProductGrid products={newCollectionProducts} />
      </section>

      <section className="bg-white/70 py-14 sm:py-20">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Featured Product</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-stone-950 sm:text-4xl">Best Sellers</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">Explore popular EDL materials trusted for versatile interior applications.</p>
            </div>
            <Link href="/collections/best-sellers" className="text-sm font-black text-stone-950 hover:underline">View All</Link>
          </div>
          <ProductGrid products={bestSellerProducts} />
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured Product</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-stone-950 sm:text-4xl">Promo Items</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">Selected EDL items are now available with special promotional pricing. Grab them fast while stocks are available.</p>
          </div>
          <Link href="/collections/promo-items" className="text-sm font-black text-stone-950 hover:underline">View All</Link>
        </div>
        <ProductGrid products={promoProducts} showPromoPricing />
      </section>
<section className="section-shell py-14 sm:py-20">
  <div className="soft-card overflow-hidden p-0">
    <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="bg-[#241f1a] p-8 text-white sm:p-10 lg:p-12">
        <p className="eyebrow text-[#d8cbb9]">Digital Catalogue</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
          Explore the EDL 2026 e-catalogue
        </h2>
        <p className="mt-5 text-sm leading-7 text-stone-300 sm:text-base">
          Browse EDL’s latest catalogue to discover surface collections, colours, textures, and material inspiration for residential, commercial, and project interiors.
        </p>
        <a
          href="https://www.edleuro.com/wp-content/uploads/2026/03/EDL_2026_E-Catalogue_LR.pdf"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-[#241f1a] transition hover:bg-stone-100"
        >
          Explore
        </a>
      </div>
      <div className="relative min-h-[320px] overflow-hidden bg-[#111] lg:min-h-full">
        <img
          src="/edl-digital-catalogue.jpg"
          alt="EDL digital catalogue material display"
          className="h-full min-h-[320px] w-full object-cover"
        />
      </div>
    </div>
  </div>
</section>
    </div>
  );
}
