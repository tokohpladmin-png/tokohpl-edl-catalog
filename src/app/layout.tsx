import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope'
});

export const metadata: Metadata = {
  title: {
    default: 'TokoHPL | EDL Online Catalog | EDL Indonesia',
    template: '%s | TokoHPL'
  },
  description:
    'Browse EDL HPL products from TokoHPL, an authorized dealer in Indonesia. Search product codes, view prices, and enquire by WhatsApp.',
  metadataBase: new URL('https://tokohpl.com'),
  openGraph: {
    title: 'TokoHPL | EDL Online Catalog',
    description: 'Browse EDL HPL products from TokoHPL in Indonesia.',
    url: 'https://tokohpl.com',
    siteName: 'TokoHPL',
    locale: 'en_ID',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.className} min-h-screen font-sans antialiased`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
