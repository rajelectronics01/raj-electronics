'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSlider.module.css';

// ─── Slide Data ───
const SLIDES = [
    {
        id: 'ac',
        eyebrow: 'Authorized Dealer · RP Road, Secunderabad',
        headline: "Secunderabad's Largest Live AC Display",
        subline: 'Walk in. Feel the difference before you decide.',
        ctaPrimary: { label: 'Explore Air Conditioners', href: '/category/air-conditioners' },
        ctaSecondary: { label: 'Call for Best Price', href: 'tel:+919290748866' },
        image: 'https://images.unsplash.com/photo-1591543620767-582b2e76369e?q=80&w=2600&auto=format&fit=crop',
        alt: 'Modern living room with air conditioning representing living comfort',
    },
    {
        id: 'tv',
        eyebrow: '4K · OLED · Google TV',
        headline: 'See It On The Wall Before It\'s On Yours',
        subline: 'Samsung, Sansui, and more — all live in-store.',
        ctaPrimary: { label: 'Browse Smart TVs', href: '/category/televisions' },
        ctaSecondary: { label: 'Call for Best Price', href: 'tel:+919290748866' },
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2600&auto=format&fit=crop',
        alt: 'Sleek modern television setup in a contemporary living space',
    },
    {
        id: 'fridge',
        eyebrow: 'Double Door · Side by Side · Single Door',
        headline: 'Best Prices. No Online Tricks.',
        subline: 'We guarantee to beat any verified price. Walk in or call.',
        ctaPrimary: { label: 'View Refrigerators', href: '/category/refrigerators' },
        ctaSecondary: { label: 'Call for Best Price', href: 'tel:+919290748866' },
        image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=2600&auto=format&fit=crop',
        alt: 'Luxury minimalist kitchen featuring high-end refrigeration appliances',
    },
    {
        id: 'wm',
        eyebrow: 'Fully Automatic · Semi Automatic',
        headline: 'Free Install. Same Day. Zero Hassle.',
        subline: "We don't just sell — we set it up right.",
        ctaPrimary: { label: 'Shop Washing Machines', href: '/category/washing-machines' },
        ctaSecondary: { label: 'Call for Best Price', href: 'tel:+919290748866' },
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2600&auto=format&fit=crop',
        alt: 'Clean and bright modern laundry room with high efficiency washing machine',
    },
    {
        id: 'trust',
        eyebrow: 'Established 1995',
        headline: 'Three Decades. One Address. 50,000 Families.',
        subline: 'Raj Electronics, 7-1-949 Rashtrapati Road, Secunderabad.',
        ctaPrimary: { label: 'Our Story', href: '/about' },
        ctaSecondary: { label: 'Get Directions', href: 'https://maps.google.com/?q=Raj+Electronics+RP+Road+Secunderabad', external: true },
        image: '/images/shop front.jpeg',
        alt: 'Raj Electronics shop front at RP Road, Secunderabad, showing the branded storefront',
    },
];

