import React from 'react';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchInput } from './SearchInput';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || '';
  const supabase = createClient();
  let products: any[] = [];

  if (query) {
    const { data } = await supabase.from('products').select('*').eq('status', 'available')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
      .order('created_at', { ascending: false }).limit(20);
    products = data || [];
  }

  return (
    <><Header /><main className="min-h-screen"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Recherche</h1>
      <SearchInput defaultValue={query} />
      <div className="mt-8">
        {!query ? (
          <div className="text-center py-16"><Search className="h-12 w-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">Tapez un mot-cle pour rechercher des produits</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16"><Search className="h-12 w-12 text-white/20 mx-auto mb-4" /><p className="text-white/70 font-medium">Aucun resultat pour &quot;{query}&quot;</p></div>
        ) : (
          <><p className="text-sm text-white/50 mb-4">{products.length} resultat{products.length > 1 ? 's' : ''} pour &quot;{query}&quot;</p><ProductGrid products={products} /></>
        )}
      </div>
    </div></main><Footer /></>
  );
}
