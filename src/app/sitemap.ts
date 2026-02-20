import { getProducts } from '@/lib/products';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts();
    const baseUrl = 'https://rajelectronics.com'; // Replace with actual domain

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/category/all`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/category/air-conditioners`,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        // Add other categories...
    ];

    return [...staticEntries, ...productEntries];
}
