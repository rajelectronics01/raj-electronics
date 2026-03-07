"use client";

import { useState, useEffect } from 'react';
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

    // Form states
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        brand: initialData?.brand || '',
        category: initialData?.category || 'Air Conditioners',
        price: initialData?.price?.toString() || '',
        originalPrice: initialData?.originalPrice?.toString() || '',
        images: initialData?.images?.join(', ') || '',
        features: initialData?.features?.join(', ') || '',
        isFeatured: initialData?.isFeatured || false,
    });
    // Sync form state when initialData changes (e.g., clicking edit on different products)
    useEffect(() => {
        setFormData({
            name: initialData?.name || '',
            brand: initialData?.brand || '',
            category: initialData?.category || 'Air Conditioners',
            price: initialData?.price?.toString() || '',
            originalPrice: initialData?.originalPrice?.toString() || '',
            images: initialData?.images?.join(', ') || '',
            features: initialData?.features?.join(', ') || '',
            isFeatured: initialData?.isFeatured || false,
        });
        setScrapeUrl('');
        setError('');
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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

            // Simple mapping for common categories
            let category = formData.category;
            if (data.category) {
                const scrapedCat = data.category.toLowerCase();
                if (scrapedCat.includes('conditioner') || scrapedCat.includes('ac')) category = 'Air Conditioners';
                else if (scrapedCat.includes('cool')) category = 'Air Coolers';
                else if (scrapedCat.includes('tv') || scrapedCat.includes('television')) category = 'Televisions';
                else if (scrapedCat.includes('fridge') || scrapedCat.includes('refrigerator')) category = 'Refrigerators';
                else if (scrapedCat.includes('wash') || scrapedCat.includes('machine')) category = 'Washing Machines';
                else if (scrapedCat.includes('dispenser') || scrapedCat.includes('water')) category = 'Water Dispensers';
                else if (scrapedCat.includes('freezer') || scrapedCat.includes('chest')) category = 'Chest Freezers';
            } else if (data.name) {
                // Try from name
                const name = data.name.toLowerCase();
                if (name.includes('air conditioner') || name.includes('split ac') || name.includes('window ac')) category = 'Air Conditioners';
                else if (name.includes('cooler')) category = 'Air Coolers';
                else if (name.includes('tv') || name.includes('television') || name.includes('led')) category = 'Televisions';
                else if (name.includes('fridge') || name.includes('refrigerator')) category = 'Refrigerators';
                else if (name.includes('wash')) category = 'Washing Machines';
                else if (name.includes('dispenser') || name.includes('water purifier')) category = 'Water Dispensers';
                else if (name.includes('freezer') || name.includes('deep freezer')) category = 'Chest Freezers';
            }

            // Populate form fields directly via state
            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                brand: data.brand || prev.brand,
                category: category || prev.category,
                price: data.price || prev.price,
                originalPrice: data.originalPrice || prev.originalPrice,
                images: data.images ? data.images.join(', ') : prev.images,
                features: data.features ? data.features.join(', ') : prev.features,
            }));

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

        const data = {
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            images: formData.images.split(',').map(i => i.trim()).filter(i => i.length > 0),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
            isFeatured: formData.isFeatured,
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

            setFormData({
                name: '',
                brand: '',
                category: 'Air Conditioners',
                price: '',
                originalPrice: '',
                images: '',
                features: '',
                isFeatured: false,
            });
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
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Import from URL (Amazon, Flipkart, or Brand Websites)</label>
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
                <input
                    name="name"
                    required
                    className={styles.input}
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>Brand</label>
                    <input
                        list="brand-options"
                        name="brand"
                        required
                        className={styles.input}
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Select or type brand..."
                    />
                    <datalist id="brand-options">
                        {BRANDS.map(b => <option key={b} value={b} />)}
                    </datalist>
                </div>
                <div className={styles.group}>
                    <label>Category</label>
                    <select
                        name="category"
                        required
                        className={styles.select}
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        <option value="Air Conditioners">Air Conditioners</option>
                        <option value="Air Coolers">Air Coolers</option>
                        <option value="Televisions">Televisions</option>
                        <option value="Refrigerators">Refrigerators</option>
                        <option value="Washing Machines">Washing Machines</option>
                        <option value="Home Appliances">Home Appliances</option>
                        <option value="Water Dispensers">Water Dispensers</option>
                        <option value="Chest Freezers">Chest Freezers</option>
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>Price (₹)</label>
                    <input
                        name="price"
                        type="number"
                        required
                        className={styles.input}
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.group}>
                    <label>Original Price (₹)</label>
                    <input
                        name="originalPrice"
                        type="number"
                        className={styles.input}
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className={styles.group}>
                <label>Image URLs (comma separated)</label>
                <input
                    name="images"
                    required
                    className={styles.input}
                    placeholder="/images/p1.jpg, /images/p2.jpg"
                    value={formData.images}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.group}>
                <label>Key Features (comma separated)</label>
                <textarea
                    name="features"
                    required
                    className={styles.textarea}
                    rows={3}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={formData.features}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.checkboxGroup}>
                <label>
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                    /> Featured Product
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
