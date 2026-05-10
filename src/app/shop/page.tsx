import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { SortSelect } from './SortSelect';
import type { Product } from '@/types/database';

interface ShopPageProps {
  searchParams: { category?: string; sort?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createClient();
  const { category, sort } = searchParams;

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Build products query
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'available');

  if (category) {
    query = query.eq('category', category);
  }

  // Apply sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data: products } = await query;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">La Boutique</h1>
            <p className="mt-2 text-sm text-white/50">
              Decouvrez tous nos produits tech, gaming et lifestyle
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <CategoryFilter
              categories={categories || []}
              activeCategory={category}
            />
            <SortSelect currentSort={sort} />
          </div>

          {/* Products Grid */}
          <ProductGrid products={products || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
