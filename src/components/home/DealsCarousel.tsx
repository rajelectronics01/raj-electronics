import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import styles from './DealsCarousel.module.css';

// ── Priority order: most seasonal / popular categories first ──────────────────
const CATEGORY_CONFIG: {
    label: string;
    slug: string;
    match: string; // exact category string stored in DB
    duration: string; // marquee speed (slower = fewer products)
}[] = [
    { label: 'Mobile Phones',    slug: 'mobile-phones',    match: 'Mobile Phones',    duration: '112s' },
    { label: 'Split AC',         slug: 'split-ac',         match: 'Split AC',         duration: '126s' },
    { label: 'Window AC',        slug: 'window-ac',        match: 'Window AC',        duration: '119s' },
    { label: 'Tower AC',         slug: 'tower-ac',         match: 'Tower AC',         duration: '112s' },
    { label: 'Air Coolers',      slug: 'air-coolers',      match: 'Air Coolers',      duration: '133s' },
    { label: 'Smart TVs',        slug: 'televisions',      match: 'Televisions',      duration: '140s' },
    { label: 'Refrigerators',    slug: 'refrigerators',    match: 'Refrigerators',    duration: '126s' },
    { label: 'Washing Machines', slug: 'washing-machines', match: 'Washing Machines', duration: '126s' },
    { label: 'Home Appliances',  slug: 'home-appliances',  match: 'Home Appliances',  duration: '119s' },
];

function calcDiscount(price: number, originalPrice?: number) {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
}

import ProductCard from '@/components/product/ProductCard';

interface ProductGridProps {
    products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className={styles.gridWrapper}>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default async function DealsCarousel() {
    const allProducts = await getProducts();

    // Group products by category
    const grouped = new Map<string, Product[]>();
    for (const cfg of CATEGORY_CONFIG) {
        const matches = allProducts.filter(
            p => p.category.toLowerCase() === cfg.match.toLowerCase()
        );
        if (matches.length > 0) {
            grouped.set(cfg.slug, matches);
        }
    }

    // Only render categories that have at least 1 product
    const activeCategories = CATEGORY_CONFIG.filter(cfg => grouped.has(cfg.slug));

    if (activeCategories.length === 0) return null;

    return (
        <section className={styles.section}>
            {/* ── Section Header ── */}
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <span className={styles.eyebrow}>⭐ Handpicked for You</span>
                    <h2 className={styles.title}>Top-Selling Electronics</h2>
                </div>
                <Link href="/category/all" className={styles.viewAllLink}>
                    View All Products →
                </Link>
            </div>

            {/* ── Category Rows ── */}
            <div className={styles.rows}>
                {activeCategories.map(cfg => {
                    const products = grouped.get(cfg.slug)!;
                    return (
                        <div key={cfg.slug} className={styles.categoryRow}>
                            <div className={styles.rowHeader}>
                                <h3 className={styles.rowTitle}>{cfg.label}</h3>
                                <Link href={`/category/${cfg.slug}`} className={styles.rowLink}>
                                    See all {cfg.label} →
                                </Link>
                            </div>
                            <ProductGrid products={products} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
