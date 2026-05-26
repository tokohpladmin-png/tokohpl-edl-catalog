'use client';

import { FormEvent, useState } from 'react';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || '').trim(),
          phone: String(formData.get('phone') || '').trim(),
          email: String(formData.get('email') || '').trim()
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to submit your enquiry at this time.');
      }

      form.reset();
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit your enquiry at this time.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
      <div>
        <label htmlFor="name" className="text-sm font-bold text-stone-800">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-950"
        />
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-bold text-stone-800">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Your phone number"
          required
          className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-950"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-bold text-stone-800">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-950"
        />
      </div>

      {submitState === 'success' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-800">
          We have received your message. Our team will contact you soon. Thank you.
        </div>
      )}

      {submitState === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
          {errorMessage}
        </div>
      )}

      <button type="submit" disabled={submitState === 'submitting'} className="dark-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
        {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
