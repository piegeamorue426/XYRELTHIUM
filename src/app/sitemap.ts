import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xyrelthium.vercel.app';
  const { data: products } = await supabase.from('products').select('id, updated_at').eq('status', 'available');
  const { data: categories } = await supabase.from('categories').select('slug');

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...(categories || []).map((c) => ({ url: `${siteUrl}/categories/${c.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...(products || []).map((p) => ({ url: `${siteUrl}/product/${p.id}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
