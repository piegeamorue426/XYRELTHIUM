import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingSupport } from '@/components/support/FloatingSupport';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Xyrelthium | Produits tech & lifestyle',
  description:
    'Decouvrez notre selection de produits tech, gaming et lifestyle. Livraison rapide, paiement securise.',
  keywords: ['tech', 'gaming', 'e-commerce', 'produits numeriques', 'lifestyle'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingSupport />
        </CartProvider>
      </body>
    </html>
  );
}
