import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import SearchInput from './SearchInput';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rechercher - Xyrelthium',
  description: 'Rechercher des produits sur Xyrelthium',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let products = [];

  if (query) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(50);

    products = data || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-10">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Rechercher</h1>
        <SearchInput initialQuery={query} />
      </div>

      {/* Results */}
      {query && (
        <div>
          <p className="text-sm text-gray-400 mb-6">
            {products.length} résultat{products.length !== 1 ? 's' : ''} pour &quot;{query}&quot;
          </p>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState query={query} />
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-16">
          <svg className="w-20 h-20 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-lg">Tapez un mot-clé pour rechercher des produits</p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <svg className="w-20 h-20 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-semibold text-white mb-2">Aucun résultat</h2>
      <p className="text-gray-400">
        Nous n&apos;avons rien trouvé pour &quot;{query}&quot;. Essayez avec d&apos;autres termes.
      </p>
    </div>
  );
}
