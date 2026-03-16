'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

const SLIDES = [
    {
        id: 1,
        title: "BIGGEST AC FESTIVAL",
        subtitle: "Kam Bill. Zyada Chill.",
        badge: "UP TO 50% OFF!",
        image: "/images/hero/ac-clean.png",
        bgColor: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", /* Blue summery vibe */
        textColor: "white",
        btnColor: "styles.lightBtn",
        link: "/category/air-conditioners"
    },
    {
        id: 2,
        title: "GUDI PADWA & UGADI",
        subtitle: "Celebrate New Beginnings",
        badge: "FESTIVE OFFERS",
        image: "/images/hero/tv-clean.png",
        bgColor: "linear-gradient(90deg, #ea580c 0%, #facc15 100%)", /* Festive orange/yellow */
        textColor: "white",
        btnColor: "styles.darkBtn",
        link: "/category/televisions"
    },
    {
        id: 3,
        title: "START YOUR MORNING",
        subtitle: "THE SMART WAY",
        badge: "UP TO 60% OFF",
        image: "/images/hero/fridge-clean.png",
        bgColor: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", /* Sleek grey/silver */
        textColor: "#0f172a",
        btnColor: "styles.darkBtn",
        link: "/category/refrigerators"
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
                        <div 
                            key={slide.id} 
                            className={styles.slide}
                            style={{ background: slide.bgColor }}
                        >
                            <div className={styles.slideContent} style={{ color: slide.textColor }}>
                                <div className={styles.slideBadge}>{slide.badge}</div>
                                <h2 className={styles.slideTitle} style={{ color: slide.textColor }}>{slide.title}</h2>
                                <h3 className={styles.slideSubtitle} style={{ color: slide.textColor }}>{slide.subtitle}</h3>
                                <Link 
                                    href={slide.link} 
                                    className={`${styles.slideBtn} ${slide.textColor === 'white' ? styles.lightBtn : ''}`}
                                >
                                    Shop Now
                                </Link>
                            </div>
                            
                            <div className={styles.slideImageWrap}>
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    width={600}
                                    height={400}
                                    className={styles.slideImage}
                                    priority={idx === 0} // Only prioritize the first one
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className={styles.dotsWrapper}>
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${currentSlide === idx ? styles.active : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
