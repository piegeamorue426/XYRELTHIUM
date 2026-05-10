'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/components/cart/CartProvider';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          {/* Success icon */}
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Commande confirmee !
          </h1>

          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            Merci pour votre achat. Un email de confirmation vous a ete envoye
            avec les details de votre commande.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/account">
              <Button variant="primary" icon={<Package className="h-4 w-4" />}>
                Voir mes commandes
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" icon={<ShoppingBag className="h-4 w-4" />}>
                Retour a la boutique
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
