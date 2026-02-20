'use client';

import { useRef } from 'react';
import Image from 'next/image';
import styles from './StoreGallery.module.css';

export default function StoreGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const images = [
        { src: '/images/shop front.jpeg', alt: 'Shop Front View' },
        { src: '/images/shop main.jpeg', alt: 'Main Shop Area' },
        { src: '/images/shop in.jpeg', alt: 'Inside the Shop' },
        { src: '/images/interior.jpeg', alt: 'Shop Interior' },
        { src: '/images/shop ref.jpeg', alt: 'Shop Reference View' },
        { src: '/images/raj.png', alt: 'Raj Electronics Logo/Sign' },
        { src: '/images/tg.png', alt: 'Store Feature' },
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // card width + gap
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Visit Our Gallery</h2>
                    <p className={styles.subtitle}>Take a look inside Raj Electronics. Experience our wide range of products.</p>
                </div>

                <div className={styles.galleryWrapper}>
                    <button
                        className={`${styles.scrollButton} ${styles.leftButton}`}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <div className={styles.scrollContainer} ref={scrollContainerRef}>
                        {images.map((img, index) => (
                            <div key={index} className={styles.imageCard}>
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 260px, 300px"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`${styles.scrollButton} ${styles.rightButton}`}
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
