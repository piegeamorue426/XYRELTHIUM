import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mes Favoris - Xyrelthium',
  description: 'Vos produits favoris sur Xyrelthium',
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth?redirect=/wishlist');
  }

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const products = wishlists?.map((w) => w.product).filter(Boolean) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Mes Favoris</h1>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Aucun favori</h2>
          <p className="text-gray-400 mb-6">
            Vous n&apos;avez pas encore ajouté de produits à vos favoris.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
          >
            Découvrir la boutique
          </Link>
        </div>
      )}
    </div>
  );
}
