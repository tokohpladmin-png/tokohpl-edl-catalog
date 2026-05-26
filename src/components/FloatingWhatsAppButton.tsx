export function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/628161345224"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Us on WhatsApp"
      className="fixed bottom-5 right-5 z-[9999] inline-flex items-center gap-2 rounded-none bg-[#25D366] px-4 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 sm:bottom-6 sm:right-6 sm:px-5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-none bg-white/20 text-lg font-black">
        ☎
      </span>
      <span>Chat with Us</span>
    </a>
  );
}
