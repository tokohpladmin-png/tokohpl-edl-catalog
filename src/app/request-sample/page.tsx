import type { Metadata } from 'next';
import { buildSampleRequestMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Request EDL Sample',
  description: 'Request up to 5 EDL sample pieces from tokohpl.'
};

export default function RequestSamplePage() {
  const whatsappUrl = buildWhatsAppUrl(buildSampleRequestMessage());

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow">Sample Request</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-stone-950 sm:text-6xl">Request EDL samples</h1>
          <p className="mt-5 text-base leading-8 text-stone-600">
            Customers may request up to 5 sample pieces per request. Please prepare product codes or design names so tokohpl Team can follow up accurately.
          </p>
        </div>

        <div className="soft-card p-6 sm:p-8">
          <h2 className="text-lg font-black text-stone-950">Information to prepare</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              'Product code or design name',
              'Maximum 5 sample pieces',
              'Name or company name',
              'Delivery city in Indonesia'
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
