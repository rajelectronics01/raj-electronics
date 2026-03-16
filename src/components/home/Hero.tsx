'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

// These represent full-width cinematic banner images like your reference.
// Simply drop your actual banner graphics into the public/images/hero/ folder and update the paths.
const SLIDES = [
    {
        id: 1,
        // Replace with your Gudi Padwa banner image
        image: "/images/hero/main-banner.jpg", 
        alt: "Gudi Padwa & Ugadi Offers",
        link: "/category/all"
    },
    {
        id: 2,
        // Replace with your AC Festival banner image
        image: "/images/hero/main-banner.png", 
        alt: "Biggest AC Festival",
        link: "/category/air-conditioners"
    },
    {
        id: 3,
        // Replace with your Smart Morning (Kitchen) banner image
        image: "/images/hero/main-banner.jpg", 
        alt: "Start Your Morning The Smart Way",
        link: "/category/home-appliances"
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    // Auto-advance slides
    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000); // 5 seconds per slide
            return () => clearInterval(timer);
        }
    }, [isHovered, nextSlide]);

    return (
        <section 
            className={styles.heroWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.sliderContainer}>
                
                {/* Arrow Controls */}
                <button 
                    className={`${styles.arrowBtn} ${styles.arrowLeft}`} 
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                >
                    <ChevronLeftIcon width={28} height={28} />
                </button>
                <button 
                    className={`${styles.arrowBtn} ${styles.arrowRight}`} 
                    onClick={nextSlide}
                    aria-label="Next Slide"
                >
                    <ChevronRightIcon width={28} height={28} />
                </button>

                {/* Slides Track */}
                <div 
                    className={styles.slideTrack}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {SLIDES.map((slide, idx) => (
                        <Link 
                            href={slide.link} 
                            key={slide.id} 
                            className={styles.slide}
                            aria-label={`Go to ${slide.alt}`}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.alt}
                                fill
                                className={styles.slideImage}
                                priority={idx === 0} // Prioritize loading the very first image for LCP
                                sizes="100vw"
                            />
                        </Link>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className={styles.dotsWrapper}>
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${currentSlide === idx ? styles.active : ''}`}
                            onClick={(e) => {
                                e.preventDefault(); // prevent triggering the link wrapping the slide when dots overlap
                                setCurrentSlide(idx);
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
