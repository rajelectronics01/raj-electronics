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
    const [isUploading, setIsUploading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        brand: initialData?.brand || '',
        category: initialData?.category || 'Air Conditioners',
        price: initialData?.price?.toString() || '',
        originalPrice: initialData?.originalPrice?.toString() || '',
        images: initialData?.images?.join(', ') || '',
        features: initialData?.features?.join(', ') || '',
        seoKeywords: (initialData as any)?.seoKeywords || '',
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
            seoKeywords: (initialData as any)?.seoKeywords || '',
            isFeatured: initialData?.isFeatured || false,
        });
        setScrapeUrl('');
        setError('');
        setGeneratedKeywords([]);
        setGeneratedFeatures([]);
    }, [initialData]);

    const [generatedKeywords, setGeneratedKeywords] = useState<{type: string, words: string[]}[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
    const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

    const [generatedFeatures, setGeneratedFeatures] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
    const [isGeneratingFeatures, setIsGeneratingFeatures] = useState(false);

    const handleGenerateFeatures = async () => {
        if (!formData.name || !formData.category) {
            alert('Please enter product name and choose category first');
            return;
        }
        setIsGeneratingFeatures(true);
        try {
            const res = await fetch('/api/ai-features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: formData.name, category: formData.category, brand: formData.brand })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const features: string[] = data.features || [];
            if (!Array.isArray(features)) {
                throw new Error("Invalid format received from AI.");
            }
            setGeneratedFeatures(features);
            setSelectedFeatures(new Set(features));
        } catch (err: any) {
            alert('Error generating features: ' + err.message);
        } finally {
            setIsGeneratingFeatures(false);
        }
    };

    const toggleFeature = (feat: string) => {
        const newSet = new Set(selectedFeatures);
        if (newSet.has(feat)) newSet.delete(feat);
        else newSet.add(feat);
        setSelectedFeatures(newSet);
    };

    const addFeaturesToField = () => {
        const toAdd = Array.from(selectedFeatures).join(', ');
        setFormData(prev => ({
            ...prev,
            features: prev.features ? `${prev.features}, ${toAdd}` : toAdd
        }));
        setGeneratedFeatures([]);
    };

    const copyAllFeatures = () => {
        navigator.clipboard.writeText(Array.from(selectedFeatures).join('\n'));
        alert('Copied to clipboard');
    };

    const handleGenerateKeywords = async () => {
        if (!formData.name || !formData.category) {
            alert('Please enter product name and choose category first');
            return;
        }
        setIsGeneratingKeywords(true);
        try {
            const res = await fetch('/api/ai-keywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: formData.name, category: formData.category })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const words: string[] = data.keywords || [];
            
            const grouped: Record<string, string[]> = {
                'Local SEO': [],
                'Buying Intent': [],
                'Bulk/B2B': [],
                'Long Tail': [],
                'High Volume': []
            };

            words.forEach(w => {
                const lw = w.toLowerCase();
                if (lw.includes('hyderabad') || lw.includes('secunderabad') || lw.includes('near') || lw.includes('india')) {
                    grouped['Local SEO'].push(w);
                } else if (lw.includes('bulk') || lw.includes('wholesale') || lw.includes('dealer') || lw.includes('supplier')) {
                    grouped['Bulk/B2B'].push(w);
                } else if (lw.includes('buy') || lw.includes('price') || lw.includes('best') || lw.includes('cheap') || lw.includes('discount')) {
                    grouped['Buying Intent'].push(w);
                } else if (w.split(' ').length > 4 || lw.length > 25) {
                    grouped['Long Tail'].push(w);
                } else {
                    grouped['High Volume'].push(w);
                }
            });

            const resultArr = Object.entries(grouped)
                                .filter(([_, arr]) => arr.length > 0)
                                .map(([type, arr]) => ({ type, words: arr }));

            setGeneratedKeywords(resultArr);
            setSelectedKeywords(new Set(words));
        } catch (err: any) {
            alert('Error generating keywords: ' + err.message);
        } finally {
            setIsGeneratingKeywords(false);
        }
    };

    const toggleKeyword = (kw: string) => {
        const newSet = new Set(selectedKeywords);
        if (newSet.has(kw)) newSet.delete(kw);
        else newSet.add(kw);
        setSelectedKeywords(newSet);
    };

    const addKeywordsToField = () => {
        const toAdd = Array.from(selectedKeywords).join(', ');
        setFormData(prev => ({
            ...prev,
            seoKeywords: prev.seoKeywords ? `${prev.seoKeywords}, ${toAdd}` : toAdd
        }));
        setGeneratedKeywords([]);
    };

    const copyAllKeywords = () => {
        navigator.clipboard.writeText(Array.from(selectedKeywords).join(', '));
        alert('Copied to clipboard');
    };

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
            } else if (!data.images || data.images.length === 0) {
                alert('Details fetched perfectly, but the retailer blocked automated image extraction. Please right-click the image on their site, select "Copy Image Address", and paste it into the Images field manually.');
            }

            // Simple mapping for common categories
            let category = formData.category;
            if (data.category) {
                const scrapedCat = data.category.toLowerCase();
                if (scrapedCat.includes('conditioner') || scrapedCat.includes('ac')) {
                    if (scrapedCat.includes('window')) category = 'Window AC';
                    else if (scrapedCat.includes('tower') || scrapedCat.includes('vertical')) category = 'Tower AC';
                    else category = 'Split AC';
                }
                else if (scrapedCat.includes('cool')) category = 'Air Coolers';
                else if (scrapedCat.includes('tv') || scrapedCat.includes('television')) category = 'Televisions';
                else if (scrapedCat.includes('fridge') || scrapedCat.includes('refrigerator')) category = 'Refrigerators';
                else if (scrapedCat.includes('wash') || scrapedCat.includes('machine')) category = 'Washing Machines';
                else if (scrapedCat.includes('dispenser') || scrapedCat.includes('water')) category = 'Water Dispensers';
                else if (scrapedCat.includes('freezer') || scrapedCat.includes('chest')) category = 'Chest Freezers';
                else if (scrapedCat.includes('phone') || scrapedCat.includes('mobile')) category = 'Mobile Phones';
            } else if (data.name) {
                // Try from name
                const name = data.name.toLowerCase();
                if (name.includes('air conditioner') || name.includes('ac')) {
                    if (name.includes('window')) category = 'Window AC';
                    else if (name.includes('tower') || name.includes('vertical')) category = 'Tower AC';
                    else category = 'Split AC';
                }
                else if (name.includes('cooler')) category = 'Air Coolers';
                else if (name.includes('tv') || name.includes('television') || name.includes('led')) category = 'Televisions';
                else if (name.includes('fridge') || name.includes('refrigerator')) category = 'Refrigerators';
                else if (name.includes('wash')) category = 'Washing Machines';
                else if (name.includes('dispenser') || name.includes('water purifier')) category = 'Water Dispensers';
                else if (name.includes('freezer') || name.includes('deep freezer')) category = 'Chest Freezers';
                else if (name.includes('phone') || name.includes('smartphone')) category = 'Mobile Phones';
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError('');

        const form = new FormData();
        Array.from(files).forEach((file) => {
            form.append('files', file);
        });

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: form
            });

            if (res.ok) {
                const data = await res.json();
                const currentImages = formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : [];
                const newImages = [...currentImages, ...data.urls].join(', ');
                setFormData(prev => ({ ...prev, images: newImages }));
            } else {
                const errData = await res.json();
                setError(`Upload failed: ${errData.error || 'Server error'}`);
            }
        } catch (err: any) {
            setError(`Upload error: ${err.message}`);
        } finally {
            setIsUploading(false);
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
            seoKeywords: formData.seoKeywords,
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
                seoKeywords: '',
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
                        <option value="Split AC">Split AC</option>
                        <option value="Window AC">Window AC</option>
                        <option value="Tower AC">Tower AC</option>
                        <option value="Air Conditioners">All Air Conditioners</option>
                        <option value="Mobile Phones">Mobile Phones</option>
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
                <label>Images</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                        style={{ padding: '8px', border: '1px dashed #ccc', width: '100%', borderRadius: '4px' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{isUploading ? 'Uploading...' : 'Upload from your computer, or paste URLs below'}</span>
                    <input
                        name="images"
                        required
                        className={styles.input}
                        placeholder="/images/p1.jpg, /images/p2.jpg"
                        value={formData.images}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className={styles.group}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ margin: 0 }}>Key Features (comma separated)</label>
                    <Button type="button" size="sm" onClick={handleGenerateFeatures} disabled={isGeneratingFeatures}>
                        {isGeneratingFeatures ? 'Generating ⏳' : '✨ AI Generate Features'}
                    </Button>
                </div>
                
                {generatedFeatures.length > 0 && (
                    <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#166534' }}>Select Features to Add:</strong>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button type="button" size="sm" variant="outline" onClick={copyAllFeatures}>Copy All</Button>
                                <Button type="button" size="sm" onClick={addFeaturesToField}>Add to Field</Button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {generatedFeatures.map(f => {
                                const isSelected = selectedFeatures.has(f);
                                return (
                                    <span 
                                        key={f} 
                                        onClick={() => toggleFeature(f)}
                                        style={{ 
                                            padding: '5px 12px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.85rem', 
                                            cursor: 'pointer',
                                            border: isSelected ? '1px solid #22c55e' : '1px solid #cbd5e1',
                                            backgroundColor: isSelected ? '#dcfce7' : '#fff',
                                            color: isSelected ? '#166534' : '#475569',
                                            transition: 'all 0.1s'
                                        }}
                                    >
                                        {f} {isSelected ? '×' : '+'}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

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

            <div className={styles.group}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ margin: 0 }}>SEO Keywords (Tags)</label>
                    <Button type="button" size="sm" onClick={handleGenerateKeywords} disabled={isGeneratingKeywords}>
                        {isGeneratingKeywords ? 'Generating ⏳' : '✨ AI Generate Keywords'}
                    </Button>
                </div>
                
                {generatedKeywords.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#334155' }}>Select Keywords to Add:</strong>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button type="button" size="sm" variant="outline" onClick={copyAllKeywords}>Copy All</Button>
                                <Button type="button" size="sm" onClick={addKeywordsToField}>Add to Field</Button>
                            </div>
                        </div>
                        {generatedKeywords.map((group) => (
                            <div key={group.type} style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>{group.type}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {group.words.map(w => {
                                        const isSelected = selectedKeywords.has(w);
                                        return (
                                            <span 
                                                key={w} 
                                                onClick={() => toggleKeyword(w)}
                                                style={{ 
                                                    padding: '3px 10px', 
                                                    borderRadius: '99px', 
                                                    fontSize: '0.8rem', 
                                                    cursor: 'pointer',
                                                    border: isSelected ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                                                    backgroundColor: isSelected ? '#eff6ff' : '#fff',
                                                    color: isSelected ? '#1d4ed8' : '#475569',
                                                    transition: 'all 0.1s'
                                                }}
                                            >
                                                {w} {isSelected ? '×' : '+'}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <textarea
                    name="seoKeywords"
                    className={styles.textarea}
                    rows={2}
                    placeholder="bulk ac hyderabad, best tv secunderabad..."
                    value={formData.seoKeywords}
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
