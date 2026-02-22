import { Product } from '@/types';
import prisma from '@/lib/prisma';

export async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Map Prisma models to our Product interface
    return products.map(p => ({
        ...p,
        originalPrice: p.originalPrice ?? undefined,
        isFeatured: false // Default to false since it's not in the DB schema yet
    })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const allProducts = await getProducts();
    // Return top 8 newest products as "featured" for now
    return allProducts.slice(0, 8);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return undefined;
    return {
        ...product,
        originalPrice: product.originalPrice ?? undefined,
        isFeatured: false
    } as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    if (category === 'all') return getProducts();

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { category: { equals: category, mode: 'insensitive' } },
                { category: { contains: category.replace(/-/g, ' '), mode: 'insensitive' } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    return products.map(p => ({
        ...p,
        originalPrice: p.originalPrice ?? undefined,
        isFeatured: false
    })) as Product[];
}
