"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CategoryNav.module.css';
import { cn } from '@/lib/utils';

interface Category {
    name: string;
    slug: string;
    icon: string;
}

const CATEGORIES: Category[] = [
    { name: 'All Products',     slug: 'all',              icon: '🛍️' },
    { name: 'Air Conditioners', slug: 'air-conditioners', icon: '❄️' },
    { name: 'Smart TVs',        slug: 'televisions',      icon: '📺' },
    { name: 'Air Coolers',      slug: 'air-coolers',      icon: '💨' },
    { name: 'Refrigerators',    slug: 'refrigerators',    icon: '🧊' },
    { name: 'Washing Machines', slug: 'washing-machines', icon: '🌀' },
    { name: 'Mobile Phones',    slug: 'mobile-phones',    icon: '📱' },
    { name: 'Home Appliances',  slug: 'home-appliances',  icon: '🔌' },
    { name: 'Water Dispensers', slug: 'water-dispensers', icon: '🚰' },
    { name: 'Chest Freezers',   slug: 'chest-freezers',   icon: '🍦' },
];

export default function CategoryNav() {
    const pathname = usePathname();

    // Extract current slug from pathname (e.g., /category/televisions -> televisions)
    const currentSlug = pathname.split('/').pop() || 'all';

    return (
        <div className={styles.navContainer}>
            <div className={styles.scrollArea}>
                {CATEGORIES.map((cat) => {
                    const isActive = currentSlug === cat.slug;
                    return (
                        <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className={cn(styles.categoryPill, isActive ? styles.active : '')}
                        >
                            <span className={styles.icon}>{cat.icon}</span>
                            {cat.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
