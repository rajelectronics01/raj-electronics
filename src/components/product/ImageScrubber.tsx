"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import styles from './ImageScrubber.module.css';

interface ImageScrubberProps {
    images: string[];
    alt: string;
    priority?: boolean;
}

export default function ImageScrubber({ images, alt, priority }: ImageScrubberProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current || images.length <= 1) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const segmentWidth = width / images.length;
        let index = Math.floor(x / segmentWidth);
        index = Math.max(0, Math.min(index, images.length - 1));
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(0);
    };

    if (!images || images.length === 0) {
        return <div className={styles.placeholderImage} />;
    }

    // Limit to max 5 images for the scrubber so it's not too crowded
    const displayImages = images.slice(0, 5);

    return (
        <div 
            className={styles.container}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={(e) => {
                if (!containerRef.current || displayImages.length <= 1) return;
                const { left, width } = containerRef.current.getBoundingClientRect();
                const x = e.touches[0].clientX - left;
                const segmentWidth = width / displayImages.length;
                let index = Math.floor(x / segmentWidth);
                index = Math.max(0, Math.min(index, displayImages.length - 1));
                setActiveIndex(index);
            }}
            onTouchEnd={handleMouseLeave}
        >
            <div 
                className={styles.track}
                style={{ 
                    transform: `translateX(-${(activeIndex * 100) / displayImages.length}%)`,
                    width: `${displayImages.length * 100}%` 
                }}
            >
                {displayImages.map((img, idx) => (
                    <div key={idx} className={styles.slide} style={{ width: `${100 / displayImages.length}%` }}>
                        <Image
                            src={img}
                            alt={`${alt} - view ${idx + 1}`}
                            fill
                            priority={priority && idx === 0}
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    </div>
                ))}
            </div>
            
            {displayImages.length > 1 && (
                <div className={styles.indicators}>
                    {displayImages.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`${styles.indicator} ${idx === activeIndex ? styles.active : ''}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
