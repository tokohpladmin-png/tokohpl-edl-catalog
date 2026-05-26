import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductExplorer } from '@/components/ProductExplorer';
import { CollectionGroup, getProductsByCollectionGroup } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

const groups: Record<string, { title: string; subtitle: string; description: string }> = {
  shop: {
    title: 'Shop',
    subtitle: 'Browse all EDL products from TokoHPL',
    description: 'Explore all EDL surfaces available in the TokoHPL online catalogue.'
  },
  solid: {
    title: 'Solid',
    subtitle: 'Clean solid surfaces for modern interiors',
    description: 'Browse EDL Solid products from TokoHPL.'
  },
  solids: {
    title: 'Solid',
    subtitle: 'Clean solid surfaces for modern interiors',
    description: 'Browse EDL Solid products from TokoHPL.'
  },
  wood: {
    title: 'Wood',
    subtitle: 'Warm wood-inspired surfaces for furniture and interiors',
    description: 'Browse EDL Wood products from TokoHPL.'
  },
  woods: {
    title: 'Wood',
    subtitle: 'Warm wood-inspired surfaces for furniture and interiors',
    description: 'Browse EDL Wood products from TokoHPL.'
  },
  'marble-stone': {
    title: 'Marble | Stone',
    subtitle: 'Stone, marble, and mineral-inspired finishes',
    description: 'Browse EDL Marble and Stone products from TokoHPL.'
  },
  'pattern-metal': {
    title: 'Pattern | Metal',
    subtitle: 'Decorative patterns, textures, and metallic surfaces',
    description: 'Browse EDL Pattern and Metal products from TokoHPL.'
  },
  patterns: {
    title: 'Pattern | Metal',
    subtitle: 'Decorative patterns, textures, and metallic surfaces',
    description: 'Browse EDL Pattern and Metal products from TokoHPL.'
  },
  aptico: {
    title: 'Aptico',
    subtitle: 'Premium Aptico surface selections',
    description: 'Browse EDL Aptico products from TokoHPL.'
  },
  'new-collections': {
    title: 'New Collections',
    subtitle: 'Fresh EDL designs and latest surface selections',
    description: 'Browse newly introduced EDL designs from TokoHPL.'
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Popular EDL designs trusted for interior projects',
    description: 'Explore frequently selected EDL designs for cabinetry, furniture, wall panels, and commercial interiors.'
  },
  'promo-items': {
    title: 'Promo Items',
    subtitle: 'Selected EDL items available for promotional focus',
    description: 'Selected EDL items are now available with special promotional pricing. Grab them fast while stocks are available.'
  }
};

export function generateMetadata({ params }: { params: { group: string } }): Metadata {
  const page = groups[params.group];

  if (!page) return { title: 'Collection Not Found' };

  return {
    title: `${page.title} Collection`,
    description: page.description
  };
}

export default async function CollectionPage({ params }: { params: { group: string } }) {
  const page = groups[params.group];

  if (!page) notFound();

  const products = await getProductsByCollectionGroup(params.group as CollectionGroup);
  const filterOptions = {
    collections: Array.from(new Set(products.map((product) => product.collection).filter(Boolean) as string[])).sort(),
    categories: Array.from(new Set(products.map((product) => product.category).filter(Boolean) as string[])).sort(),
    finishes: Array.from(new Set(products.map((product) => product.finish).filter(Boolean) as string[])).sort(),
    sizes: Array.from(new Set(products.map((product) => product.size).filter(Boolean) as string[])).sort(),
    colorFamilies: Array.from(new Set(products.map((product) => product.colorFamily).filter(Boolean) as string[])).sort()
  };

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="mb-8 rounded-none bg-white p-6 shadow-card sm:p-10">
        <Link href="/products" className="text-sm font-bold text-stone-500 hover:text-stone-950">← All products</Link>
        <p className="eyebrow mt-8">Collection</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-stone-950 sm:text-6xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-lg font-semibold text-stone-700">{page.subtitle}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">{page.description}</p>
      </div>

      <ProductExplorer products={products} filterOptions={filterOptions} showCollectionTabs={false} showPromoPricing={params.group === 'promo-items'} />
    </div>
  );
}
