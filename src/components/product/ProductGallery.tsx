"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images && images.length > 0 ? images[0] : '/placeholder.png');

    if (!images || images.length === 0) {
        return (
            <div className={styles.mainImageWrapper}>
                <Image
                    src="/placeholder.png"
                    alt={name}
                    fill
                    className={styles.mainImage}
                    priority
                />
            </div>
        );
    }

    return (
        <div className={styles.galleryContainer}>
            <div className={styles.mainImageWrapper}>
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className={styles.mainImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            className={cn(styles.thumbnailBtn, selectedImage === img ? styles.active : '')}
                            onClick={() => setSelectedImage(img)}
                        >
                            <div className={styles.thumbnailWrapper}>
                                <Image
                                    src={img}
                                    alt={`${name} view ${idx + 1}`}
                                    fill
                                    className={styles.thumbnail}
                                    sizes="80px"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
