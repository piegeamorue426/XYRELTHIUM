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
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/placeholder-product.jpg',
      stock: product.stock,
    });
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group block bg-[#111118] border border-white/5 rounded-xl overflow-hidden transition-all duration-300",
        inStock ? "hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)]" : "opacity-60"
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0f]">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            inStock ? "group-hover:scale-110" : "grayscale"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="info">{product.category}</Badge>
        </div>
        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-sm font-bold text-white/80 bg-black/70 px-3 py-1 rounded-lg">
              Rupture de stock
            </span>
          </div>
        )}
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
            <span className={cn("text-base font-bold", inStock ? "text-white" : "text-white/40")}>
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-white/40 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {inStock ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-600/20 text-violet-400 rounded-lg border border-violet-500/20 hover:bg-violet-600/30 hover:border-violet-500/40 transition-all duration-200"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Ajouter
            </button>
          ) : (
            <span className="px-3 py-1.5 text-xs font-medium text-white/40 bg-white/5 rounded-lg border border-white/10">
              Indisponible
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
