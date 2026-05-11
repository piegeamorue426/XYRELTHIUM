import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductGrid from '@/components/products/ProductGrid';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    return { title: 'Catégorie introuvable' };
  }

  return {
    title: category.name,
    description: category.description || `Découvrez nos produits dans la catégorie ${category.name}`,
    openGraph: {
      title: `${category.name} - Xyrelthium`,
      description: category.description || `Découvrez nos produits dans la catégorie ${category.name}`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-400">{category.description}</p>
        )}
      </div>

      {products && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Aucun produit dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  );
}
