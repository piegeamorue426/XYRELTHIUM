'use client';

import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCart } from './CartProvider';
import { CartItem } from './CartItem';

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, getTotal, clearCart } = useCart();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-[#0a0a0f] border-l border-white/5 transform transition-transform duration-300 ease-out flex flex-col',
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Mon panier</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-white/20 mb-4" />
              <p className="text-sm text-white/50">Votre panier est vide</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Sous-total</span>
              <span className="text-lg font-bold text-white">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              fullWidth
            >
              Commander
            </Button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
