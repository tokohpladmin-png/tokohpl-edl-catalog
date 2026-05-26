import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { getAllProducts, getBestSellerProducts, getNewCollectionProducts, getPromoItemProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

const categories = [
  { title: 'Solid', subtitle: 'Clean colours for modern projects', href: '/collections/solid' },
  { title: 'Wood', subtitle: 'Warm natural surfaces', href: '/collections/wood' },
  { title: 'Pattern', subtitle: 'Creative textures and decorative looks', href: '/collections/pattern' },
  { title: 'Marble', subtitle: 'Elegant marble-inspired surfaces', href: '/collections/marble' },
  { title: 'Stone', subtitle: 'Concrete, slate, and stone looks', href: '/collections/stone' },
  { title: 'Metal', subtitle: 'Metallic and reflective finishes', href: '/collections/metal' },
  { title: 'Aptico', subtitle: 'Premium Aptico surfaces', href: '/collections/aptico' },
  { title: 'Promo Items', subtitle: 'Selected offers while stocks last', href: '/collections/promo-items' }
];

const storeBenefits = [
  'EDL product selection',
  'Tax-included display prices',
  'Fast enquiry via WhatsApp',
  'Project-friendly browsing'
];

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const newCollectionProducts = (await getNewCollectionProducts()).slice(0, 8);
  const bestSellerProducts = (await getBestSellerProducts()).slice(0, 8);
  const promoProducts = (await getPromoItemProducts()).slice(0, 8);

  return (
    <div className="bg-[#f6f2ea]">
      <section className="relative overflow-hidden bg-[#15120f] text-white">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#b28a5c]/35 blur-3xl" />
          <div className="absolute bottom-[-16rem] left-[-12rem] h-[36rem] w-[36rem] rounded-full bg-[#efe6d4]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#e7d7bd]">
              EDL Surfaces Online Store
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
              Shop surfaces for better interiors.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              TokoHPL is a modern online store for EDL decorative surfaces. Browse product codes, compare collections, and send your enquiry directly to our team.
            </p>

            <form action="/products" className="mt-8 flex max-w-xl rounded-full border border-white/15 bg-white p-2 shadow-2xl">
              <input
                type="search"
                name="search"
                placeholder="Search EDL product code or colour"
                className="min-w-0 flex-1 rounded-l-full px-5 text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
              />
              <button className="rounded-full bg-[#17130f] px-6 py-3 text-sm font-black text-white transition hover:bg-[#3a332c]" type="submit">
                Search
              </button>
            </form>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {storeBenefits.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold leading-6 text-stone-100 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2.25rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="grid gap-3 rounded-[1.75rem] bg-[#f4efe6] p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-h-[260px] rounded-[1.5rem] bg-gradient-to-br from-[#d9c6aa] to-[#8b7458]" />
                  <div className="grid gap-3">
                    <div className="rounded-[1.5rem] bg-[#fdfbf7] p-5 text-[#17130f]">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a4f2b]">Products</p>
                      <p className="mt-4 text-4xl font-black tracking-[-0.05em]">{allProducts.length}+</p>
                      <p className="mt-2 text-sm font-semibold text-stone-500">EDL items fetched from Zoho</p>
                    </div>
                    <div className="min-h-[120px] rounded-[1.5rem] bg-gradient-to-br from-[#2a241e] to-[#070605]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['#f7f1e6', '#d5c4ad', '#9a8066', '#2a2520'].map((color) => (
                    <div key={color} className="h-24 rounded-2xl shadow-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Shop by Category</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">Browse collections</h2>
          </div>
          <Link href="/products" className="text-sm font-black text-[#17130f] underline underline-offset-4">View all products</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-36 rounded-[1.25rem] bg-gradient-to-br from-[#efe7d8] via-[#c9b79e] to-[#241f1a]" />
              <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-[#17130f]">{category.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">{category.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Fresh Picks</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">New arrivals</h2>
            </div>
            <Link href="/collections/new-collections" className="text-sm font-black text-[#17130f] underline underline-offset-4">Explore</Link>
          </div>
          <ProductGrid products={newCollectionProducts} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Popular Choices</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">Best sellers</h2>
          </div>
          <Link href="/collections/best-sellers" className="text-sm font-black text-[#17130f] underline underline-offset-4">Explore</Link>
        </div>
        <ProductGrid products={bestSellerProducts} />
      </section>

      <section className="bg-[#15120f] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d8cbb9]">Limited Offers</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">Promo items</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">Selected EDL items are available with special promotional pricing. Grab them fast while stocks are available.</p>
            </div>
            <Link href="/collections/promo-items" className="text-sm font-black text-white underline underline-offset-4">Explore</Link>
          </div>
          <ProductGrid products={promoProducts} showPromoPricing />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-stone-200">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Digital Catalogue</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-5xl">Explore the EDL 2026 e-catalogue</h2>
              <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
                Browse EDL’s latest catalogue to discover surface collections, colours, textures, and material inspiration for residential, commercial, and project interiors.
              </p>
              <a href="https://www.edleuro.com/wp-content/uploads/2026/03/EDL_2026_E-Catalogue_LR.pdf" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#17130f] px-6 py-3 text-sm font-black text-white transition hover:bg-stone-700">
                Explore
              </a>
            </div>
            <div className="min-h-[360px] bg-[#111]">
              <img src="/edl-digital-catalogue.jpg" alt="EDL digital catalogue material display" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
