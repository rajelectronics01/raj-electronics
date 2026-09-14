import Link from 'next/link';
import styles from './MobileCTA.module.css';

export default function MobileCTA() {
    return (
        <div className={styles.mobileCtaContainer}>
            <div className={styles.bannerBar}>
                Best Price Guaranteed • Bulk Orders Welcome
            </div>
            <div className={styles.buttonRow}>
                <Link href="tel:+919290748866" className={styles.callBtn}>
                    📞 Call Now
                </Link>
                <Link 
                    href="https://wa.me/919290748866?text=Hi%20Raj%20Electronics%2C%20I%20want%20to%20enquire%20about%20a%20product" 
                    target="_blank"
                    className={styles.waBtn}
                >
                    💬 WhatsApp
                </Link>
            </div>
        </div>
    );
}
