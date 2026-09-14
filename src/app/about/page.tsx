import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About Raj Electronics - Secunderabad\'s Trusted Electronics Dealer since 1995',
    description: 'Learn about the legacy of Raj Electronics. Over 30 years of trust, unbeatable wholesale pricing on ACs and TVs, and dedicated post-sale support on RP Road.',
    alternates: { canonical: 'https://rajelectronics.co/about' }
};

export default function AboutPage() {
    return (
        <div className={styles.aboutContainer}>
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay}>
                    <div className="container" style={{ textAlign: 'center', color: 'white' }}>
                        <span className={styles.establishedBadge} style={{ display: 'inline-block', padding: '8px 16px', background: '#2563eb', borderRadius: '50px', marginBottom: '20px', fontWeight: 'bold' }}>Established 1995</span>
                        <h1 className={styles.heroTitle} style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
                            About Raj Electronics - Secunderabad's Trusted Electronics Dealer since 1995
                        </h1>
                        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                            For nearly three decades, Raj Electronics has been the heartbeat of RP Road, delivering top-tier home appliances at unbeatable prices, backed by service you can trust.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', color: '#1e3a8a', marginBottom: '20px', fontWeight: 800 }}>The Founder Story</h2>
                            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, marginBottom: '15px' }}>
                                Founded in 1995, Raj Electronics began with a simple mission: to provide every family in Secunderabad and Hyderabad with high-quality electronics at prices they could afford. Over the past 30 years, we have built a legacy based entirely on trust and community relationships.
                            </p>
                            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, marginBottom: '15px' }}>
                                Through decades of consistent service, we have cultivated deep, direct relationships with global leading brands. This allows us to leverage immense wholesale buying power, which means we can bypass middlemen and pass those substantial discounts directly to our customers.
                            </p>
                            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8 }}>
                                What started as a modest storefront on RP Road has flourished into a household name, serving over 50,000 happy families who know they can rely on Raj Electronics for transparency, authenticity, and care.
                            </p>
                        </div>
                        <div style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/images/shop front.jpeg"
                                alt="Raj Electronics Store Secunderabad"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 0', background: '#f8fafc' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '40px', fontWeight: 800, textAlign: 'center' }}>Categories We Dominate</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>❄️</div>
                            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px', fontWeight: 700 }}>Air Conditioners</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>We hold the largest live display of ACs on RP Road. From Split to Tower ACs, our expert staff guides you to choose the perfect cooling solution tailored for your room size.</p>
                        </div>
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📺</div>
                            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px', fontWeight: 700 }}>Televisions</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Experience immersive entertainment with our curated range of Smart LED, OLED, and QLED TVs. We partner directly with premium brands to give you the best visual tech.</p>
                        </div>
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🧺</div>
                            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px', fontWeight: 700 }}>Home Appliances</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Upgrade your lifestyle with our complete range of Refrigerators, Washing Machines, and Water Dispensers, all backed by 100% genuine brand warranties.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', color: '#1e3a8a', marginBottom: '40px', fontWeight: 800, textAlign: 'center' }}>Why Secunderabad Chooses Us</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                        <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '20px' }}>
                            <h4 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '10px', fontWeight: 700 }}>Best Price Guarantee</h4>
                            <p style={{ color: '#475569', lineHeight: 1.5 }}>Our wholesale volume means unmatched retail pricing. We consistently beat big-box stores.</p>
                        </div>
                        <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '20px' }}>
                            <h4 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '10px', fontWeight: 700 }}>Post-sale Support</h4>
                            <p style={{ color: '#475569', lineHeight: 1.5 }}>Our relationship doesn't end at the bill. We ensure seamless installation and long-term service support.</p>
                        </div>
                        <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '20px' }}>
                            <h4 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '10px', fontWeight: 700 }}>Bulk Order Capabilities</h4>
                            <p style={{ color: '#475569', lineHeight: 1.5 }}>Equipping a new office or hotel? We handle institutional orders with specialized B2B pricing and GST invoicing.</p>
                        </div>
                        <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '20px' }}>
                            <h4 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '10px', fontWeight: 700 }}>30 Years of Trust</h4>
                            <p style={{ color: '#475569', lineHeight: 1.5 }}>Since 1995, families across generations have trusted us for authenticity and right guidance.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection} style={{ padding: '60px 0', background: '#0f172a', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Ready to Upgrade Your Home?</h2>
                    <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>Visit our showroom on RP Road, Secunderabad or browse our collection online.</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link href="/" style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 600 }}>Browse Products</Link>
                        <Link href="/bulk-orders" style={{ padding: '12px 24px', background: 'transparent', color: 'white', border: '2px solid #3b82f6', borderRadius: '8px', fontWeight: 600 }}>Bulk Inquiries</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
