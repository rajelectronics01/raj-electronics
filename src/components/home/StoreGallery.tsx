'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './StoreGallery.module.css';

export default function StoreGallery({ initialImages }: { initialImages?: any }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const defaultImages = [
        { src: '/images/shop front.jpeg', alt: 'Shop Front View' },
        { src: '/images/shop main.jpeg', alt: 'Main Shop Area' },
        { src: '/images/shop in.jpeg', alt: 'Inside the Shop' },
        { src: '/images/interior.jpeg', alt: 'Shop Interior' },
        { src: '/images/shop ref.jpeg', alt: 'Shop Reference View' },
        { src: '/images/raj.png', alt: 'Raj Electronics Logo/Sign' },
        { src: '/images/tg.png', alt: 'Store Feature' },
    ];

    const images = Array.isArray(initialImages) && initialImages.length > 0 ? initialImages : defaultImages;

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
                            <div 
                                key={index} 
                                className={styles.imageCard}
                                onClick={() => setLightboxImage(img.src)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 260px, 300px"
                                    />
                                    <div className={styles.overlayHint}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "white", margin: "auto", position: "absolute", top: 0, bottom: 0, left: 0, right: 0, opacity: 0.8 }}>
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            <line x1="11" y1="8" x2="11" y2="14"></line>
                                            <line x1="8" y1="11" x2="14" y2="11"></line>
                                        </svg>
                                    </div>
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

            {/* LIGHTBOX CODE */}
            {lightboxImage && (
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                    onClick={() => setLightboxImage(null)}
                >
                    <button 
                        style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer', zIndex: 10000 }}
                        onClick={() => setLightboxImage(null)}
                    >
                        &times;
                    </button>
                    <div style={{ position: 'relative', width: '90%', height: '90%', maxWidth: '1200px' }} onClick={e => e.stopPropagation()}>
                        <Image
                            src={lightboxImage}
                            alt="Expanded View"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
