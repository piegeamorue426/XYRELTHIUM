import React from 'react';
import { ProductCard } from './ProductCard';
import { SkeletonProductGrid } from '@/components/ui/Skeleton';
import type { Product } from '@/types/database';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return <SkeletonProductGrid />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/50 text-sm">
          Aucun produit trouve.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
