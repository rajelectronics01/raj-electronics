"use client";

import styles from './FeaturedBrands.module.css';
import { BRANDS } from '@/types';

export default function FeaturedBrands() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Top Brands</h2>
                <div className={styles.wrapper}>
                    <div className={styles.grid}>
                        {BRANDS.map(brand => (
                            <div key={brand} className={styles.brandCard}>
                                <span className={styles.brandName}>{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
