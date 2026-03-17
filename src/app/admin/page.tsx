"use client";

import { useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import OrdersTab from '@/components/admin/OrdersTab';
import HeroAdminTab from '@/components/admin/HeroAdminTab';
import GalleryAdminTab from '@/components/admin/GalleryAdminTab';
import styles from './page.module.css';

export default function AdminPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'hero' | 'gallery'>('orders');

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
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <h1 className={styles.heading} style={{ marginBottom: 0 }}>Dashboard</h1>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#0056b3' : '#fff', color: activeTab === 'orders' ? '#fff' : '#666' }}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'products' ? '#0056b3' : '#fff', color: activeTab === 'products' ? '#fff' : '#666' }}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('hero')}
                            style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'hero' ? '#0056b3' : '#fff', color: activeTab === 'hero' ? '#fff' : '#666' }}
                        >
                            Hero Banner
                        </button>
                        <button
                            onClick={() => setActiveTab('gallery')}
                            style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'gallery' ? '#0056b3' : '#fff', color: activeTab === 'gallery' ? '#fff' : '#666' }}
                        >
                            Gallery
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        Log Out
                    </button>
                </div>
                
                {activeTab === 'products' && (
                    <div className={styles.layout}>
                        <div className={styles.formSection}>
                            <ProductForm onSuccess={handleSuccess} initialData={selectedProduct} onCancel={handleCancel} />
                        </div>
                        <div className={styles.listSection}>
                            <ProductList refreshTrigger={refreshTrigger} onEdit={handleEdit} onDeleteSuccess={handleSuccess} />
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <OrdersTab />
                    </div>
                )}
                {activeTab === 'hero' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <HeroAdminTab />
                    </div>
                )}
                {activeTab === 'gallery' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <GalleryAdminTab />
                    </div>
                )}
            </div>
        </div>
    );
}
