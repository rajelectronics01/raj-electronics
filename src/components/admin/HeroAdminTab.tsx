"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from './HeroAdminTab.module.css';

// Default initial state matching current simple Hero Banner
const defaultSlides = [
    {
        id: '1',
        image: "/images/hero/Gudi Padwa  Ugadi Offers_Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_1.jpeg",
        alt: "Gudi Padwa & Ugadi Offers",
        link: "/category/all"
    },
    {
        id: '2',
        image: "/images/hero/Biggest Ac Fest Desktop Banner.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_2.jpeg",
        alt: "Biggest AC Festival",
        link: "/category/air-conditioners"
    },
    {
        id: '3',
        image: "/images/hero/Breakfast Essentials  Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_3.jpeg",
        alt: "Breakfast Essentials",
        link: "/category/kitchen-appliances"
    },
    {
        id: '4',
        image: "/images/hero/Air_Cooler_Category_Banner_-_Desktop_1920x.webp",
        mobileImage: "/images/hero/mobile/mobile_banner_4.jpeg",
        alt: "Air Coolers",
        link: "/category/air-coolers"
    },
    {
        id: '5',
        image: "/images/hero/REF Desktop.jpg",
        mobileImage: "/images/hero/mobile/mobile_banner_5.jpeg",
        alt: "Refrigerators Offers",
        link: "/category/refrigerators"
    },
    {
        id: '6',
        image: "/images/hero/catagory_horzontal_copy_2_1.webp",
        mobileImage: "", 
        alt: "Horizontal Offers",
        link: "/category/all"
    }
];

export default function HeroAdminTab() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIdx, setUploadingIdx] = useState<{ idx: number, field: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/settings?key=hero')
            .then(res => res.json())
            .then(data => {
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                    setSlides(data.data);
                } else {
                    setSlides(defaultSlides);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'hero', value: slides })
            });
            if (res.ok) {
                alert('Hero Banners updated successfully!');
            } else {
                alert('Failed to update Hero Banners.');
            }
        } catch (e) {
            alert('Error saving Hero Banners.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number, field: 'image' | 'mobileImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIdx({ idx, field });
        const form = new FormData();
        form.append('files', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            if (res.ok) {
                const data = await res.json();
                const url = data.urls[0];
                const newArr = [...slides];
                newArr[idx][field] = url;
                setSlides(newArr);
            }
        } catch (e) {
            alert('Upload failed.');
        } finally {
            setUploadingIdx(null);
        }
    };

    const addSlide = () => {
        setSlides([
            ...slides, 
            {
                id: `slide_${Date.now()}`,
                image: '',
                mobileImage: '',
                alt: 'New Promo Banner',
                link: '/category/all'
            }
        ]);
        // Scroll to the new slide
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const updateSlide = (idx: number, field: string, value: any) => {
        const newArr = [...slides];
        newArr[idx][field] = value;
        setSlides(newArr);
    }

    const removeSlide = (idx: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            setSlides(slides.filter((_, i) => i !== idx));
        }
    };

    const moveSlide = (idx: number, dir: -1 | 1) => {
        if (idx + dir < 0 || idx + dir >= slides.length) return;
        const newArr = [...slides];
        const temp = newArr[idx];
        newArr[idx] = newArr[idx + dir];
        newArr[idx + dir] = temp;
        setSlides(newArr);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Manage Hero Banners</h2>
                <div className={styles.actions}>
                    <Button onClick={addSlide} variant="outline">Add Banner</Button>
                    <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </div>

            <div className={styles.bannerList}>
                {slides.map((slide, idx) => (
                    <div key={slide.id || idx} className={styles.bannerItem}>
                        <div className={styles.itemHeader}>
                            <h4 className={styles.itemTitle}>Banner #{idx + 1}</h4>
                            <div className={styles.itemActions}>
                                <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} style={{ padding: '8px', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                                <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} style={{ padding: '8px', cursor: 'pointer', opacity: idx === slides.length - 1 ? 0.3 : 1 }}>↓</button>
                                <button onClick={() => removeSlide(idx)} style={{ padding: '8px', cursor: 'pointer', color: 'red', marginLeft: '10px' }}>❌</button>
                            </div>
                        </div>

                        <div className={styles.itemGrid}>
                            {/* Link & Alt Settings */}
                            <div className={styles.settingsSection}>
                                <label className={styles.label}>Click Destination Link</label>
                                <input className={styles.input} value={slide.link} onChange={e => updateSlide(idx, 'link', e.target.value)} placeholder="/category/air-conditioners" />

                                <label className={styles.label}>Description (Image Alt Text)</label>
                                <input className={styles.input} value={slide.alt} onChange={e => updateSlide(idx, 'alt', e.target.value)} placeholder="Summer AC Offers" />
                            </div>

                            {/* Image Settings */}
                           <div className={styles.imageSection}>
                                <label className={styles.label}>Desktop Image Banner</label>
                                <div className={styles.uploadRow}>
                                    <input className={styles.input} style={{ marginBottom: 0 }} value={slide.image || ''} onChange={e => updateSlide(idx, 'image', e.target.value)} placeholder="/images/..." />
                                    <label className={styles.uploadLabel}>
                                        {uploadingIdx?.idx === idx && uploadingIdx.field === 'image' ? '...' : 'Upload'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, idx, 'image')} />
                                    </label>
                                </div>
                                {slide.image && <img src={slide.image} className={styles.previewDesktop} alt="Desktop Preview" />}

                                <label className={styles.label}>Mobile Image Banner (Optional)</label>
                                <div className={styles.uploadRow}>
                                    <input className={styles.input} style={{ marginBottom: 0 }} value={slide.mobileImage || ''} onChange={e => updateSlide(idx, 'mobileImage', e.target.value)} placeholder="Will use desktop if omitted" />
                                    <label className={styles.uploadLabel}>
                                        {uploadingIdx?.idx === idx && uploadingIdx.field === 'mobileImage' ? '...' : 'Upload'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, idx, 'mobileImage')} />
                                    </label>
                                </div>
                                {slide.mobileImage && <img src={slide.mobileImage} className={styles.previewMobile} alt="Mobile Preview" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {slides.length === 0 && <p style={{ color: '#64748b' }}>No banners. Add one to get started.</p>}
        </div>
    );
}
