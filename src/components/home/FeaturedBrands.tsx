"use client";

import styles from './FeaturedBrands.module.css';
import { BRANDS } from '@/types';
import Link from 'next/link';

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
    "Sansui":     "/brands/sansui.png",
    "LG":         "/brands/lg.png",
    "Voltas":     "/brands/voltas.svg",
    "Mitsubishi": "/brands/mitsubishi.png",
    "O-General":  "/brands/o-general.svg",
    "Hitachi":    "/brands/hitachi.svg",
    "Godrej":     "/brands/godrej.png",
    "Haier":      "/brands/haier.png",
};

export default function FeaturedBrands() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Authorised Dealer for Top Brands</h2>
                <p className={styles.subtitle}>We stock products from India's most trusted electronics manufacturers</p>
                <div className={styles.grid}>
                    {BRANDS.map(brand => (
                        <Link 
                            key={brand} 
                            href={`/search?q=${encodeURIComponent(brand)}`}
                            className={styles.brandCard}
                        >
                            {BRAND_LOGOS[brand] ? (
                                <img
                                    src={BRAND_LOGOS[brand]}
                                    alt={`${brand} authorised dealer Secunderabad`}
                                    className={styles.brandLogo}
                                />
                            ) : (
                                <span className={styles.brandName}>{brand}</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

