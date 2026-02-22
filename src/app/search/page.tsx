import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import styles from '../category/[slug]/page.module.css';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : '';
    return {
        title: `Search Results for "${query}" - Raj Electronics`,
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q.trim() : '';

    let products: any[] = [];

    if (query) {
        products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { brand: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { features: { hasSome: [query] } },
                ]
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    return (
        <div className="container section" style={{ minHeight: '60vh' }}>
            <div className={styles.header}>
                <h1 className={styles.title}>Search Results for &quot;{query}&quot;</h1>
                <p className={styles.count}>{products.length} Products Found</p>
            </div>

            {products.length > 0 ? (
                <div className={styles.grid}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={{
                            ...product,
                            originalPrice: product.originalPrice ?? undefined,
                            isFeatured: false
                        } as any} />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found matching your search. Try adjusting your keywords.</p>
                </div>
            )}
        </div>
    );
}
