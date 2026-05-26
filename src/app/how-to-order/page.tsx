import Link from 'next/link';

export const dynamic = 'force-dynamic';

const orderSteps = [
  {
    number: '01',
    icon: '⌕',
    title: 'Browse EDL Products',
    description:
      'Explore the catalogue by collection, category, finish, size, product code, or design name. Use the search bar when you already know the item code or design.'
  },
  {
    number: '02',
    icon: '+',
    title: 'Add Items to Cart',
    description:
      'Open a product page and click Add to Cart. You can add multiple EDL items before sending your order enquiry.'
  },
  {
    number: '03',
    icon: '✓',
    title: 'Review Your Selection',
    description:
      'Check the product codes, sizes, quantities, and selected items carefully so our team can process your request accurately.'
  },
  {
    number: '04',
    icon: '↗',
    title: 'Submit Your Enquiry',
    description:
      'Send your selected items to TokoHPL. Our team will review the request and follow up with the next steps.'
  },
  {
    number: '05',
    icon: '▣',
    title: 'Stock, Price, and Delivery Confirmation',
    description:
      'TokoHPL will confirm product availability, final pricing, delivery timing, and any required order details before payment.'
  },
  {
    number: '06',
    icon: '→',
    title: 'Payment and Delivery',
    description:
      'After confirmation, complete payment as instructed. Your order will then be prepared for delivery according to the confirmed schedule.'
  }
];

const quickNotes = [
  'Please ensure the product code and size are correct before submitting.',
  'Prices shown on the website are tax included unless stated otherwise.',
  'Stock availability and delivery timing will be confirmed by the TokoHPL team.',
  'For faster assistance, prepare your project location and required quantity.'
];

export default function HowToOrderPage() {
  return (
    <main className="bg-[#f4f0e8]">
      <section className="relative isolate overflow-hidden border-b border-stone-200 bg-[#241f1a] text-white">
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-gradient-to-br from-[#8a4f2b]/40 via-[#d8cbb9]/15 to-transparent" />
        <div className="absolute left-[-10rem] top-[-12rem] -z-10 h-[30rem] w-[30rem] rounded-none bg-white/10 blur-3xl" />

        <div className="section-shell py-16 sm:py-20 lg:py-24">
          <p className="eyebrow text-[#d8cbb9]">How to Order</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">
            Simple ordering flow for EDL surfaces.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            Browse the TokoHPL catalogue, add your selected EDL products, and submit your enquiry. Our team will confirm stock, pricing, and delivery details before the order is finalised.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex items-center justify-center rounded-none bg-white px-6 py-3 text-sm font-black text-[#241f1a] transition hover:bg-stone-100">
              Start Browsing
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-none border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10">
              Contact TokoHPL
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20">
        <div className="mb-8">
          <p className="eyebrow">Order Flow</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-5xl">
            From browsing to delivery
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orderSteps.map((step) => (
            <article key={step.number} className="group rounded-none border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-none bg-[#241f1a] text-2xl font-black text-white">
                  {step.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8a4f2b]">{step.number}</span>
              </div>

              <h3 className="mt-6 text-xl font-black tracking-[-0.025em] text-stone-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-14 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-none bg-white p-7 shadow-sm ring-1 ring-stone-200 sm:p-8">
            <p className="eyebrow text-[#8a4f2b]">Quick Notes</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-stone-950 sm:text-3xl">
              Before submitting your enquiry
            </h2>
            <div className="mt-6 grid gap-4">
              {quickNotes.map((note) => (
                <div key={note} className="flex gap-3 rounded-none bg-[#f4f0e8] p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-[#241f1a] text-xs font-black text-white">✓</span>
                  <p className="text-sm leading-6 text-stone-700">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-none bg-[#241f1a] p-7 text-white shadow-sm sm:p-8">
            <p className="eyebrow text-[#d8cbb9]">Need Help?</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
              Contact us for product and order assistance.
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              If you are unsure about product code, finish, size, or availability, contact TokoHPL before placing your order enquiry.
            </p>

            <div className="mt-7 grid gap-3 text-sm leading-7 text-stone-300">
              <p><span className="font-black text-white">Phone:</span> 0816 1345 224</p>
              <p><span className="font-black text-white">Email:</span> tokohpl.admin@gmail.com</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="https://wa.me/628161345224" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-none bg-white px-6 py-3 text-sm font-black text-[#241f1a] transition hover:bg-stone-100">
                Chat with Us
              </a>
              <Link href="/products" className="inline-flex items-center justify-center rounded-none border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
