export const dynamic = 'force-dynamic';

export default function AccountPage() {
  return (
    <main className="bg-[#f6f2ea]">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8a4f2b]">Sign In</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-[#17130f]">Welcome back</h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Sign in UI is ready. Full customer account authentication can be connected in the next phase.
            </p>

            <form className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-black text-[#17130f]">Email</label>
                <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold outline-none focus:border-[#17130f]" />
              </div>
              <div>
                <label className="text-sm font-black text-[#17130f]">Password</label>
                <input type="password" placeholder="••••••••" className="mt-2 w-full rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold outline-none focus:border-[#17130f]" />
              </div>
              <button type="button" className="w-full rounded-full bg-[#17130f] px-6 py-4 text-sm font-black text-white transition hover:bg-stone-700">
                Sign In
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] bg-[#17130f] p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d8cbb9]">Sign Up</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em]">Create account</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Create account UI is ready for future ecommerce checkout. Customers can later save contact details, order history, and delivery information.
            </p>

            <form className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-black text-white">Full Name</label>
                <input type="text" placeholder="Your name" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-stone-400 focus:border-white" />
              </div>
              <div>
                <label className="text-sm font-black text-white">Email</label>
                <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-stone-400 focus:border-white" />
              </div>
              <div>
                <label className="text-sm font-black text-white">Password</label>
                <input type="password" placeholder="Create password" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-stone-400 focus:border-white" />
              </div>
              <button type="button" className="w-full rounded-full bg-white px-6 py-4 text-sm font-black text-[#17130f] transition hover:bg-stone-100">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
