"use client";

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { BRANDS, Product } from '@/types';
import styles from './ProductForm.module.css';

interface ProductFormProps {
    onSuccess: () => void;
    initialData?: Product | null;
    onCancel?: () => void;
}

export default function ProductForm({ onSuccess, initialData, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [scrapeUrl, setScrapeUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);

    const handleScrape = async () => {
        if (!scrapeUrl) return;

        console.log('Frontend: Starting scrape for URL:', scrapeUrl);
        setIsScraping(true);
        setError('');

        try {
            const response = await fetch(`/api/scrape-product?url=${encodeURIComponent(scrapeUrl)}`);
            console.log('Frontend: API Response status:', response.status);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch product data');
            }

            const data = await response.json();
            console.log('Frontend: Received data:', data);

            if (!data.name) {
                alert('Fetched data but could not find product details. The page format might be different or blocked.');
            }

            // Populate form fields
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) {
                if (data.name) (form.elements.namedItem('name') as HTMLInputElement).value = data.name;
                if (data.price) (form.elements.namedItem('price') as HTMLInputElement).value = data.price;
                if (data.originalPrice) (form.elements.namedItem('originalPrice') as HTMLInputElement).value = data.originalPrice;
                if (data.images && data.images.length > 0) (form.elements.namedItem('images') as HTMLInputElement).value = data.images.join(', ');
                if (data.features && data.features.length > 0) (form.elements.namedItem('features') as HTMLTextAreaElement).value = data.features.join(', ');
            }

        } catch (err: any) {
            console.error('Frontend: Scrape error:', err);
            setError(err.message || 'Failed to fetch product data. Please check the URL and try again.');
        } finally {
            setIsScraping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const imagesStr = formData.get('images') as string || '';
        console.log('Form - Images Input:', imagesStr);

        const data = {
            name: formData.get('name'),
            brand: formData.get('brand'),
            category: formData.get('category'),
            price: Number(formData.get('price')),
            originalPrice: Number(formData.get('originalPrice')),
            images: imagesStr.split(',').map(i => i.trim()).filter(i => i.length > 0),
            features: (formData.get('features') as string).split(',').map(f => f.trim()),
            isFeatured: formData.get('isFeatured') === 'on',
        };
        console.log('Form - Payload:', data);

        try {
            const url = initialData ? '/api/products' : '/api/products';
            const method = initialData ? 'PUT' : 'POST';
            const body = initialData ? { id: initialData.id, ...data } : data;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to save product');

            (e.target as HTMLFormElement).reset();
            onSuccess();
        } catch (err) {
            setError('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className={styles.title}>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
                {initialData && <Button type="button" variant="ghost" onClick={onCancel} size="sm">Cancel</Button>}
            </div>

            {!initialData && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Import from URL (Amazon/Flipkart)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Paste product URL here..."
                            className={styles.input}
                            value={scrapeUrl}
                            onChange={(e) => setScrapeUrl(e.target.value)}
                        />
                        <Button type="button" onClick={handleScrape} disabled={isScraping || !scrapeUrl}>
                            {isScraping ? 'Fetching...' : 'Fetch Data'}
                        </Button>
                    </div>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.group}>
                <label>Product Name</label>
                <input name="name" required className={styles.input} defaultValue={initialData?.name} />
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>Brand</label>
                    <input list="brand-options" name="brand" required className={styles.input} defaultValue={initialData?.brand} placeholder="Select or type brand..." />
                    <datalist id="brand-options">
                        {BRANDS.map(b => <option key={b} value={b} />)}
                    </datalist>
                </div>
                <div className={styles.group}>
                    <label>Category</label>
                    <select name="category" required className={styles.select} defaultValue={initialData?.category}>
                        <option value="Air Conditioners">Air Conditioners</option>
                        <option value="Air Coolers">Air Coolers</option>
                        <option value="Televisions">Televisions</option>
                        <option value="Refrigerators">Refrigerators</option>
                        <option value="Washing Machines">Washing Machines</option>
                        <option value="Home Appliances">Home Appliances</option>
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>Price (₹)</label>
                    <input name="price" type="number" required className={styles.input} defaultValue={initialData?.price} />
                </div>
                <div className={styles.group}>
                    <label>Original Price (₹)</label>
                    <input name="originalPrice" type="number" className={styles.input} defaultValue={initialData?.originalPrice} />
                </div>
            </div>

            <div className={styles.group}>
                <label>Image URLs (comma separated)</label>
                <input name="images" required className={styles.input} placeholder="/images/p1.jpg, /images/p2.jpg" defaultValue={initialData?.images?.join(', ')} />
            </div>

            <div className={styles.group}>
                <label>Key Features (comma separated)</label>
                <textarea
                    name="features"
                    required
                    className={styles.textarea}
                    rows={3}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    defaultValue={initialData?.features.join(', ')}
                />
            </div>

            <div className={styles.checkboxGroup}>
                <label>
                    <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} /> Featured Product
                </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
                </Button>
                {initialData && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading} style={{ flex: 1 }}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
