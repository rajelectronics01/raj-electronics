"use client";

import { useState, useEffect } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Trash2, 
    Plus, 
    Image as ImageIcon, 
    Smartphone, 
    ExternalLink,
    Save, 
    RefreshCcw,
    LayoutDashboard
} from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './HeroAdminTab.module.css';
import ImageCropModal from './ImageCropModal';

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
    
    // Crop Management
    const [croppingInfo, setCroppingInfo] = useState<{ idx: number, field: 'image' | 'mobileImage', file: File } | null>(null);
    const [uploading, setUploading] = useState(false);

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

    const initiateFileUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number, field: 'image' | 'mobileImage') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCroppingInfo({ idx, field, file });
        // Clear value so the same file selection can trigger it again if cancelled
        e.target.value = '';
    };

    const handleCropComplete = async (croppedFile: File) => {
        if (!croppingInfo) return;
        const { idx, field } = croppingInfo;
        
        setUploading(true);
        setCroppingInfo(null);
        
        const form = new FormData();
        form.append('files', croppedFile);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            if (res.ok) {
                const data = await res.json();
                const url = data.urls[0];
                const newArr = slides.map((s, i) => i === idx ? { ...s, [field]: url } : s);
                setSlides(newArr);
            } else {
                const errData = await res.json();
                alert(`Upload failed: ${errData.error || 'Server error'}`);
            }
        } catch (e: any) {
            alert(`Upload error: ${e.message}`);
        } finally {
            setUploading(false);
        }
    };

    const addSlide = (atStart: boolean = false) => {
        const newSlide = {
            id: `slide_${Date.now()}`,
            image: '',
            mobileImage: '',
            alt: 'New Promo Banner',
            link: '/category/all'
        };
        
        if (atStart) {
            setSlides([newSlide, ...slides]);
        } else {
            setSlides([...slides, newSlide]);
        }
    };

    const updateSlide = (idx: number, field: string, value: any) => {
        const newArr = [...slides];
        newArr[idx] = { ...newArr[idx], [field]: value };
        setSlides(newArr);
    };

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

    if (loading) return <div className={styles.loadingOverlay}>Initializing Shield...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Hero Revolutions</h2>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>Manage your digital storefront banners</p>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => addSlide(true)} variant="outline">
                        <Plus size={18} /> New First
                    </Button>
                    <Button onClick={() => addSlide(false)} variant="outline">
                        <Plus size={18} /> Add Banner
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Layout'}
                    </Button>
                </div>
            </div>

            <div className={styles.bannerGrid}>
                {slides.map((slide, idx) => (
                    <div key={slide.id || idx} className={styles.bannerCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.idxBadge}>BANNER #{idx + 1}</span>
                            <div className={styles.cardActions}>
                                <button 
                                    className={styles.actionBtn} 
                                    onClick={() => moveSlide(idx, -1)} 
                                    disabled={idx === 0}
                                    title="Move Left"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    className={styles.actionBtn} 
                                    onClick={() => moveSlide(idx, 1)} 
                                    disabled={idx === slides.length - 1}
                                    title="Move Right"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <button 
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                    onClick={() => removeSlide(idx)}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.imageGroup}>
                            {/* Desktop Image */}
                            <div className={styles.inputWrapper}>
                                <label><ImageIcon size={14} inline-block className="mr-1" /> Desktop Banner (16:9)</label>
                                <div className={styles.previewBox}>
                                    {slide.image ? (
                                        <img src={slide.image} className={styles.previewImg} alt="Desktop Preview" />
                                    ) : (
                                        <div className={styles.emptyPreview}>No Image Uploaded</div>
                                    )}
                                    <label className={styles.uploadOverlay}>
                                        <Plus size={24} />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }} 
                                            onChange={e => initiateFileUpload(e, idx, 'image')} 
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Mobile Image */}
                            <div className={styles.inputWrapper}>
                                <label><Smartphone size={14} inline-block className="mr-1" /> Mobile Banner (9:16 - Opt)</label>
                                <div className={`${styles.previewBox} ${styles.mobilePreviewBox}`}>
                                    {slide.mobileImage ? (
                                        <img src={slide.mobileImage} className={styles.previewImg} alt="Mobile Preview" />
                                    ) : (
                                        <div className={styles.emptyPreview}>Vertical Image</div>
                                    )}
                                    <label className={styles.uploadOverlay}>
                                        <Plus size={24} />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }} 
                                            onChange={e => initiateFileUpload(e, idx, 'mobileImage')} 
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <label><ExternalLink size={14} inline-block className="mr-1" /> Destination URL</label>
                                <input 
                                    className={styles.input} 
                                    value={slide.link} 
                                    onChange={e => updateSlide(idx, 'link', e.target.value)} 
                                    placeholder="/category/appliances" 
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <label><LayoutDashboard size={14} inline-block className="mr-1" /> Alt Text / Label</label>
                                <input 
                                    className={styles.input} 
                                    value={slide.alt} 
                                    onChange={e => updateSlide(idx, 'alt', e.target.value)} 
                                    placeholder="Featured Deals 2024" 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <ImageIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3>No Hero Banners Found</h3>
                    <p>Start your revolution by adding a new banner.</p>
                </div>
            )}

            {/* Cropping Modal */}
            {croppingInfo && (
                <ImageCropModal 
                    file={croppingInfo.file}
                    aspectRatio={croppingInfo.field === 'image' ? 1366 / 400 : 1125 / 825}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setCroppingInfo(null)}
                />
            )}

            {uploading && (
                <div className={styles.loadingOverlay}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="animate-spin mb-2" style={{ fontSize: '2rem' }}><RefreshCcw size={40} /></div>
                        <p>Uploading to Shield...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

