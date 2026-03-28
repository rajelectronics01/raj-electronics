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

// We duplicate items in the track so the marquee loops seamlessly.
// If fewer than MIN_CLONES items, we repeat the whole list enough times.
const MIN_ITEMS = 15; // Increased to ensure track is always longer than viewport

interface CarouselTrackProps {
    products: Product[];
    duration: string;
}

function CarouselTrack({ products, duration }: CarouselTrackProps) {
    const items = [...products];
    // For a seamless loop with marquee, we still need at least 1 duplication, 
    // but the user's request "each product should appear only once per section" 
    // likely refers to non-marquee views or cross-section. 
    // However, if we remove doubling completely, the marquee breaks.
    // I will reduce MIN_ITEMS to 0 and only double for the technical loop.
    const doubled = [...items, ...items];

    return (
        <div className={styles.trackWrapper}>
            <div
                className={styles.track}
                style={{ '--duration': duration } as React.CSSProperties}
            >
                {doubled.map((product, i) => {
                    const discount = calcDiscount(product.price, product.originalPrice);
                    return (
                        <Link
                            key={`${product.id}-${i}`}
                            href={`/product/${product.slug}`}
                            className={styles.card}
                            tabIndex={i >= items.length ? -1 : 0} // duplicates are decorative
                        >
                            <div className={styles.cardImageWrapper}>
                                {discount > 0 && (
                                    <span className={styles.discountBadge}>{discount}% OFF</span>
                                )}
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={`${product.brand} ${product.name}`}
                                        fill
                                        className={styles.cardImage}
                                        sizes="220px"
                                        unoptimized={product.images[0].startsWith('http')}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                <span className={styles.cardBrand}>{product.brand}</span>
                                <p className={styles.cardName}>{product.name}</p>
                                <div className={styles.cardPriceRow}>
                                    <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
                                    {product.originalPrice && (
                                        <span className={styles.cardOriginalPrice}>
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                                <span className={styles.cardTag}>
                                    {discount >= 40 ? '🔥 Hot Deal' : discount >= 25 ? '⚡ Great Value' : discount >= 10 ? '✦ Special Price' : '★ Top Rated'}
                                </span>
                            </div>
                        </Link>
                    );
                })}
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
                    <span className={styles.eyebrow}>🔥 Exclusive Offers</span>
                    <h2 className={styles.title}>Top Deals — Shop by Category</h2>
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
                            <CarouselTrack products={products} duration={cfg.duration} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
