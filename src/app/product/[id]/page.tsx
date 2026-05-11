import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductGallery from '@/components/products/ProductGallery';
import ReviewList from '@/components/reviews/ReviewList';
import WishlistButton from '@/components/wishlist/WishlistButton';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return { title: 'Produit introuvable' };
  }

  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `Achetez ${product.title} sur Xyrelthium`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.length > 0 ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images || []} title={product.title} />

        {/* Product Info */}
        <div className="space-y-6">
          {product.category && (
            <p className="text-sm text-violet-400 font-medium">{product.category.name}</p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-white">{product.title}</h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <WishlistButton productId={product.id} size="md" />
          </div>

          {product.description && (
            <p className="text-gray-400 leading-relaxed">{product.description}</p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-400">
                  En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-400">Rupture de stock</span>
              </>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Features */}
          <div className="border-t border-gray-800 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Livraison gratuite dès 50€
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retours gratuits sous 30 jours
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-800 pt-12">
        <ReviewList productId={product.id} userId={user?.id || null} />
      </div>
    </div>
  );
}
