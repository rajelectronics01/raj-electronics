'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

// Simple SVG Icons
const Icons = {
    Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    Fire: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.4-1.12.8-1.58.8-1.58.1.92.5 1.58 1.1 2.38z"></path></svg>,
    Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    ArrowRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.gridPattern}></div>

            <div className={styles.container}>
                {/* Left Content */}
                <div className={styles.content}>
                    <div className={styles.trustBadge}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icons.Star /> 4.9 Rating
                        </span>
                        <span className={styles.separator}></span>

                        <span>📍 Secunderabad</span>
                    </div>

                    <h1 className={styles.title}>
                        Upgrade Your Home <br />
                        With <span className={styles.highlight}>Smart Electronics</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Best Prices on ACs, Smart TVs, Refrigerators & Washing Machines with EMI Options Available.
                    </p>

                    <div className={styles.actions}>
                        <Link href="/category/all" style={{ textDecoration: 'none' }}>
                            <button className={styles.primaryBtn}>
                                Shop Now <Icons.ArrowRight />
                            </button>
                        </Link>

                        <a href="tel:+919290748866" style={{ textDecoration: 'none' }}>
                            <button className={styles.secondaryBtn}>
                                <Icons.Phone /> Call Now
                            </button>
                        </a>

                        <a href="https://maps.google.com/?q=Raj+Electronics+Secunderabad" target="_blank" style={{ textDecoration: 'none' }}>
                            <button className={styles.secondaryBtn}>
                                <Icons.MapPin /> Get Directions
                            </button>
                        </a>
                    </div>

                    <div className={styles.benefits}>
                        <div className={styles.benefitItem}>
                            <Icons.Check /> Same Day Delivery
                        </div>
                        <div className={styles.benefitItem}>
                            <Icons.Check /> Easy EMI Options
                        </div>
                        <div className={styles.benefitItem}>
                            <Icons.Check /> All Top Brands Available
                        </div>
                    </div>
                </div>

                {/* Right Content - Visual Area */}
                <div className={styles.showcase}>
                    {/* Card 1: AC */}
                    <Link href="/category/air-conditioners" className={`${styles.productCard} ${styles.card1}`}>
                        <div className={styles.cardImage}>❄️</div>
                        <div className={styles.cardInfo}>
                            <h3 className={styles.cardTitle}>Split ACs</h3>
                            <p className={styles.cardPrice}>From <span className={styles.priceTag}>₹24,999</span></p>
                        </div>
                    </Link>

                    {/* Card 2: Smart TV (Center) */}
                    <Link href="/category/televisions" className={`${styles.productCard} ${styles.card2} ${styles.floating}`}>
                        <div className={styles.cardImage}>📺</div>
                        <div className={styles.cardInfo}>
                            <h3 className={styles.cardTitle} style={{ fontSize: '1.3rem' }}>4K Smart TVs</h3>
                            <p className={styles.cardPrice}>Starting from <span className={styles.priceTag}>₹12,999</span></p>
                        </div>
                    </Link>

                    {/* Card 3: Refrigerator */}
                    <Link href="/category/refrigerators" className={`${styles.productCard} ${styles.card3}`}>
                        <div className={styles.cardImage}>🧊</div>
                        <div className={styles.cardInfo}>
                            <h3 className={styles.cardTitle}>Refrigerators</h3>
                            <p className={styles.cardPrice}>From <span className={styles.priceTag}>₹15,999</span></p>
                        </div>
                    </Link>

                    {/* Card 4: Washing Machine */}
                    <Link href="/category/washing-machines" className={`${styles.productCard} ${styles.card4}`}>
                        <div className={styles.cardImage}>🌀</div>
                        <div className={styles.cardInfo}>
                            <h3 className={styles.cardTitle}>Washing Machines</h3>
                            <p className={styles.cardPrice}>From <span className={styles.priceTag}>₹11,999</span></p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Bottom Wave Divider */}
            <div className={styles.wave}>
                <svg viewBox="0 0 1440 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>
        </section>
    );
}
