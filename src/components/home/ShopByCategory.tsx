import Link from 'next/link';
import Image from 'next/image';
import styles from './ShopByCategory.module.css';
import productsData from '@/data/products.json';
import { Product } from '@/types';

// Cast the imported JSON to our Product type structure since we know it matches
const products = productsData as unknown as Product[];

const CATEGORIES = [
    {
        name: 'Air Conditioners',
        slug: 'air-conditioners',
        desc: 'Premium cooling solutions with energy efficiency',
        fallbackImage: '/images/category/ac.jpg',
        blendMode: true,
        enhance: false,
        coverImage: false,
    },
    {
        name: 'Smart TVs',
        slug: 'televisions',
        desc: '4K & OLED displays with smart features',
        fallbackImage: '/images/category/tv.jpg',
        blendMode: true,
        enhance: false,
        coverImage: false,
    },
    {
        name: 'Refrigerators',
        slug: 'refrigerators',
        desc: 'Double-door and side-by-side models',
        fallbackImage: '/images/category/fridge.jpg',
        blendMode: true,
        enhance: false,
        coverImage: false,
    },
    {
        name: 'Washing Machines',
        slug: 'washing-machines',
        desc: 'Fully automatic with advanced features',
        fallbackImage: '/images/category/washing-machine.jpg',
        blendMode: true,
        enhance: false,
        coverImage: false,
    },
    {
        name: 'Air Coolers',
        slug: 'air-coolers',
        desc: 'Efficient desert and personal air coolers',
        fallbackImage: '/images/category/air-cooler-v2.png',
        forceFallback: true,
        blendMode: true,
        enhance: true,
        coverImage: false,
    },
    {
        name: 'Water Dispensers',
        slug: 'water-dispensers',
        desc: 'Hot, cold, and normal water dispensing',
        fallbackImage: '/images/category/water-dispenser-v2.png',
        forceFallback: true,
        blendMode: true,
        enhance: true,
        coverImage: false,
    },
    {
        name: 'Chest Freezers',
        slug: 'chest-freezers',
        desc: 'Deep freezers for maximum storage',
        fallbackImage: '/images/category/chest-freezer-v2.png',
        forceFallback: true,
        blendMode: false,
        enhance: false,
        coverImage: false,
        fadeEdges: true,
    },
    {
        name: 'Home Appliances',
        slug: 'home-appliances',
        desc: 'Mixers, microwaves, and everyday essentials',
        fallbackImage: '/images/category/home-appliances-v2.png',
        forceFallback: true,
        blendMode: false,
        enhance: false,
        coverImage: true,
        fadeEdges: false,
    },
];

export default function ShopByCategory() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Shop By Category</h2>
                <div className={styles.grid}>
                    {CATEGORIES.map(cat => {
                        // Find the first product that matches this category name exactly
                        const firstProduct = products.find(p => p.category === cat.name || p.category.toLowerCase().replace(' ', '-') === cat.slug);
                        // Serve the first product image directly through Next.js /_next/image proxy, using the fallback if no product exists or forced
                        const displayImage = cat.forceFallback ? cat.fallbackImage : (firstProduct?.images?.[0] || cat.fallbackImage);

                        const imageClasses = [
                            styles.image,
                            cat.blendMode ? styles.blendImage : '',
                            cat.enhance ? styles.enhanceWhite : '',
                            cat.coverImage ? styles.noPadding : '',
                            (cat as any).fadeEdges ? styles.fadeEdges : ''
                        ].filter(Boolean).join(' ');

                        return (
                            <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <div className={styles.gradientBg}></div>
                                    <Image
                                        src={displayImage}
                                        alt={cat.name}
                                        fill
                                        style={{ objectFit: cat.coverImage ? 'cover' : 'contain' }}
                                        className={imageClasses}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.name}>{cat.name}</h3>
                                    <p className={styles.desc}>{cat.desc}</p>
                                    <div className={styles.exploreLink}>
                                        Explore <span className={styles.arrowChevron}>›</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

