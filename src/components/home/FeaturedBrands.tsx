"use client";

import styles from './FeaturedBrands.module.css';
import { BRANDS } from '@/types';
const BRAND_LOGOS: Record<string, string> = {
    "Lloyd": "/brands/lloyd.png",
    "Whirlpool": "/brands/whirlpool.png",
    "Crompton": "/brands/crompton.png",
    "Orient": "/brands/orient.png",
    "TG Smart": "/brands/tgsmart.png.jpeg"
};

export default function FeaturedBrands() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Top Brands</h2>
                <div className={styles.wrapper}>
                    <div className={styles.grid}>
                        {BRANDS.map(brand => (
                            <div key={brand} className={styles.brandCard}>
                                {BRAND_LOGOS[brand] ? (
                                    <img
                                        src={BRAND_LOGOS[brand]}
                                        alt={`${brand} Official Logo`}
                                        className={styles.brandLogo}
                                    />
                                ) : (
                                    <span className={styles.brandName}>{brand}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
