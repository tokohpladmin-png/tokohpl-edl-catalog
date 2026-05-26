export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="bg-[#f4f0e8]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12 lg:p-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a4f2b]">Company</p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[#241f1a] md:text-6xl">tokohpl | EDL Online Catalog</h1>
          <div className="mt-8 max-w-3xl space-y-6 text-base leading-8 text-neutral-700">
            <p>tokohpl provides an online catalog experience for EDL interior surfacing materials in Indonesia.</p>
            <p>EDL believes that beautiful spaces start with beautiful materials. This catalog follows that spirit with a clean, tactile, and design-oriented browsing experience inspired by EDL’s material ecosystem.</p>
            <p>Product information and pricing are maintained from tokohpl’s official Zoho Books product data. Stock, delivery timeline, and final order details remain subject to confirmation by our team.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
