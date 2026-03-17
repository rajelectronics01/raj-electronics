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
                        <p className={styles.tagline}>Top Dealer for ACs, TVs, Coolers & Home Appliances in Secunderabad & Hyderabad. Best Prices Guaranteed.</p>
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
                        <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', height: '120px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2766788876!2d78.498!3d17.447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzQ5LjIiTiA3OMKwMjknNTIuOCJF!5e0!3m2!1sen!2sin!4v1625555555555!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>Quick Links</h4>
                        <ul className={styles.links}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/category/all">All Electronics</Link></li>
                            <li><Link href="/category/air-conditioners">Best Air Conditioners</Link></li>
                            <li><Link href="/category/televisions">Smart TVs</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Categories & Info */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>Popular Categories & Info</h4>
                        <ul className={styles.links}>
                            <li><Link href="/category/air-coolers">Buy Air Coolers</Link></li>
                            <li><Link href="/category/refrigerators">Refrigerators</Link></li>
                            <li><Link href="/category/chest-freezers">Chest Freezers</Link></li>
                            <li><Link href="/category/water-dispensers">Water Dispensers</Link></li>
                            <li><Link href="/category/washing-machines">Washing Machines</Link></li>
                            <li><a href="https://maps.google.com/?q=Raj+Electronics+Secunderabad" target="_blank" rel="noopener noreferrer">Visit Our Store (Map)</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Policies & Support */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>Policies & Support</h4>
                        <ul className={styles.links}>
                            <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="/refund-policy">Refund & Cancellation</Link></li>
                            <li><Link href="/shipping-policy">Shipping Policy</Link></li>
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
