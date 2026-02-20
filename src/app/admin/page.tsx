"use client";

import { useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import styles from './page.module.css';

export default function AdminPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedProduct(null);
        alert('Product saved successfully!');
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="container section">
            <h1 className={styles.heading}>Admin Dashboard</h1>
            <div className={styles.layout}>
                <div className={styles.formSection}>
                    <ProductForm
                        onSuccess={handleSuccess}
                        initialData={selectedProduct}
                        onCancel={handleCancel}
                    />
                </div>
                <div className={styles.listSection}>
                    <ProductList
                        refreshTrigger={refreshTrigger}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    );
}
