import type { Metadata } from 'next';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Request EDL Catalog',
  description: 'Request EDL catalog information from tokohpl.'
};

export default function RequestCatalogPage() {
  const message = [
    'Halo tokohpl Team, saya ingin request katalog EDL.',
    '',
    'Nama / Perusahaan:',
    'Kota:',
    'Kebutuhan produk:',
    '',
    'Terima kasih.'
  ].join('\n');

  const whatsappUrl = buildWhatsAppUrl(message);

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow">Catalog Request</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-stone-950 sm:text-6xl">Request the EDL catalog</h1>
          <p className="mt-5 text-base leading-8 text-stone-600">
            Request EDL catalog information from tokohpl through WhatsApp. tokohpl Team will help provide the most relevant product information based on your needs.
          </p>
        </div>

        <div className="soft-card p-6 sm:p-8">
          <h2 className="text-lg font-black text-stone-950">Recommended details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              'Name or company name',
              'City / project location',
              'Product usage or project type',
              'Preferred designs or product codes, if any'
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-stone-50 p-4 text-sm font-semibold text-stone-700">
                {item}
              </div>
            ))}
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="dark-button mt-8">
            Request via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
