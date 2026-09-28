import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products';
import { SITE_URL, CATEGORY_SLUGS } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A database outage must not take the whole sitemap down with it — Google
  // treats an erroring sitemap as a crawl failure. Fall back to the static,
  // category and blog URLs, which carry our local-SEO rankings.
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error('sitemap: could not load products from DB:', err);
  }
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    // Real edit date, so Google recrawls products whose price actually changed.
    lastModified: (product as { updatedAt?: Date }).updatedAt ?? new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((cat) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogEntries: MetadataRoute.Sitemap = [
    'best-ac-for-hyderabad-summer',
    'bulk-electronics-procurement-guide-hyderabad',
    'authorized-electronics-dealer-secunderabad',
    'which-ton-ac-for-my-room',
    'ac-price-list-hyderabad',
  ].map((slug) => ({
    url: `https://rajelectronics.co/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: 'https://rajelectronics.co',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://rajelectronics.co/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://rajelectronics.co/bulk-orders',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...blogEntries, ...productEntries];
}
