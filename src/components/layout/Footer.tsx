import Link from 'next/link';
import styles from './Footer.module.css';
import { MapPinIcon, PhoneIcon } from '@/components/icons/Icons';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>

                    {/* Column 1: About */}
                    <div className={styles.col}>
                        <h3 className={styles.heading}>Raj Electronics</h3>
                        <p className={styles.tagline}>Your Trusted Electronics Store in Secunderabad.</p>
                        <div className={styles.contactItem}>
                            <MapPinIcon className={styles.icon} />
                            <address className={styles.address}>
                                7-1-949, Rashtrapati Rd,<br />
                                Beside Uggra Laxmi Narsimha Swamy Temple,<br />
                                Secunderabad,<br />
                                Telangana 500003
                            </address>
                        </div>
                        <div className={styles.contactItem}>
                            <PhoneIcon className={styles.icon} />
                            <a href="tel:+919290748866">+91 92907 48866</a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>Quick Links</h4>
                        <ul className={styles.links}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/category/all">All Products</Link></li>
                            <li><Link href="/category/air-conditioners">Air Conditioners</Link></li>
                            <li><Link href="/category/televisions">Smart TVs</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policy / Socials */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>Customer Service</h4>
                        <ul className={styles.links}>
                            <li><Link href="#">About Us</Link></li>
                            <li><Link href="#">Contact Us</Link></li>
                            <li><Link href="#">Terms & Conditions</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Raj Electronics. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
