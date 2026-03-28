"use client";

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '@/components/ui/Button';
import styles from './ImageCropModal.module.css';

interface ImageCropModalProps {
    file: File;
    aspectRatio?: number;
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
}

export default function ImageCropModal({ file, aspectRatio = 16 / 9, onCropComplete, onCancel }: ImageCropModalProps) {
    const [imgSrc, setImgSrc] = useState('');
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(file);
    }, [file]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        // Select the full image by default
        const fullCrop: PixelCrop = {
            unit: 'px',
            x: 0,
            y: 0,
            width: width,
            height: height
        };
        setCrop(fullCrop);
        setCompletedCrop(fullCrop);
    }

    const handleConfirm = async () => {
        if (!imgRef.current || !completedCrop) return;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        
        // Use full natural resolution for the canvas to avoid blurriness
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob((blob) => {
            if (!blob) return;
            const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
            onCropComplete(croppedFile);
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Adjust & Crop Image</h3>
                    <button className={styles.closeBtn} onClick={onCancel}>&times;</button>
                </div>
                <div className={styles.body}>
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        </ReactCrop>
                    )}
                </div>
                <div className={styles.footer}>
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleConfirm}>Apply Crop & Upload</Button>
                </div>
            </div>
        </div>
    );
}
