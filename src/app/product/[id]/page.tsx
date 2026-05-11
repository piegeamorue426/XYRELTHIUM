import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AddToCartButton } from './AddToCartButton';
import { Badge } from '@/components/ui/Badge';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { ReviewList } from '@/components/reviews/ReviewList';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('title, short_description')
    .eq('id', params.id)
    .single();

  if (!product) return { title: 'Produit introuvable' };

  return {
    title: `${product.title} | Xyrelthium`,
    description: product.short_description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, exclude current)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .eq('status', 'available')
    .neq('id', product.id)
    .limit(4);

  const specs = product.specs || {};
  const hasSpecs = Object.keys(specs).length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <ProductGallery images={product.images} title={product.title} />

            {/* Info */}
            <div className="space-y-6">
              {/* Category */}
              <div className="flex items-center justify-between">
                <Badge variant="info">{product.category}</Badge>
                <WishlistButton productId={product.id} />
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-lg text-white/40 line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
                {product.compare_at_price && (
                  <Badge variant="success">
                    -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-emerald-400">
                      En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-sm text-red-400">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-white/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart */}
              <AddToCartButton product={product} />

              {/* Shipping info */}
              <div className="p-4 bg-[#111118] border border-white/5 rounded-xl space-y-2">
                <h3 className="text-sm font-medium text-white">Livraison</h3>
                <p className="text-xs text-white/50">
                  Expedition sous 24 a 48h ouvrables. Livraison standard sous 3 a 5 jours.
                  {product.is_digital && ' Ce produit est numerique et sera disponible instantanement apres achat.'}
                </p>
              </div>
            </div>
          </div>

          {/* Specs Table */}
          {hasSpecs && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Specifications techniques
              </h2>
              <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(specs).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={index % 2 === 0 ? 'bg-white/[0.02]' : ''}
                      >
                        <td className="px-4 py-3 text-sm text-white/60 font-medium w-1/3">
                          {key}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-16">
            <ReviewList productId={product.id} />
          </section>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-white mb-6">
                Produits similaires
              </h2>
              <ProductGrid products={relatedProducts} />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
