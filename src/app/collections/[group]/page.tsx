import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/ProductGrid';
import {
  EDL_COLLECTION_GROUPS,
  getBestSellerProducts,
  getEdlCollectionGroup,
  getEdlCollectionProducts,
  getNewCollectionProducts,
  getPromoItemProducts
} from '@/lib/products';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 600;

type PageProps = {
  params: {
    group: string;
  };
};

export function generateStaticParams() {
  return [
    ...EDL_COLLECTION_GROUPS.map((group) => ({ group: group.slug })),
    { group: 'new-collections' },
    { group: 'best-sellers' },
    { group: 'promo-items' }
  ];
}

async function getCollectionData(slug: string) {
  if (slug === 'new-collections') {
    return {
      title: 'New Collections',
      description: 'Explore the latest EDL surface selections available from TokoHPL.',
      products: await getNewCollectionProducts()
    };
  }

  if (slug === 'best-sellers') {
    return {
      title: 'Best Sellers',
      description: 'Popular EDL surfaces for residential, commercial, and project interiors.',
      products: await getBestSellerProducts()
    };
  }

  if (slug === 'promo-items') {
    return {
      title: 'Promo Items',
      description: 'Selected EDL items are available with special promotional pricing. Grab them fast while stocks are available.',
      products: await getPromoItemProducts()
    };
  }

  const group = getEdlCollectionGroup(slug);
  if (!group) return null;

  return {
    title: group.title,
    description: `Browse EDL ${group.title} products from TokoHPL.`,
    products: await getEdlCollectionProducts(slug)
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const data = await getCollectionData(params.group);

  if (!data) {
    notFound();
  }

  return (
    <main className="bg-[#f6f2ea]">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Collection</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-[#17130f] sm:text-6xl">{data.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">{data.description}</p>
        </div>

        <ProductGrid products={data.products} showPromoPricing={params.group === 'promo-items'} />
      </section>
    </main>
  );
}
