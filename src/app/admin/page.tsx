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

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className={styles.heading} style={{ marginBottom: 0 }}>Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    Log Out
                </button>
            </div>
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
