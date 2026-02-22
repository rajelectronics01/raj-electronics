import { getProducts } from '@/lib/products';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts();
    const baseUrl = 'https://raj-electronics-rho.vercel.app';

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categories = [
        'air-conditioners',
        'televisions',
        'refrigerators',
        'washing-machines',
        'air-coolers',
        'fans',
        'home-theaters',
        'soundbars',
        'microwaves',
        'water-purifiers',
        'kitchen-appliances',
        'vacuum-cleaners'
    ];

    const categoryEntries: MetadataRoute.Sitemap = categories.map(cat => ({
        url: `${baseUrl}/category/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
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
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }
    ];

    return [...staticEntries, ...categoryEntries, ...productEntries];
}
