'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';
import OccasionBanner from './OccasionBanner';
import { bannerAlt, type Occasion, type BannerProduct } from '@/lib/occasions';

// These represent full-width cinematic banner images like your reference.
// Simply drop your actual banner graphics into the public/images/hero/ folder and update the paths.
const DEFAULT_SLIDES = [
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

/** One generated banner and the live deals it shows. */
export interface HeroBanner {
    occasion: Occasion;
    products: BannerProduct[];
}

/** Either a generated banner or an uploaded image — the slider takes both. */
interface Slide {
    id?: string | number;
    link: string;
    alt: string;
    occasion?: Occasion;
    products?: BannerProduct[];
    image?: string;
    mobileImage?: string;
}

export default function Hero({
    initialSlides,
    banners = [],
}: {
    initialSlides?: any;
    /**
     * Generated banners to lead with — the festival on air, then the week's
     * campaign. Drawn in CSS, so nothing has to be uploaded for one to appear.
     */
    banners?: HeroBanner[];
}) {
    const baseSlides = Array.isArray(initialSlides) && initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES;

    // Generated banners go first — they are the reason someone is visiting today.
    const slides: Slide[] = [
        ...banners.map((banner) => ({
            id: `banner-${banner.occasion.id}`,
            occasion: banner.occasion,
            products: banner.products,
            link: banner.occasion.href,
            // The artwork is CSS, so this text is the only description a screen
            // reader or a crawler ever gets for the slide.
            alt: bannerAlt(banner.occasion, banner.products),
        })),
        ...baseSlides,
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
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
                    {slides.map((slide, idx) => (
                        <Link
                            href={slide.link}
                            key={slide.id || idx}
                            className={styles.slide}
                            /* A generated banner's alt text is already a full
                               sentence; an uploaded slide's is just a name. */
                            aria-label={slide.occasion ? slide.alt : `Go to ${slide.alt}`}
                        >
                            {slide.occasion ? (
                                /* Auto-generated banner — drawn in CSS, no image file. */
                                <OccasionBanner occasion={slide.occasion} products={slide.products} />
                            ) : (
                                <>
                                    <Image
                                        src={slide.image!}
                                        alt={slide.alt}
                                        fill
                                        className={`${styles.slideImage} ${slide.mobileImage ? styles.desktopImage : ''}`}
                                        priority={idx === 0}
                                        sizes="100vw"
                                    />
                                    {slide.mobileImage && (
                                        <Image
                                            src={slide.mobileImage!}
                                            alt={slide.alt}
                                            fill
                                            className={`${styles.slideImage} ${styles.mobileImage}`}
                                            priority={idx === 0}
                                            sizes="100vw"
                                        />
                                    )}
                                </>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className={styles.dotsWrapper}>
                    {slides.map((_, idx) => (
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
