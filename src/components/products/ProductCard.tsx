'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/components/cart/CartProvider';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/placeholder-product.jpg',
    });
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-[#111118] border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0f]">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="info">{product.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-white truncate">
          {product.title}
        </h3>
        {product.short_description && (
          <p className="text-xs text-white/50 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-white/40 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-600/20 text-violet-400 rounded-lg border border-violet-500/20 hover:bg-violet-600/30 hover:border-violet-500/40 transition-all duration-200"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
}