const SLIDE_COUNT = SLIDES.length;
const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progressActive, setProgressActive] = useState(false);

    const heroRef = useRef<HTMLElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pointerStartRef = useRef({ x: 0, y: 0, active: false });
    const reducedMotionRef = useRef(false);

    // ─── Check reduced motion preference ───
    useEffect(() => {
        reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // ─── Go to slide ───
    const goToSlide = useCallback((index: number) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(index);
        setProgressActive(false);

        setTimeout(() => {
            setIsAnimating(false);
        }, 650);
    }, [isAnimating, currentSlide]);

    const nextSlide = useCallback(() => {
        const next = (currentSlide + 1) % SLIDE_COUNT;
        goToSlide(next);
    }, [currentSlide, goToSlide]);

    const prevSlide = useCallback(() => {
        const prev = (currentSlide - 1 + SLIDE_COUNT) % SLIDE_COUNT;
        goToSlide(prev);
    }, [currentSlide, goToSlide]);

    // ─── Auto advance ───
    useEffect(() => {
        if (reducedMotionRef.current || isPaused) return;

        // Reset and start progress bar
        setProgressActive(false);
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setProgressActive(true);
            });
        });

        timerRef.current = setInterval(() => {
            setCurrentSlide(prev => {
                const next = (prev + 1) % SLIDE_COUNT;
                return next;
            });
            // Reset progress
            setProgressActive(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setProgressActive(true);
                });
            });
        }, AUTO_ADVANCE_MS);

        return () => {
            cancelAnimationFrame(raf);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused, currentSlide]);

    // ─── Keyboard navigation ───
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const hero = heroRef.current;
            if (!hero) return;

            const rect = hero.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                prevSlide();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // ─── Pointer/Swipe handling ───
    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') return;
        pointerStartRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!pointerStartRef.current.active) return;
        const diffX = Math.abs(e.clientX - pointerStartRef.current.x);
        const diffY = Math.abs(e.clientY - pointerStartRef.current.y);
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!pointerStartRef.current.active) return;
        pointerStartRef.current.active = false;

        const diffX = e.clientX - pointerStartRef.current.x;
        const diffY = Math.abs(e.clientY - pointerStartRef.current.y);

        if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > diffY) {
            if (diffX < 0) nextSlide();
            else prevSlide();
        }
    };

    // ─── Counter string ───
    const counterStr = String(currentSlide + 1).padStart(2, '0');

    return (
        <section
            ref={heroRef}
            className={styles.hero}
            id="hero-slider"
            aria-label="Hero slideshow"
            role="region"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStartRef.current.active = false; }}
            style={{ touchAction: 'pan-y pinch-zoom' }}
        >
            {/* Slide Counter */}
            <div className={styles.counter} aria-live="polite" aria-atomic="true">
                <span className={styles.counterCurrent}>
                    <span className={styles.counterNumber}>{counterStr}</span>
                </span>
                <span className={styles.counterTotal}> / 05</span>
            </div>

            {/* Slides Track */}
            <div
                className={styles.track}
                style={{ transform: `translateX(-${currentSlide * 20}%)` }}
            >
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        data-index={index}
                    >
                        {/* Text Panel */}
                        <div className={styles.textPanel}>
                            <p className={styles.eyebrow}>{slide.eyebrow}</p>
                            <h2 className={styles.headline}>{slide.headline}</h2>
                            <p className={styles.subline}>{slide.subline}</p>
                            <div className={styles.ctas}>
                                <Link
                                    href={slide.ctaPrimary.href}
                                    className={styles.ctaPrimary}
                                    id={`cta-${slide.id}`}
                                >
                                    {slide.ctaPrimary.label}
                                </Link>
                                {slide.ctaSecondary.external ? (
                                    <a
                                        href={slide.ctaSecondary.href}
                                        className={styles.ctaSecondary}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {slide.ctaSecondary.label}
                                    </a>
                                ) : (
                                    <a
                                        href={slide.ctaSecondary.href}
                                        className={styles.ctaSecondary}
                                    >
                                        {slide.ctaSecondary.label}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Photo Panel */}
                        <div className={styles.photoPanel}>
                            <Image
                                src={slide.image}
                                alt={slide.alt}
                                fill
                                sizes="(max-width: 767px) 100vw, 50vw"
                                className={styles.photoImage}
                                priority={index === 0}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                quality={85}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Dot Indicators */}
            <div className={styles.dots} role="tablist" aria-label="Slide navigation">
                {SLIDES.map((slide, index) => (
                    <button
                        key={slide.id}
                        className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                        onClick={() => goToSlide(index)}
                        role="tab"
                        aria-selected={index === currentSlide}
                        aria-label={`Slide ${index + 1}: ${slide.id === 'trust' ? 'Our Story' : slide.eyebrow}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className={styles.nav}>
                <button
                    className={styles.navBtn}
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className={styles.navBtn}
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className={styles.progress} aria-hidden="true">
                <div
                    className={`${styles.progressBar} ${progressActive ? styles.progressBarAnimating : ''}`}
                />
            </div>
        </section>
    );
}
