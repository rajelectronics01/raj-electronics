"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import styles from './ProductList.module.css';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ProductListProps {
    refreshTrigger: number;
    onEdit: (product: Product) => void;
}

export default function ProductList({ refreshTrigger, onEdit }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [refreshTrigger]);

    if (loading) return <div>Loading products...</div>;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>All Products ({products.length})</h3>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                                        alt={product.name}
                                        className={styles.thumb}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>{product.category}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.isFeatured ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
