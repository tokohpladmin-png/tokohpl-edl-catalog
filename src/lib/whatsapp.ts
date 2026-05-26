import type { Product } from '@/types/product';
import { formatIDR } from './utils';

const DEFAULT_WA_NUMBER = '628161345224';

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_TokoHPL_WHATSAPP || DEFAULT_WA_NUMBER;
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function buildProductEnquiryMessage(product: Product) {
  const lines = [
    'Halo TokoHPL Team, saya tertarik dengan produk berikut:',
    '',
    `Produk: ${product.name}`,
    `Kode: ${product.code}`,
    `Harga: ${formatIDR(product.price)} (Termasuk PPN)`
  ];

  if (product.isPromoItem && typeof product.promoPrice === 'number') {
    lines.push(`Promo: ${formatIDR(product.promoPrice)} (Termasuk PPN)`);
  }

  lines.push('', 'Terima kasih.');

  return lines.join('\n');
}

export function buildSampleRequestMessage(product?: Product) {
  if (!product) {
    return [
      'Halo TokoHPL Team, saya ingin request sample EDL.',
      '',
      'Kode produk:',
      '1.',
      '2.',
      '3.',
      '',
      'Nama / Perusahaan:',
      'Kota pengiriman:',
      '',
      'Terima kasih.'
    ].join('\n');
  }

  return [
    'Halo TokoHPL Team, saya ingin request sample untuk produk berikut:',
    '',
    `Produk: ${product.name}`,
    `Kode: ${product.code}`,
    '',
    'Nama / Perusahaan:',
    'Kota pengiriman:',
    '',
    'Terima kasih.'
  ].join('\n');
}
