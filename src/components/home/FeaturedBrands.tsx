"use client";

import styles from './FeaturedBrands.module.css';
import { BRANDS } from '@/types';

const BRAND_LOGOS: Record<string, string> = {
    "Lloyd":      "/brands/lloyd.png",
    "Whirlpool":  "/brands/whirlpool.png",
    "Crompton":   "/brands/crompton.png",
    "Orient":     "/brands/orient.png",
    "TG Smart":   "/brands/tgsmart.png.jpeg",
    "Samsung":    "/brands/samsung.svg",
    "Daikin":     "/brands/daikin.svg",
    "Carrier":    "/brands/carrier.svg",
    "Bluestar":   "/brands/bluestar.svg",
    "Sansui":     "/brands/sansui.svg",
};

export default function FeaturedBrands() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Authorised Dealer for Top Brands</h2>
                <p className={styles.subtitle}>We stock products from India's most trusted electronics manufacturers</p>
                <div className={styles.grid}>
                    {BRANDS.map(brand => (
                        <div key={brand} className={styles.brandCard}>
                            {BRAND_LOGOS[brand] ? (
                                <img
                                    src={BRAND_LOGOS[brand]}
                                    alt={`${brand} authorised dealer Secunderabad`}
                                    className={styles.brandLogo}
                                />
                            ) : (
                                <span className={styles.brandName}>{brand}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
