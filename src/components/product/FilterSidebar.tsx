"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { BRANDS } from '@/types';
import styles from './FilterSidebar.module.css';
import Button from '@/components/ui/Button';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedBrands = searchParams.getAll('brand');
    const minPrice = searchParams.get('min') || '';
    const maxPrice = searchParams.get('max') || '';

    const handleBrandChange = (brand: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedBrands.includes(brand)) {
            params.delete('brand');
            selectedBrands.filter(b => b !== brand).forEach(b => params.append('brand', b));
        } else {
            params.append('brand', brand);
        }

        router.push(`?${params.toString()}`);
    };

    const applyPriceFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const min = formData.get('min') as string;
        const max = formData.get('max') as string;
        const params = new URLSearchParams(searchParams.toString());

        if (min) params.set('min', min); else params.delete('min');
        if (max) params.set('max', max); else params.delete('max');

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('?');
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <h3 className={styles.title}>Brands</h3>
                <div className={styles.checkboxGroup}>
                    {BRANDS.map(brand => (
                        <label key={brand} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                                className={styles.checkbox}
                            />
                            {brand}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.title}>Price Range</h3>
                <form onSubmit={applyPriceFilter} className={styles.priceForm}>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            name="min"
                            placeholder="Min"
                            defaultValue={minPrice}
                            className={styles.input}
                        />
                        <span className={styles.separator}>-</span>
                        <input
                            type="number"
                            name="max"
                            placeholder="Max"
                            defaultValue={maxPrice}
                            className={styles.input}
                        />
                    </div>
                    <Button type="submit" size="sm" variant="outline" style={{ width: '100%' }}>Apply</Button>
                </form>
            </div>

            {(selectedBrands.length > 0 || minPrice || maxPrice) && (
                <Button onClick={clearFilters} variant="ghost" size="sm" style={{ width: '100%', marginTop: '10px' }}>
                    Clear Filters
                </Button>
            )}
        </aside>
    );
}
