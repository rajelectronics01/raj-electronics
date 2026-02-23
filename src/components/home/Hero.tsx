// Removed 'use client' to allow server rendering of images without hydration jumps

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

// Simple SVG Icons
const Icons = {
    ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
};

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.ambientGlowRed}></div>

            <div className={styles.container}>
                {/* Main Banner (Left Side) - Act as primary Hero */}
                <div className={styles.mainBanner}>
                    <div className={styles.bannerBackground}>
                        <Image src="/images/hero/blue-white-bg.png" alt="Smart Home Appliances" fill priority style={{ objectFit: 'cover' }} className={styles.bgImg} />
                        <div className={styles.bgOverlay}></div>
                    </div>

                    <div className={styles.bannerContent}>
                        <h1 className={styles.title}>
                            Best Electronics Store in <span className={styles.highlight}>Secunderabad</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Authorized Dealer for premium ACs, TVs, and Home Appliances on RP Road. Best prices and instant EMI.
                        </p>

                        <p className={styles.bannerDesc}>
                            Top brands. Best prices. Easy EMI available.<br />
                            Visit Raj Electronics, Secunderabad.
                        </p>

                        <div className={styles.bannerActions}>
                            <Link href="/category/all" className={styles.primaryBtn}>
                                Shop Now
                            </Link>
                            <Link href="/category/all" className={styles.outlineBtn}>
                                View Offers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Content - Deals Grid */}
                <div className={styles.dealsGrid}>

                    {/* Deal Card 1 - AC */}
                    <Link href="/category/air-conditioners" className={styles.dealCard}>
                        <div className={styles.dealBadge}>UP TO 40% OFF</div>
                        <div className={styles.cardGlow}></div>
                        <div className={styles.dealContent}>
                            <h3 className={styles.dealTitle}>Air Conditioners<br />Special Deals</h3>
                            <p className={styles.dealSubText}>Save up to ₹8,000<br /><span className={styles.emiText}>EMI Available</span></p>
                        </div>
                        <div className={styles.dealImageWide}>
                            <div className={styles.imageWrapper}>
                                <Image src="/images/hero/ac-clean.png" alt="Air Conditioner Deals" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} loading="lazy" />
                            </div>
                        </div>
                        <div className={styles.dealCta}>
                            <div className={styles.roundCta}><Icons.ChevronRight /></div>
                        </div>
                    </Link>

                    {/* Deal Card 2 - TV */}
                    <Link href="/category/televisions" className={styles.dealCard}>
                        <div className={styles.dealBadge}>TOP BRAND</div>
                        <div className={styles.cardGlow}></div>
                        <div className={styles.dealContent}>
                            <h3 className={styles.dealTitle}>Smart TVs Sale</h3>
                            <p className={styles.dealSubText}>4K & OLED Models<br /><span className={styles.emiText}>Exchange Offers</span></p>
                        </div>
                        <div className={styles.dealImageWide}>
                            <div className={styles.imageWrapperTV}>
                                <Image src="/images/hero/tv-clean.png" alt="Smart TV Offers" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} loading="lazy" />
                            </div>
                        </div>
                        <div className={styles.dealCta}>
                            <div className={styles.roundCta}><Icons.ChevronRight /></div>
                        </div>
                    </Link>

                    {/* Deal Card 3 - Fridge */}
                    <Link href="/category/refrigerators" className={styles.dealCard}>
                        <div className={styles.dealBadge}>MEGA SALE</div>
                        <div className={styles.cardGlow}></div>
                        <div className={styles.dealContent}>
                            <h3 className={styles.dealTitle}>Refrigerator<br />Offers</h3>
                            <p className={styles.dealSubText}>Double Door & Side-by-Side<br /><span className={styles.emiText}>Starting ₹14,999</span></p>
                        </div>
                        <div className={styles.dealImageTall}>
                            <div className={styles.imageWrapper}>
                                <Image src="/images/hero/fridge-clean.png" alt="Refrigerator Discounts" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} loading="lazy" />
                            </div>
                        </div>
                        <div className={styles.dealCta}>
                            <div className={styles.roundCta}><Icons.ChevronRight /></div>
                        </div>
                    </Link>

                    {/* Deal Card 4 - Washing Machine */}
                    <Link href="/category/washing-machines" className={styles.dealCard}>
                        <div className={styles.dealBadge}>BEST SELLER</div>
                        <div className={styles.cardGlow}></div>
                        <div className={styles.dealContent}>
                            <h3 className={styles.dealTitle}>Washing Machines</h3>
                            <p className={styles.dealSubText}>Fully Automatic | Best Prices<br /><span className={styles.emiText}>Free Install</span></p>
                        </div>
                        <div className={styles.dealImageWide}>
                            <div className={styles.imageWrapper}>
                                <Image src="/images/hero/washing-machine-clean.png" alt="Washing Machine Sale" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} loading="lazy" />
                            </div>
                        </div>
                        <div className={styles.dealCta}>
                            <div className={styles.roundCta}><Icons.ChevronRight /></div>
                        </div>
                    </Link>

                </div>
            </div>

            {/* Support/Info Bar */}
            <div className={styles.infoBarWrapper}>
                <div className={styles.infoContainer}>
                    <div className={styles.infoItem}>
                        ₹ Easy EMI Options
                    </div>
                    <div className={styles.infoItem}>
                        🛠️ Same Day Installation
                    </div>
                    <div className={styles.infoItem}>
                        🛡️ Trusted Since 1993
                    </div>
                    <div className={styles.infoItem}>
                        ⭐ 4.9 <span style={{ opacity: 0.8, marginLeft: '4px' }}>Customer Rating</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
