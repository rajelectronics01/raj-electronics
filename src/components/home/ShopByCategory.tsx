import Link from 'next/link';
import styles from './ShopByCategory.module.css';

const CATEGORIES = [
    { name: 'Air Conditioners', slug: 'air-conditioners', color: '#e0f2fe', icon: '❄️' },
    { name: 'Televisions', slug: 'televisions', color: '#fce7f3', icon: '📺' },
    { name: 'Refrigerators', slug: 'refrigerators', color: '#dcfce7', icon: '🧊' },
    { name: 'Washing Machines', slug: 'washing-machines', color: '#f3e8ff', icon: '🌀' },
    { name: 'Air Coolers', slug: 'air-coolers', color: '#ffedd5', icon: '🌬️' },
    { name: 'Home Appliances', slug: 'home-appliances', color: '#fee2e2', icon: '🔌' },
    { name: 'Water Dispensers', slug: 'water-dispensers', color: '#cffafe', icon: '🚰' },
    { name: 'Chest Freezers', slug: 'chest-freezers', color: '#e0e7ff', icon: '🍦' },
];

export default function ShopByCategory() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Find the Best AC, TV & Home Appliances by Category</h2>
                <div className={styles.grid}>
                    {CATEGORIES.map(cat => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.card}>
                            <div className={styles.iconWrapper} style={{ backgroundColor: cat.color }}>
                                <span className={styles.icon}>{cat.icon}</span>
                            </div>
                            <span className={styles.name}>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
