"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import CategoryNav from '@/components/product/CategoryNav';
import styles from './page.module.css';
import type { Faq } from '@/lib/seo';

interface Product {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
}

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
    initialProducts: Product[];
    uniqueBrands: string[];
    heading?: string;
    intro?: string;
    faqs?: Faq[];
}

export default function CategoryPageClient({ params, initialProducts, uniqueBrands, heading, intro, faqs = [] }: Props) {
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    const categorySlug = params.slug;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsSidebarHidden(true);
            } else {
                setIsSidebarHidden(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categoryTitle = heading ?? (categorySlug === 'all'
        ? 'All Products'
        : categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

    return (
        <div className="container section">
            <div className={`${styles.layout} ${isSidebarHidden ? styles.sidebarHidden : ''}`}>
                <div className={styles.sidebarWrapper}>
                    <FilterSidebar brands={uniqueBrands} />
                </div>

                <div className={styles.main}>
                    <CategoryNav />

                    <div className={styles.header}>
                        <h1 className={styles.title}>{categoryTitle}</h1>
                        <p className={styles.count}>{initialProducts.length} Products Found</p>
                    </div>
                    {intro && <p className={styles.intro}>{intro}</p>}

                    {initialProducts.length > 0 ? (
                        <div className={`${styles.grid} ${isSidebarHidden ? styles.gridExpanded : ''}`}>
                            {initialProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}

                    {faqs.length > 0 && (
                        <section className={styles.faq}>
                            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
                            {faqs.map((f) => (
                                <details key={f.q} className={styles.faqItem}>
                                    <summary>{f.q}</summary>
                                    <p>{f.a}</p>
                                </details>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
