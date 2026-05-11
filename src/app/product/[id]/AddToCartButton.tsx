'use client';

import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/cart/CartProvider';
import type { Product } from '@/types/database';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, clearCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/placeholder-product.jpg',
      stock: product.stock,
    });
  };

  const handleBuyNow = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              product_id: product.id,
              title: product.title,
              price: product.price,
              quantity: 1,
              image: product.images[0] || '/placeholder-product.jpg',
            },
          ],
        }),
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

  const inStock = product.stock > 0;

  return (
    <div className="space-y-4">
      {!inStock && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm font-medium text-red-400">Rupture de stock - Ce produit est actuellement indisponible</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAddToCart}
          variant="secondary"
          size="lg"
          icon={<ShoppingCart className="h-4 w-4" />}
          disabled={!inStock}
          className="flex-1"
        >
          {inStock ? 'Ajouter au panier' : 'Indisponible'}
        </Button>
        <Button
          onClick={handleBuyNow}
          variant="primary"
          size="lg"
          icon={<Zap className="h-4 w-4" />}
          disabled={!inStock}
          className="flex-1"
        >
          {inStock ? 'Acheter maintenant' : 'Indisponible'}
        </Button>
      </div>
    </div>
  );
}
