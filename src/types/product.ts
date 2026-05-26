export type ProductBrand = 'EDL';
export type ProductBadge = 'NEW' | 'BESTSELLER' | 'PROMO';

export type Product = {
  slug: string;
  code: string;
  name: string;
  brand: ProductBrand;
  collection?: string;
  category?: string;
  design?: string;
  finish?: string;
  size?: string;
  thickness?: string;
  colorFamily?: string;
  /** Price shown publicly on website, including PPN. */
  price?: number | null;
  /** Promo price shown publicly on website, including PPN, after discount. */
  promoPrice?: number | null;
  /** True when the product belongs to the Promo Items collection. */
  isPromoItem?: boolean;
  /** Zoho Books item rate, excluding PPN. Kept internally for future admin logic only. */
  priceExcludingTax?: number | null;
  taxIncluded?: boolean;
  /** Zoho Books stock on hand. Used internally to build Promo Items collection. */
  stockOnHand?: number | null;
  /** Zoho Books item unit. Kept internally for stock/promo logic. */
  unit?: string;
  currency: 'IDR';
  active: boolean;
  imageUrl?: string | null;
  imageUrlCandidates?: string[];
  description?: string;
  badges?: ProductBadge[];
};
