import React from 'react';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Card } from '@/components/ui/Card';

export default async function WishlistPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: wishlistItems } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id);
  let products: any[] = [];
  if (wishlistItems && wishlistItems.length > 0) {
    const ids = wishlistItems.map((w) => w.product_id);
    const { data } = await supabase.from('products').select('*').in('id', ids);
    products = data || [];
  }

  return (
    <><Header /><main className="min-h-screen"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><Heart className="h-7 w-7 text-red-400" />Mes favoris</h1>
      {products.length === 0 ? (
        <Card padding="lg"><div className="text-center py-12"><Heart className="h-12 w-12 text-white/20 mx-auto mb-4" /><p className="text-white/50">Vous n&apos;avez pas encore de favoris</p><a href="/shop" className="inline-block mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">Decouvrir la boutique</a></div></Card>
      ) : (<ProductGrid products={products} />)}
    </div></main><Footer /></>
  );
}
