import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `https://rajelectronics.co/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = [
    'air-conditioners', 'televisions', 'refrigerators', 'washing-machines', 
    'air-coolers', 'water-dispensers', 'chest-freezers', 'home-appliances', 'all'
  ].map((cat) => ({
    url: `https://rajelectronics.co/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
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
      priority: 0.9,
    },
    {
      url: 'https://rajelectronics.co/blog/best-ac-for-hyderabad-summer',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://rajelectronics.co/blog/bulk-electronics-procurement-guide-hyderabad',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://rajelectronics.co/blog/authorized-electronics-dealer-secunderabad',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ];

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
