"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import styles from './ProductList.module.css';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ProductListProps {
    refreshTrigger: number;
    onEdit: (product: Product) => void;
    onDeleteSuccess: () => void;
}

export default function ProductList({ refreshTrigger, onEdit, onDeleteSuccess }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Failed to fetch products:", data.error);
                    setProducts([]); // Fallback to empty array
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setProducts([]);
                setLoading(false);
            });
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
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>Edit</Button>
                                        <Button
                                            size="sm"
                                            style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none' }}
                                            onClick={() => handleDelete(product.id, product.name)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    async function handleDelete(id: string, name: string) {
        if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    alert('Product deleted successfully!');
                    onDeleteSuccess();
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.error || 'Failed to delete product'}`);
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('An unexpected error occurred while deleting the product.');
            }
        }
    }
}
