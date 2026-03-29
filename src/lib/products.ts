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
        isFeatured: (p as any).isFeatured || false
    })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' }
    });

    return products.map(p => ({
        ...p,
        originalPrice: p.originalPrice ?? undefined,
        isFeatured: true
    })) as Product[];
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return undefined;
    return {
        ...product,
        originalPrice: product.originalPrice ?? undefined,
        isFeatured: (product as any).isFeatured || false
    } as Product;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return undefined;
    return {
        ...product,
        originalPrice: product.originalPrice ?? undefined,
        isFeatured: (product as any).isFeatured || false
    } as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    if (category === 'all') return getProducts();

    const searchTerm = category.replace(/-/g, ' ');
    const searchSlug = category.replace(/-/g, '-');

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { category: { equals: category, mode: 'insensitive' } },
                { category: { contains: searchTerm, mode: 'insensitive' } },
                { slug: { contains: searchSlug, mode: 'insensitive' } },
                { name: { contains: searchTerm, mode: 'insensitive' } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    });

    return products.map(p => ({
        ...p,
        originalPrice: p.originalPrice ?? undefined,
        isFeatured: (p as any).isFeatured || false
    })) as Product[];
}
