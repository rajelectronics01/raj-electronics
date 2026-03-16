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
        image: "/images/hero/Gudi Padwa  Ugadi Offers_Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_1.jpeg",
        alt: "Gudi Padwa & Ugadi Offers",
        link: "/category/all"
    },
    {
        id: 2,
        image: "/images/hero/Biggest Ac Fest Desktop Banner.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_2.jpeg",
        alt: "Biggest AC Festival",
        link: "/category/air-conditioners"
    },
    {
        id: 3,
        image: "/images/hero/Breakfast Essentials  Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_3.jpeg",
        alt: "Breakfast Essentials",
        link: "/category/kitchen-appliances"
    },
    {
        id: 4,
        image: "/images/hero/Air_Cooler_Category_Banner_-_Desktop_1920x.webp",
        mobileImage: "/images/hero/mobile/mobile_banner_4.jpeg",
        alt: "Air Coolers",
        link: "/category/air-coolers"
    },
    {
        id: 5,
        image: "/images/hero/REF Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_5.jpeg",
        alt: "Refrigerators Offers",
        link: "/category/refrigerators"
    },
    {
        id: 6,
        image: "/images/hero/catagory_horzontal_copy_2_1.webp",
        mobileImage: undefined, // No 6th mobile uploaded, fallback to desktop
        alt: "Horizontal Offers",
        link: "/category/all"
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
                                alt={`Desktop: ${slide.alt}`}
                                fill
                                className={`${styles.slideImage} ${styles.desktopImage}`}
                                priority={idx === 0} // Prioritize loading the very first image for LCP
                                sizes="(min-width: 768px) 100vw, 1px"
                            />
                            {slide.mobileImage && (
                                <Image
                                    src={slide.mobileImage}
                                    alt={`Mobile: ${slide.alt}`}
                                    fill
                                    className={`${styles.slideImage} ${styles.mobileImage}`}
                                    priority={idx === 0} 
                                    sizes="(max-width: 767px) 100vw, 1px"
                                />
                            )}
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
