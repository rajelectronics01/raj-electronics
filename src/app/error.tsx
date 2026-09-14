'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

/**
 * RAJ ELECTRONICS: OUTAGE FALLBACK
 *
 * Catches render-time failures — most realistically the database being
 * unreachable — and shows a branded page with the shop's phone number
 * instead of Next.js's raw error screen. The status stays 5xx, which tells
 * Google the problem is temporary and protects our rankings.
 */

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[page error]', error?.message, error?.digest);
    }, [error]);

    return (
        <div className={`container ${styles.wrapper}`}>
            <div className={styles.card}>
                <div className={styles.icon} aria-hidden="true">🔌</div>

                <h1 className={styles.title}>We&apos;ll be right back</h1>

                <p className={styles.message}>
                    Our website is having a temporary technical problem — your order
                    and account details are safe. The shop is open as usual, so please
                    call us and we&apos;ll help you straight away.
                </p>

                <div className={styles.actions}>
                    <a href="tel:+919290748866" className={styles.primary}>
                        Call +91 92907 48866
                    </a>
                    <button onClick={reset} className={styles.secondary}>
                        Try again
                    </button>
                    <Link href="/" className={styles.secondary}>
                        Go to homepage
                    </Link>
                </div>

                <p className={styles.store}>
                    <strong>Raj Electronics</strong><br />
                    7-1-949 Rashtrapati Road, Secunderabad 500003<br />
                    Open daily, 10:30 am – 9:30 pm
                </p>
            </div>
        </div>
    );
}
