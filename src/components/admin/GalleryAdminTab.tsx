"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function GalleryAdminTab() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings?key=gallery')
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setImages(data.data);
                } else {
                    // default fallback
                    setImages([
                        { src: '/images/shop front.jpeg', alt: 'Shop Front View' },
                        { src: '/images/shop main.jpeg', alt: 'Main Shop Area' },
                        { src: '/images/shop in.jpeg', alt: 'Inside the Shop' },
                        { src: '/images/interior.jpeg', alt: 'Shop Interior' },
                    ]);
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
                body: JSON.stringify({ key: 'gallery', value: images })
            });
            if (res.ok) {
                alert('Gallery updated successfully!');
            } else {
                alert('Failed to update gallery.');
            }
        } catch (e) {
            alert('Error saving gallery.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);

        const form = new FormData();
        Array.from(files).forEach(f => form.append('files', f));

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            if (res.ok) {
                const data = await res.json();
                const newImgs = data.urls.map((url: string) => ({ src: url, alt: 'Store Gallery Image' }));
                setImages((prev) => [...prev, ...newImgs]);
            }
        } catch (e) {
            alert('Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx));
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Manage Store Gallery</h2>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>Upload New Photos</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                {isUploading && <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#64748b' }}>Uploading...</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {images.map((img, index) => (
                    <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                        <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#f1f5f9' }}>
                            <img src={img.src} alt={img.alt} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '10px' }}>
                            <input 
                                value={img.alt}
                                onChange={(e) => {
                                    const newArr = [...images];
                                    newArr[index].alt = e.target.value;
                                    setImages(newArr);
                                }}
                                placeholder="Alt text"
                                style={{ width: '100%', marginBottom: '10px', padding: '6px', fontSize: '0.85rem' }}
                            />
                            <button 
                                onClick={() => removeImage(index)}
                                style={{ width: '100%', padding: '6px', cursor: 'pointer', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {images.length === 0 && <p style={{ color: '#64748b' }}>No images in gallery. Upload some above!</p>}
        </div>
    );
}
