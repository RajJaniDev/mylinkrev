import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://myrevlink.in';

  // 1. Static Pages
  const staticPages = [
    '',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Industry Pillar Pages
  const industries = [
    'dentists',
    'restaurants',
    'real-estate',
    'hair-salons',
    'plumbers',
    'gyms',
    'lawyers',
    'contractors',
    'doctors',
    'hotels',
  ];
  const industryPages = industries.map((ind) => ({
    url: `${baseUrl}/industries/${ind}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Dynamic Business Profiles from Supabase
  let businessPages: any[] = [];
  try {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug, created_at')
      .order('created_at', { ascending: false });

    if (businesses) {
      businessPages = businesses.map((bus) => ({
        url: `${baseUrl}/b/${bus.slug}`,
        lastModified: bus.created_at ? new Date(bus.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap dynamic paths:', error);
  }

  return [...staticPages, ...industryPages, ...businessPages];
}
