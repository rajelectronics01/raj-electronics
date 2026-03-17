"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

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
    };

    const updateSlide = (idx: number, field: string, value: any) => {
        const newArr = [...slides];
        newArr[idx][field] = value;
        setSlides(newArr);
    }

    const removeSlide = (idx: number) => {
        setSlides(slides.filter((_, i) => i !== idx));
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

    const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' };
    const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: '#475569' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Manage Hero Banners</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button onClick={addSlide} variant="outline">Add Banner</Button>
                    <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {slides.map((slide, idx) => (
                    <div key={slide.id || idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <h4 style={{ fontWeight: 700 }}>Banner #{idx + 1}</h4>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} style={{ padding: '4px 8px', cursor: 'pointer' }}>↑</button>
                                <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} style={{ padding: '4px 8px', cursor: 'pointer' }}>↓</button>
                                <button onClick={() => removeSlide(idx)} style={{ padding: '4px 8px', cursor: 'pointer', color: 'red', marginLeft: '10px' }}>Delete</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Link & Alt Settings */}
                            <div>
                                <label style={labelStyle}>Click Destination Link</label>
                                <input style={inputStyle} value={slide.link} onChange={e => updateSlide(idx, 'link', e.target.value)} placeholder="/category/air-conditioners" />

                                <label style={labelStyle}>Description (Image Alt Text)</label>
                                <input style={inputStyle} value={slide.alt} onChange={e => updateSlide(idx, 'alt', e.target.value)} placeholder="Summer AC Offers" />
                            </div>

                            {/* Image Settings */}
                           <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label style={labelStyle}>Desktop Image Banner</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input style={{ ...inputStyle, marginBottom: 0 }} value={slide.image || ''} onChange={e => updateSlide(idx, 'image', e.target.value)} placeholder="/images/..." />
                                    <label style={{ cursor: 'pointer', background: '#e2e8f0', padding: '8px 12px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                        {uploadingIdx?.idx === idx && uploadingIdx.field === 'image' ? '...' : 'Upload'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, idx, 'image')} />
                                    </label>
                                </div>
                                {slide.image && <img src={slide.image} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '20px', border: '1px solid #ccc' }} />}

                                <label style={labelStyle}>Mobile Image Banner (Optional)</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input style={{ ...inputStyle, marginBottom: 0 }} value={slide.mobileImage || ''} onChange={e => updateSlide(idx, 'mobileImage', e.target.value)} placeholder="Will use desktop if omitted" />
                                    <label style={{ cursor: 'pointer', background: '#e2e8f0', padding: '8px 12px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                        {uploadingIdx?.idx === idx && uploadingIdx.field === 'mobileImage' ? '...' : 'Upload'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, idx, 'mobileImage')} />
                                    </label>
                                </div>
                                {slide.mobileImage && <img src={slide.mobileImage} style={{ width: '80px', height: '140px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {slides.length === 0 && <p style={{ color: '#64748b' }}>No banners. Add one to get started.</p>}
        </div>
    );
}
