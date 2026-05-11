import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) return { title: 'Categorie introuvable' };

  return {
    title: `${category.name} | Xyrelthium`,
    description: category.description || `Decouvrez nos produits ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', params.slug)
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-sm text-white/50">
                {category.description}
              </p>
            )}
          </div>

          {/* Products */}
          <ProductGrid products={products || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
