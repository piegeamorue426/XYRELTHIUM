import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import CartDrawer from '@/components/cart/CartDrawer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Xyrelthium - Boutique en ligne premium',
    template: '%s | Xyrelthium',
  },
  description:
    'Découvrez notre collection unique de produits premium. Qualité exceptionnelle, livraison rapide en France et en Europe.',
  keywords: ['boutique en ligne', 'produits premium', 'e-commerce', 'France', 'Xyrelthium'],
  authors: [{ name: 'Xyrelthium' }],
  creator: 'Xyrelthium',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://xyrelthium.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'Xyrelthium',
    title: 'Xyrelthium - Boutique en ligne premium',
    description:
      'Découvrez notre collection unique de produits premium. Qualité exceptionnelle, livraison rapide en France et en Europe.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Xyrelthium - Boutique en ligne premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xyrelthium - Boutique en ligne premium',
    description:
      'Découvrez notre collection unique de produits premium. Qualité exceptionnelle, livraison rapide.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
