import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.passnexus.in';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/dashboard/', '/api/', '/pass/verify/', '/pass/recover/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
