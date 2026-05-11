import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/account/', '/auth/', '/checkout/'] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xyrelthium.vercel.app'}/sitemap.xml`,
  };
}
