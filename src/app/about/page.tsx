import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About Raj Electronics | Best Electronics Store in Secunderabad',
    description: 'Established in 1995, Raj Electronics is Secunderabad\'s most trusted electronics retailer on RP Road. We offer the lowest prices on premium home appliances, the largest display of ACs, and unmatched after-sales service with over 50,000 happy families served.',
    keywords: 'Raj Electronics, electronics store Secunderabad, home appliances RP Road, buy AC Secunderabad, best electronics shop Hyderabad, washing machine dealer, refrigerators, lowest price electronics',
    openGraph: {
        title: 'About Raj Electronics - Secunderabad\'s Premier Appliance Store',
        description: 'Over 28 years of trust. Discover why thousands of families on RP Road choose us for their home appliances.',
        type: 'website',
        locale: 'en_IN',
    }
};

export default function AboutPage() {
    return (
        <div className={styles.aboutContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay}>
                    <div className="container">
                        <div className={styles.heroContent}>
                            <span className={styles.establishedBadge}>Established 1995</span>
                            <h1 className={styles.heroTitle}>Secunderabad's Most Trusted Electronics Destination</h1>
                            <p className={styles.heroSubtitle}>
                                For nearly three decades, Raj Electronics has been the heartbeat of RP Road, delivering top-tier home appliances at unbeatable prices, backed by service you can trust.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Stats Section */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3 className={styles.statNumber}>50k+</h3>
                            <p className={styles.statLabel}>Happy Families Served</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3 className={styles.statNumber}>28+</h3>
                            <p className={styles.statLabel}>Years of Excellence</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3 className={styles.statNumber}>#1</h3>
                            <p className={styles.statLabel}>AC Display on RP Road</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3 className={styles.statNumber}>100%</h3>
                            <p className={styles.statLabel}>Authorized Dealership</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyText}>
                            <h2 className={styles.sectionTitle}>Our Philosophy: Lowest Prices, Premium Service</h2>
                            <p className={styles.paragraph}>
                                Located in the bustling heart of <strong>Secunderabad on RP Road</strong>, Raj Electronics wasn't built just to sell boxes—we were built to upgrade homes. When you step into our showroom, you aren't just a customer; you are our neighbor.
                            </p>
                            <p className={styles.paragraph}>
                                We understand that buying a new Air Conditioner, Washing Machine, or Refrigerator is a major family decision. That is why we proudly house the <strong>largest live display of Air Conditioners</strong> in the entire RP Road market, allowing you to experience the cooling and quality firsthand before making a choice.
                            </p>
                            <p className={styles.paragraph}>
                                Our mission has remained simple since 1995: <em>Provide the local community with the absolute lowest prices on the best brands, without ever compromising on our legendary after-sales support.</em>
                            </p>

                            <div className={styles.featureList}>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>✓</div>
                                    <div className={styles.featureContent}>
                                        <h4 className={styles.featureTitle}>Unmatched Pricing</h4>
                                        <p className={styles.featureDesc}>We beat out the big-box retailers to pass the savings onto your family.</p>
                                    </div>
                                </div>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>✓</div>
                                    <div className={styles.featureContent}>
                                        <h4 className={styles.featureTitle}>Expert Guidance</h4>
                                        <p className={styles.featureDesc}>Our staff evaluates your room size and budget to recommend the perfect appliance, not just the most expensive one.</p>
                                    </div>
                                </div>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>✓</div>
                                    <div className={styles.featureContent}>
                                        <h4 className={styles.featureTitle}>Swift Installation & Delivery</h4>
                                        <p className={styles.featureDesc}>Fast, professional delivery and setup so your home is running smoothly on day one.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.storyImageWrapper}>
                            <div className={styles.imageBox}>
                                {/* Using a high quality Unsplash tech/store placeholder if no store picture exists */}
                                <Image
                                    src="https://images.unsplash.com/photo-1550214436-b6b2cded4872?q=80&w=2070&auto=format&fit=crop"
                                    alt="Premium Electronics Store Secunderabad"
                                    fill
                                    className={styles.storyImage}
                                />
                                <div className={styles.imageAccent}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>Experience the Difference Today</h2>
                        <p className={styles.ctaText}>
                            Visit our showroom on RP Road, Secunderabad, or browse our top brands online. Let our multi-generational expertise find the perfect appliance for your home.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/" className={styles.primaryButton}>Browse Products</Link>
                            <a href="tel:+919290748866" className={styles.secondaryButton}>Call Us: +91 9290748866</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
