'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from './CartProvider';
import type { CartItem as CartItemType } from './CartProvider';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-3 border-b border-white/5 last:border-0">
      {/* Image */}
      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-[#0a0a0f] flex-shrink-0">
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-white truncate">{item.title}</h4>
        <p className="text-sm font-medium text-violet-400 mt-0.5">
          {formatPrice(item.price)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            className="p-1 text-white/50 hover:text-white rounded border border-white/10 hover:border-white/20 transition-colors"
            aria-label="Diminuer la quantite"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-xs text-white w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            disabled={item.stock !== undefined && item.quantity >= item.stock}
            className="p-1 text-white/50 hover:text-white rounded border border-white/10 hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Augmenter la quantite"
          >
            <Plus className="h-3 w-3" />
          </button>

          <button
            onClick={() => removeItem(item.product_id)}
            className="ml-auto p-1 text-red-400/60 hover:text-red-400 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        {item.stock !== undefined && item.quantity >= item.stock && (
          <p className="text-[10px] text-orange-400 mt-1">Stock max atteint</p>
        )}
      </div>

      {/* Line total */}
      <div className="text-right">
        <span className="text-xs text-white/60">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
