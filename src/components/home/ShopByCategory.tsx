import Link from 'next/link';
import Image from 'next/image';
import styles from './ShopByCategory.module.css';

const CATEGORIES = [
    {
        name: 'Air Conditioners',
        slug: 'air-conditioners',
        desc: 'Premium cooling solutions with energy efficiency',
        image: '/images/category/ac.jpg'
    },
    {
        name: 'Smart TVs',
        slug: 'televisions',
        desc: '4K & OLED displays with smart features',
        image: '/images/category/tv.jpg'
    },
    {
        name: 'Refrigerators',
        slug: 'refrigerators',
        desc: 'Double-door and side-by-side models',
        image: '/images/category/fridge.jpg'
    },
    {
        name: 'Washing Machines',
        slug: 'washing-machines',
        desc: 'Fully automatic with advanced features',
        image: '/images/category/washing-machine.jpg'
    },
    {
        name: 'Air Coolers',
        slug: 'air-coolers',
        desc: 'Efficient desert and personal air coolers',
        image: '/images/category/air-cooler.png'
    },
    {
        name: 'Water Dispensers',
        slug: 'water-dispensers',
        desc: 'Hot, cold, and normal water dispensing',
        image: '/images/category/water-dispenser.png'
    },
    {
        name: 'Chest Freezers',
        slug: 'chest-freezers',
        desc: 'Deep freezers for maximum storage',
        image: '/images/category/chest-freezer.png'
    },
    {
        name: 'Home Appliances',
        slug: 'home-appliances',
        desc: 'Mixers, microwaves, and everyday essentials',
        image: '/images/category/appliances.jpg'
    },
];

export default function ShopByCategory() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Shop By Category</h2>
                <div className={styles.grid}>
                    {CATEGORIES.map(cat => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <div className={styles.gradientBg}></div>
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className={styles.image}
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
                    ))}
                </div>
            </div>
        </section>
    );
}

