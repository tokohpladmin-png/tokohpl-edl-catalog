import type { Product } from '@/types/product';

export const edlProducts: Product[] = [
  {
    slug: 'edl-sample-product',
    code: 'EDL SAMPLE',
    name: 'EDL Sample Product',
    brand: 'EDL',
    collection: 'Laminate',
    category: 'Laminate',
    design: 'Sample',
    finish: 'Surface',
    size: "4'X8'",
    thickness: '0.8mm',
    price: null,
    currency: 'IDR',
    active: true,
    description: 'Sample EDL product. Live products will be fetched from Zoho Books.'
  }
];
